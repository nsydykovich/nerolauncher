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
