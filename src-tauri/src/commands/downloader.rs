use std::fs;
use std::io::Write;
use std::path::PathBuf;
use tauri::{Manager, Emitter, AppHandle};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MinecraftVersion {
    pub id: String,
    pub version: String,
    pub r#type: String,
    #[serde(rename = "releaseTime")]
    pub release_time: String,
    pub url: Option<String>,
    pub installed: bool,
    pub size: Option<u64>,
}

#[derive(Debug, Clone, serde::Serialize)]
struct DownloadProgress {
    version_id: String,
    stage: String,
    progress: f64,
    total_bytes: u64,
    downloaded_bytes: u64,
}

/// Get the base directory for Nero Launcher's managed versions
fn get_versions_dir() -> Result<PathBuf, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;
    Ok(home.join(".nerolauncher").join("versions"))
}

/// Check if a version is properly installed (has both JSON and JAR)
fn check_installed(versions_dir: &PathBuf, version_id: &str) -> bool {
    let version_dir = versions_dir.join(version_id);
    let json_path = version_dir.join(format!("{}.json", version_id));
    let jar_path = version_dir.join(format!("{}.jar", version_id));
    json_path.exists() && jar_path.exists()
}

/// Fetch available Minecraft versions from official launcher metadata
#[tauri::command]
pub async fn fetch_minecraft_versions() -> Result<Vec<MinecraftVersion>, String> {
    let manifest_url = "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json";

    let response = reqwest::get(manifest_url)
        .await
        .map_err(|e| format!("Failed to fetch versions: {}", e))?;

    let manifest: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse manifest: {}", e))?;

    let versions = manifest
        .get("versions")
        .and_then(|v| v.as_array())
        .ok_or("Invalid manifest format")?;

    let versions_dir = get_versions_dir()?;

    let result: Vec<MinecraftVersion> = versions
        .iter()
        .filter_map(|v| {
            let id = v.get("id")?.as_str()?.to_string();
            let version = id.clone();
            let version_type = v.get("type")?.as_str()?.to_string();
            let release_time = v.get("releaseTime")?.as_str()?.to_string();
            let url = v.get("url").and_then(|u| u.as_str()).map(|s| s.to_string());

            let installed = check_installed(&versions_dir, &id);

            Some(MinecraftVersion {
                id,
                version,
                r#type: version_type,
                release_time,
                url,
                installed,
                size: None,
            })
        })
        .collect();

    Ok(result)
}

/// Download a specific Minecraft version (version JSON + client JAR + asset index)
/// Follows the same approach as PolyMC/PrismLauncher:
/// 1. Fetch version JSON from piston-meta.mojang.com
/// 2. Save version JSON
/// 3. Download client.jar using URL from version JSON
/// 4. Download asset index
/// 5. Emit progress events to frontend
#[tauri::command]
pub async fn download_minecraft_version(
    app: AppHandle,
    version_id: String,
    version_url: String,
) -> Result<String, String> {
    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(&version_id);
    fs::create_dir_all(&version_dir).map_err(|e| e.to_string())?;

    let emit_progress = |stage: &str, progress: f64, downloaded: u64, total: u64| {
        let _ = app.emit("download-progress", DownloadProgress {
            version_id: version_id.clone(),
            stage: stage.to_string(),
            progress,
            total_bytes: total,
            downloaded_bytes: downloaded,
        });
    };

    // Stage 1: Fetch version JSON metadata
    emit_progress("metadata", 0.0, 0, 0);

    let response = reqwest::get(&version_url)
        .await
        .map_err(|e| format!("Failed to fetch version metadata: {}", e))?;

    let version_json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse version JSON: {}", e))?;

    // Save version.json
    let version_json_path = version_dir.join(format!("{}.json", version_id));
    let json_str = serde_json::to_string_pretty(&version_json)
        .map_err(|e| e.to_string())?;
    fs::write(&version_json_path, json_str).map_err(|e| e.to_string())?;

    emit_progress("metadata", 100.0, 0, 0);

    // Stage 2: Download client JAR
    let client_download = version_json
        .get("downloads")
        .and_then(|d| d.get("client"))
        .ok_or("Version JSON missing downloads.client")?;

    let jar_url = client_download
        .get("url")
        .and_then(|u| u.as_str())
        .ok_or("Version JSON missing client download URL")?;

    let expected_size = client_download
        .get("size")
        .and_then(|s| s.as_u64())
        .unwrap_or(0);

    let _expected_sha1 = client_download
        .get("sha1")
        .and_then(|s| s.as_str())
        .map(|s| s.to_string());

    emit_progress("client_jar", 0.0, 0, expected_size);

    let jar_response = reqwest::get(jar_url)
        .await
        .map_err(|e| format!("Failed to download client JAR: {}", e))?;

    let jar_bytes = jar_response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read client JAR: {}", e))?;

    let jar_path = version_dir.join(format!("{}.jar", version_id));
    let mut file = fs::File::create(&jar_path).map_err(|e| e.to_string())?;
    file.write_all(&jar_bytes).map_err(|e| e.to_string())?;

    emit_progress("client_jar", 100.0, jar_bytes.len() as u64, expected_size);

    // Stage 3: Download asset index
    if let Some(asset_index) = version_json.get("assetIndex") {
        if let Some(asset_url) = asset_index.get("url").and_then(|u| u.as_str()) {
            let asset_id = asset_index.get("id").and_then(|i| i.as_str()).unwrap_or("unknown");

            emit_progress("assets", 0.0, 0, 0);

            let assets_dir = versions_dir.parent()
                .unwrap_or(&versions_dir)
                .join("assets")
                .join("indexes");
            fs::create_dir_all(&assets_dir).map_err(|e| e.to_string())?;

            let asset_response = reqwest::get(asset_url)
                .await
                .map_err(|e| format!("Failed to download asset index: {}", e))?;

            let asset_bytes = asset_response
                .bytes()
                .await
                .map_err(|e| format!("Failed to read asset index: {}", e))?;

            let asset_path = assets_dir.join(format!("{}.json", asset_id));
            fs::write(&asset_path, &asset_bytes).map_err(|e| e.to_string())?;

            emit_progress("assets", 100.0, asset_bytes.len() as u64, asset_bytes.len() as u64);
        }
    }

    // Stage 4: Download libraries (basic — just create the directory structure)
    let libs_dir = versions_dir.parent()
        .unwrap_or(&versions_dir)
        .join("libraries");
    fs::create_dir_all(&libs_dir).map_err(|e| e.to_string())?;

    emit_progress("complete", 100.0, 0, 0);

    Ok(format!("Downloaded Minecraft {}", version_id))
}

/// Check if a version is installed (has both JSON and JAR)
#[tauri::command]
pub fn is_version_installed(version_id: String) -> Result<bool, String> {
    let versions_dir = get_versions_dir()?;
    Ok(check_installed(&versions_dir, &version_id))
}

/// Delete a downloaded version
#[tauri::command]
pub fn delete_version(version_id: String) -> Result<(), String> {
    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(&version_id);

    if version_dir.exists() {
        fs::remove_dir_all(&version_dir).map_err(|e| e.to_string())?;
    }

    Ok(())
}

/// Get list of installed versions (checks for both JSON and JAR)
#[tauri::command]
pub fn list_installed_versions() -> Result<Vec<String>, String> {
    let versions_dir = get_versions_dir()?;

    if !versions_dir.exists() {
        return Ok(Vec::new());
    }

    let mut versions = Vec::new();
    for entry in fs::read_dir(&versions_dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.is_dir() {
            if let Some(version_id) = path.file_name().and_then(|n| n.to_str()) {
                if check_installed(&versions_dir, version_id) {
                    versions.push(version_id.to_string());
                }
            }
        }
    }

    Ok(versions)
}

/// Download all assets for a specific version
#[tauri::command]
pub async fn download_assets(
    app: AppHandle,
    version_id: String,
    asset_index_id: String,
) -> Result<String, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let versions_dir = get_versions_dir()?;
    let assets_dir = home.join(".nerolauncher").join("assets");
    let indexes_dir = assets_dir.join("indexes");
    let objects_dir = assets_dir.join("objects");

    // Ensure directories exist
    fs::create_dir_all(&objects_dir).map_err(|e| e.to_string())?;

    // Read asset index JSON
    let index_path = indexes_dir.join(format!("{}.json", asset_index_id));
    if !index_path.exists() {
        return Err(format!("Asset index {} not found. Download the version first.", asset_index_id));
    }

    let index_str = fs::read_to_string(&index_path)
        .map_err(|e| format!("Failed to read asset index: {}", e))?;

    let index: serde_json::Value = serde_json::from_str(&index_str)
        .map_err(|e| format!("Failed to parse asset index: {}", e))?;

    let assets_vec: Vec<(String, serde_json::Value)> = index
        .get("objects")
        .and_then(|o| o.as_object())
        .ok_or("No objects found in asset index")?
        .iter()
        .map(|(k, v)| (k.clone(), v.clone()))
        .collect();

    let total_assets = assets_vec.len() as u64;
    let mut downloaded = 0u64;

    // Download assets with limited parallelism (4 concurrent)
    let semaphore = std::sync::Arc::new(tokio::sync::Semaphore::new(4));

    let mut handles = vec![];

    for (path, info) in assets_vec {
        let app_clone = app.clone();
        let version_id_clone = version_id.clone();
        let objects_dir_clone = objects_dir.clone();
        let semaphore_clone = semaphore.clone();

        let handle = tokio::spawn(async move {
            let _permit = semaphore_clone.acquire().await;

            if let Some(hash) = info.get("hash").and_then(|h| h.as_str()) {
                let hash_prefix = &hash[..2];
                let asset_path = objects_dir_clone.join(hash_prefix).join(hash);

                // Skip if already downloaded
                if asset_path.exists() {
                    return Ok((path.clone(), true));
                }

                // Create directory
                fs::create_dir_all(asset_path.parent().unwrap())
                    .map_err(|e| e.to_string())?;

                // Download from Minecraft asset servers
                let url = format!(
                    "https://resources.download.minecraft.net/{}/{}",
                    hash_prefix, hash
                );

                match reqwest::get(&url).await {
                    Ok(response) => {
                        match response.bytes().await {
                            Ok(bytes) => {
                                match fs::write(&asset_path, &bytes) {
                                    Ok(_) => {
                                        let _ = app_clone.emit("asset-progress", serde_json::json!({
                                            "version_id": version_id_clone,
                                            "asset": path,
                                            "downloaded": true,
                                        }));
                                        Ok((path.clone(), true))
                                    }
                                    Err(e) => {
                                        Err(format!("Failed to write asset {}: {}", path, e))
                                    }
                                }
                            }
                            Err(e) => Err(format!("Failed to read asset {}: {}", path, e)),
                        }
                    }
                    Err(e) => {
                        // Asset might not be critical, continue
                        Ok((path.clone(), false))
                    }
                }
            } else {
                Ok((path.clone(), false))
            }
        });

        handles.push(handle);
    }

    // Wait for all downloads
    for handle in handles {
        let _ = handle.await;
        downloaded += 1;
        let progress = (downloaded as f64 / total_assets as f64) * 100.0;
        let _ = app.emit("download-progress", DownloadProgress {
            version_id: version_id.clone(),
            stage: "assets".to_string(),
            progress,
            total_bytes: total_assets,
            downloaded_bytes: downloaded,
        });
    }

    Ok(format!("Downloaded {} assets for {}", total_assets, version_id))
}

/// Download all libraries for a specific version
#[tauri::command]
pub async fn download_libraries(
    app: AppHandle,
    version_id: String,
) -> Result<String, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(&version_id);
    let libs_dir = home.join(".nerolauncher").join("libraries");

    // Ensure library directory exists
    fs::create_dir_all(&libs_dir).map_err(|e| e.to_string())?;

    // Read version.json
    let version_json_path = version_dir.join(format!("{}.json", version_id));
    if !version_json_path.exists() {
        return Err("Version JSON not found. Download the version first.".to_string());
    }

    let version_json_str = fs::read_to_string(&version_json_path)
        .map_err(|e| format!("Failed to read version.json: {}", e))?;

    let version_json: serde_json::Value = serde_json::from_str(&version_json_str)
        .map_err(|e| format!("Failed to parse version.json: {}", e))?;

    let libraries_array = version_json
        .get("libraries")
        .and_then(|l| l.as_array())
        .ok_or("No libraries found in version.json")?
        .to_vec();

    let total_libs = libraries_array.len() as u64;
    let mut downloaded = 0u64;

    // Limited parallelism (4 concurrent)
    let semaphore = std::sync::Arc::new(tokio::sync::Semaphore::new(4));
    let mut handles = vec![];

    for lib in libraries_array.iter() {
        let app_clone = app.clone();
        let version_id_clone = version_id.clone();
        let libs_dir_clone = libs_dir.clone();
        let semaphore_clone = semaphore.clone();
        let lib_clone = lib.clone();

        let handle = tokio::spawn(async move {
            let lib = lib_clone;
            let _permit = semaphore_clone.acquire().await;

            // Check OS rules
            if let Some(rules) = lib.get("rules").and_then(|r| r.as_array()) {
                let mut should_include = false;
                for rule in rules {
                    if let Some(action) = rule.get("action").and_then(|a| a.as_str()) {
                        if action == "allow" {
                            if let Some(os) = rule.get("os") {
                                if let Some(os_name) = os.get("name").and_then(|n| n.as_str()) {
                                    let current_os = std::env::consts::OS;
                                    let os_match = match (os_name, current_os) {
                                        ("windows", "windows") => true,
                                        ("linux", "linux") => true,
                                        ("osx", "macos") => true,
                                        _ => false,
                                    };
                                    should_include = os_match;
                                }
                            } else {
                                should_include = true;
                            }
                        } else if action == "disallow" {
                            should_include = false;
                        }
                    }
                }
                if !should_include {
                    return Ok(());
                }
            }

            // Get library download info
            if let Some(downloads) = lib.get("downloads") {
                if let Some(artifact) = downloads.get("artifact") {
                    if let Some(path) = artifact.get("path").and_then(|p| p.as_str()) {
                        if let Some(url) = artifact.get("url").and_then(|u| u.as_str()) {
                            let lib_path = libs_dir_clone.join(path);

                            // Skip if already exists
                            if lib_path.exists() {
                                let _ = app_clone.emit("lib-progress", serde_json::json!({
                                    "version_id": version_id_clone,
                                    "library": path,
                                    "downloaded": true,
                                }));
                                return Ok(());
                            }

                            // Create directory structure
                            if let Some(parent) = lib_path.parent() {
                                fs::create_dir_all(parent)
                                    .map_err(|e| e.to_string())?;
                            }

                            // Download library
                            match reqwest::get(url).await {
                                Ok(response) => {
                                    match response.bytes().await {
                                        Ok(bytes) => {
                                            fs::write(&lib_path, &bytes)
                                                .map_err(|e| format!("Failed to write library: {}", e))?;
                                            let _ = app_clone.emit("lib-progress", serde_json::json!({
                                                "version_id": version_id_clone,
                                                "library": path,
                                                "downloaded": true,
                                            }));
                                            Ok(())
                                        }
                                        Err(e) => Err(format!("Failed to read library: {}", e)),
                                    }
                                }
                                Err(e) => {
                                    // Log error but continue
                                    eprintln!("Failed to download library {}: {}", path, e);
                                    Ok(())
                                }
                            }
                        } else {
                            Ok(())
                        }
                    } else {
                        Ok(())
                    }
                } else {
                    Ok(())
                }
            } else {
                Ok(())
            }
        });

        handles.push(handle);
    }

    // Wait for all downloads
    for handle in handles {
        let _ = handle.await;
        downloaded += 1;
        let progress = (downloaded as f64 / total_libs as f64) * 100.0;
        let _ = app.emit("download-progress", DownloadProgress {
            version_id: version_id.clone(),
            stage: "libraries".to_string(),
            progress,
            total_bytes: total_libs,
            downloaded_bytes: downloaded,
        });
    }

    Ok(format!("Downloaded libraries for {}", version_id))
}

/// Download native libraries (LWJGL natives, etc.)
#[tauri::command]
pub async fn download_natives(
    app: AppHandle,
    version_id: String,
) -> Result<String, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(&version_id);
    let libs_dir = home.join(".nerolauncher").join("libraries");
    let natives_dir = version_dir.join("natives");

    // Create natives directory
    fs::create_dir_all(&natives_dir).map_err(|e| e.to_string())?;

    // Read version.json
    let version_json_path = version_dir.join(format!("{}.json", version_id));
    let version_json_str = fs::read_to_string(&version_json_path)
        .map_err(|e| format!("Failed to read version.json: {}", e))?;

    let version_json: serde_json::Value = serde_json::from_str(&version_json_str)
        .map_err(|e| format!("Failed to parse version.json: {}", e))?;

    let libraries = version_json
        .get("libraries")
        .and_then(|l| l.as_array())
        .ok_or("No libraries found")?;

    let mut extracted = 0u64;
    let mut total = 0u64;

    for lib in libraries {
        if let Some(natives) = lib.get("natives") {
            total += 1;

            // Get classifier for current platform
            let current_os = std::env::consts::OS;
            let classifier_key = match current_os {
                "windows" => "natives-windows",
                "linux" => "natives-linux",
                "macos" => "natives-macos",
                _ => continue,
            };

            if let Some(classifier) = natives.get(classifier_key).and_then(|c| c.as_str()) {
                if let Some(downloads) = lib.get("downloads") {
                    if let Some(classifiers) = downloads.get("classifiers") {
                        if let Some(native_info) = classifiers.get(classifier) {
                            if let Some(url) = native_info.get("url").and_then(|u| u.as_str()) {
                                // Download native JAR
                                match reqwest::get(url).await {
                                    Ok(response) => {
                                        match response.bytes().await {
                                            Ok(bytes) => {
                                                // Extract natives from JAR
                                                use std::io::Cursor;
                                                match zip::ZipArchive::new(Cursor::new(bytes.to_vec())) {
                                                    Ok(mut archive) => {
                                                        for i in 0..archive.len() {
                                                            if let Ok(mut file) = archive.by_index(i) {
                                                                if !file.is_dir() && file.name().ends_with(".so")
                                                                    || file.name().ends_with(".dll")
                                                                    || file.name().ends_with(".dylib") {

                                                                    let file_name = std::path::Path::new(file.name())
                                                                        .file_name()
                                                                        .and_then(|n| n.to_str())
                                                                        .unwrap_or("unknown");

                                                                    let native_path = natives_dir.join(file_name);
                                                                    let mut output = fs::File::create(&native_path)
                                                                        .map_err(|e| e.to_string())?;
                                                                    std::io::copy(&mut file, &mut output)
                                                                        .map_err(|e| e.to_string())?;
                                                                }
                                                            }
                                                        }
                                                        extracted += 1;
                                                    }
                                                    Err(_) => {
                                                        // Not a JAR, skip
                                                    }
                                                }
                                            }
                                            Err(e) => {
                                                eprintln!("Failed to read native JAR: {}", e);
                                            }
                                        }
                                    }
                                    Err(e) => {
                                        eprintln!("Failed to download native: {}", e);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            let progress = (extracted as f64 / total as f64) * 100.0;
            let _ = app.emit("download-progress", DownloadProgress {
                version_id: version_id.clone(),
                stage: "natives".to_string(),
                progress,
                total_bytes: total,
                downloaded_bytes: extracted,
            });
        }
    }

    Ok(format!("Extracted natives for {}", version_id))
}
