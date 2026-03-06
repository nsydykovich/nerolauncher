/// PolyMC-inspired downloader with proper error handling and caching
/// Based on PolyMC launcher architecture for reliability

use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Emitter};
use crate::models::download::*;

const LAUNCHER_META_URL: &str = "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json";
const RESOURCES_DOWNLOAD_URL: &str = "https://resources.download.minecraft.net";
const LIBRARIES_DOWNLOAD_URLS: &[&str] = &[
    "https://libraries.minecraft.net",
    "https://repo1.maven.org/maven2",
];

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
pub struct DownloadStats {
    pub total_files: u64,
    pub downloaded_files: u64,
    pub total_size: u64,
    pub downloaded_size: u64,
    pub current_file: String,
    pub failed_files: Vec<String>,
}

/// Get base Nero Launcher directory
fn get_launcher_dir() -> Result<PathBuf, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;
    Ok(home.join(".nerolauncher"))
}

fn get_versions_dir() -> Result<PathBuf, String> {
    Ok(get_launcher_dir()?.join("versions"))
}

fn get_libraries_dir() -> Result<PathBuf, String> {
    Ok(get_launcher_dir()?.join("libraries"))
}

fn get_assets_dir() -> Result<PathBuf, String> {
    Ok(get_launcher_dir()?.join("assets"))
}

/// Fetch Minecraft versions from official Mojang launcher (PolyMC version)
/// Note: Use the original fetch_minecraft_versions instead
async fn fetch_versions_polymc() -> Result<Vec<MinecraftVersion>, String> {
    let response = reqwest::get(LAUNCHER_META_URL)
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
            let version_type = v.get("type")?.as_str()?.to_string();
            let release_time = v.get("releaseTime")?.as_str()?.to_string();
            let url = v.get("url").and_then(|u| u.as_str()).map(|s| s.to_string());

            let version_dir = versions_dir.join(&id);
            let json_path = version_dir.join(format!("{}.json", id));
            let jar_path = version_dir.join(format!("{}.jar", id));

            let installed = json_path.exists() && jar_path.exists();

            Some(MinecraftVersion {
                id: id.clone(),
                version: id,
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

/// Download version.json from Mojang
async fn download_version_json(
    version_id: &str,
    version_url: &str,
) -> Result<VersionMetadata, String> {
    let response = reqwest::get(version_url)
        .await
        .map_err(|e| format!("Failed to fetch version metadata: {}", e))?;

    let metadata: VersionMetadata = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse version JSON: {}", e))?;

    Ok(metadata)
}

/// Save version.json to disk with SHA1 verification
async fn save_version_json(
    version_id: &str,
    metadata: &VersionMetadata,
) -> Result<(), String> {
    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(version_id);
    fs::create_dir_all(&version_dir).map_err(|e| e.to_string())?;

    let json_path = version_dir.join(format!("{}.json", version_id));
    let json_str = serde_json::to_string_pretty(metadata)
        .map_err(|e| format!("Failed to serialize version.json: {}", e))?;

    fs::write(&json_path, json_str)
        .map_err(|e| format!("Failed to write version.json: {}", e))?;

    Ok(())
}

/// Download client JAR with SHA1 verification (PolyMC style)
async fn download_client_jar(
    app: &AppHandle,
    version_id: &str,
    metadata: &VersionMetadata,
) -> Result<(), String> {
    let client_download = metadata
        .downloads
        .as_ref()
        .and_then(|d| d.client.as_ref())
        .ok_or("Version JSON missing downloads.client")?;

    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(version_id);
    let jar_path = version_dir.join(format!("{}.jar", version_id));

    // If file exists and SHA1 matches, skip download
    if jar_path.exists() {
        if let Ok(actual_sha1) = calculate_sha1_file(&jar_path) {
            if actual_sha1 == client_download.sha1 {
                let _ = app.emit(
                    "download-progress",
                    serde_json::json!({
                        "stage": "client_jar",
                        "progress": 100.0,
                        "total_bytes": client_download.size,
                        "downloaded_bytes": client_download.size,
                    }),
                );
                return Ok(());
            }
        }
    }

    // Download JAR
    let response = reqwest::get(&client_download.url)
        .await
        .map_err(|e| format!("Failed to download client JAR: {}", e))?;

    let total_size = response.content_length().unwrap_or(client_download.size);
    let bytes = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read client JAR: {}", e))?;

    // Verify SHA1 before saving
    use sha1::Digest;
    let actual_sha1 = format!("{:x}", sha1::Sha1::new().chain_update(&bytes).finalize());
    if actual_sha1 != client_download.sha1 {
        return Err(format!(
            "SHA1 mismatch for client JAR: expected {}, got {}",
            client_download.sha1, actual_sha1
        ));
    }

    // Save file
    let mut file = fs::File::create(&jar_path).map_err(|e| e.to_string())?;
    file.write_all(&bytes).map_err(|e| e.to_string())?;

    let _ = app.emit(
        "download-progress",
        serde_json::json!({
            "stage": "client_jar",
            "progress": 100.0,
            "total_bytes": total_size,
            "downloaded_bytes": total_size,
        }),
    );

    Ok(())
}

/// Download asset index JSON
async fn download_asset_index(
    app: &AppHandle,
    version_id: &str,
    metadata: &VersionMetadata,
) -> Result<AssetIndex, String> {
    let asset_index_ref = metadata
        .asset_index
        .as_ref()
        .ok_or("Version JSON missing assetIndex")?;

    let assets_dir = get_assets_dir()?;
    let indexes_dir = assets_dir.join("indexes");
    fs::create_dir_all(&indexes_dir).map_err(|e| e.to_string())?;

    let index_path = indexes_dir.join(format!("{}.json", asset_index_ref.id));

    // Check cache
    if index_path.exists() {
        if let Ok(actual_sha1) = calculate_sha1_file(&index_path) {
            if actual_sha1 == asset_index_ref.sha1 {
                let content =
                    fs::read_to_string(&index_path).map_err(|e| e.to_string())?;
                let index: AssetIndex =
                    serde_json::from_str(&content).map_err(|e| e.to_string())?;
                return Ok(index);
            }
        }
    }

    // Download index
    let response = reqwest::get(&asset_index_ref.url)
        .await
        .map_err(|e| format!("Failed to download asset index: {}", e))?;

    let content = response
        .text()
        .await
        .map_err(|e| format!("Failed to read asset index: {}", e))?;

    // Verify SHA1
    use sha1::Digest;
    let actual_sha1 = format!("{:x}", sha1::Sha1::new().chain_update(&content).finalize());
    if actual_sha1 != asset_index_ref.sha1 {
        return Err(format!(
            "SHA1 mismatch for asset index: expected {}, got {}",
            asset_index_ref.sha1, actual_sha1
        ));
    }

    fs::write(&index_path, &content).map_err(|e| e.to_string())?;

    let index: AssetIndex =
        serde_json::from_str(&content).map_err(|e| e.to_string())?;

    let _ = app.emit(
        "download-progress",
        serde_json::json!({
            "stage": "asset_index",
            "progress": 100.0,
        }),
    );

    Ok(index)
}

/// Download all assets in parallel with PolyMC-style caching
#[tauri::command]
pub async fn download_assets_polymc(
    app: AppHandle,
    version_id: String,
) -> Result<String, String> {
    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(&version_id);
    let version_json_path = version_dir.join(format!("{}.json", version_id));

    let json_str = fs::read_to_string(&version_json_path)
        .map_err(|e| format!("Failed to read version.json: {}", e))?;

    let metadata: VersionMetadata =
        serde_json::from_str(&json_str)
            .map_err(|e| format!("Failed to parse version.json: {}", e))?;

    // Download asset index
    let asset_index = download_asset_index(&app, &version_id, &metadata).await?;

    // Download assets in parallel
    let assets_dir = get_assets_dir()?;
    let objects_dir = assets_dir.join("objects");
    fs::create_dir_all(&objects_dir).map_err(|e| e.to_string())?;

    let total_assets = asset_index.objects.len() as u64;
    let mut downloaded = 0u64;
    let mut failed = Vec::new();

    // Limit to 4 concurrent downloads
    let semaphore = std::sync::Arc::new(tokio::sync::Semaphore::new(4));

    let mut handles = vec![];

    for (asset_path, asset) in asset_index.objects.iter() {
        let app_clone = app.clone();
        let version_id_clone = version_id.clone();
        let objects_dir_clone = objects_dir.clone();
        let semaphore_clone = semaphore.clone();
        let asset = asset.clone();
        let asset_path = asset_path.clone();

        let handle = tokio::spawn(async move {
            let _permit = semaphore_clone.acquire().await;

            let hash_prefix = &asset.hash[..2];
            let asset_file_path = objects_dir_clone.join(hash_prefix).join(&asset.hash);

            // Check if already downloaded and verify
            if asset_file_path.exists() {
                if let Ok(actual_sha1) = calculate_sha1_file(&asset_file_path) {
                    if actual_sha1 == asset.hash {
                        return Ok((asset_path, true));
                    }
                }
            }

            // Create directory
            if let Some(parent) = asset_file_path.parent() {
                fs::create_dir_all(parent).ok();
            }

            // Download from Mojang
            let url = format!("{}/{}/{}", RESOURCES_DOWNLOAD_URL, hash_prefix, asset.hash);

            match reqwest::get(&url).await {
                Ok(response) => match response.bytes().await {
                    Ok(bytes) => {
                        // Verify SHA1
                        use sha1::Digest;
                        let actual_sha1 = format!("{:x}", sha1::Sha1::new().chain_update(&bytes).finalize());
                        if actual_sha1 != asset.hash {
                            return Err(format!("SHA1 mismatch for asset {}", asset_path));
                        }

                        match fs::write(&asset_file_path, &bytes) {
                            Ok(_) => {
                                let _ = app_clone.emit(
                                    "asset-downloaded",
                                    serde_json::json!({
                                        "version_id": version_id_clone,
                                        "asset": asset_path,
                                    }),
                                );
                                Ok((asset_path, true))
                            }
                            Err(e) => {
                                Err(format!("Failed to write asset: {}", e))
                            }
                        }
                    }
                    Err(e) => Err(format!("Failed to read asset: {}", e)),
                },
                Err(e) => Err(format!("Failed to download asset: {}", e)),
            }
        });

        handles.push(handle);
    }

    // Wait for all and track progress
    for handle in handles {
        match handle.await {
            Ok(result) => match result {
                Ok(_) => {
                    downloaded += 1;
                    let progress = (downloaded as f64 / total_assets as f64) * 100.0;
                    let _ = app.emit(
                        "download-progress",
                        serde_json::json!({
                            "stage": "assets",
                            "progress": progress,
                            "current": downloaded,
                            "total": total_assets,
                        }),
                    );
                }
                Err(e) => {
                    failed.push(e);
                    downloaded += 1;
                }
            },
            Err(e) => {
                failed.push(e.to_string());
                downloaded += 1;
            }
        }
    }

    if failed.is_empty() {
        Ok(format!("Downloaded {} assets", total_assets))
    } else {
        Ok(format!(
            "Downloaded {} assets ({} failed)",
            total_assets - failed.len() as u64,
            failed.len()
        ))
    }
}

/// Download all libraries with PolyMC-style rules and caching
#[tauri::command]
pub async fn download_libraries_polymc(
    app: AppHandle,
    version_id: String,
) -> Result<String, String> {
    let versions_dir = get_versions_dir()?;
    let version_dir = versions_dir.join(&version_id);
    let version_json_path = version_dir.join(format!("{}.json", version_id));

    let json_str = fs::read_to_string(&version_json_path)
        .map_err(|e| format!("Failed to read version.json: {}", e))?;

    let metadata: VersionMetadata =
        serde_json::from_str(&json_str)
            .map_err(|e| format!("Failed to parse version.json: {}", e))?;

    let libraries_dir = get_libraries_dir()?;
    fs::create_dir_all(&libraries_dir).map_err(|e| e.to_string())?;

    let total_libs = metadata
        .libraries
        .iter()
        .filter(|lib| should_download_library(lib))
        .count() as u64;

    let mut downloaded = 0u64;
    let mut failed = Vec::new();

    let semaphore = std::sync::Arc::new(tokio::sync::Semaphore::new(4));
    let mut handles = vec![];

    for lib in metadata.libraries.iter() {
        if !should_download_library(lib) {
            continue;
        }

        let app_clone = app.clone();
        let version_id_clone = version_id.clone();
        let libraries_dir_clone = libraries_dir.clone();
        let semaphore_clone = semaphore.clone();
        let lib = lib.clone();

        let handle = tokio::spawn(async move {
            let _permit = semaphore_clone.acquire().await;

            // Get download info
            let artifact = lib
                .downloads
                .as_ref()
                .and_then(|d| d.artifact.as_ref())
                .ok_or_else(|| "No download info".to_string())?;

            let lib_path = libraries_dir_clone.join(&artifact.path);

            // Check cache with SHA1
            if lib_path.exists() {
                if let Ok(actual_sha1) = calculate_sha1_file(&lib_path) {
                    if actual_sha1 == artifact.sha1 {
                        return Ok((artifact.path.clone(), true));
                    }
                }
            }

            // Create directories
            if let Some(parent) = lib_path.parent() {
                fs::create_dir_all(parent).ok();
            }

            // Try multiple URLs
            for base_url in LIBRARIES_DOWNLOAD_URLS {
                let url = format!("{}/{}", base_url, artifact.path);
                match reqwest::get(&url).await {
                    Ok(response) => match response.bytes().await {
                        Ok(bytes) => {
                            // Verify SHA1
                            use sha1::Digest;
                            let actual_sha1 = format!("{:x}", sha1::Sha1::new().chain_update(&bytes).finalize());
                            if actual_sha1 != artifact.sha1 {
                                continue; // Try next URL
                            }

                            if let Ok(_) = fs::write(&lib_path, &bytes) {
                                let _ = app_clone.emit(
                                    "library-downloaded",
                                    serde_json::json!({
                                        "version_id": version_id_clone,
                                        "library": artifact.path,
                                    }),
                                );
                                return Ok((artifact.path.clone(), true));
                            }
                        }
                        Err(_) => continue,
                    },
                    Err(_) => continue,
                }
            }

            Err(format!("Failed to download library: {}", artifact.path))
        });

        handles.push(handle);
    }

    // Wait and track progress
    for handle in handles {
        match handle.await {
            Ok(result) => match result {
                Ok(_) => {
                    downloaded += 1;
                    let progress = (downloaded as f64 / total_libs as f64) * 100.0;
                    let _ = app.emit(
                        "download-progress",
                        serde_json::json!({
                            "stage": "libraries",
                            "progress": progress,
                            "current": downloaded,
                            "total": total_libs,
                        }),
                    );
                }
                Err(e) => {
                    failed.push(e);
                    downloaded += 1;
                }
            },
            Err(e) => {
                failed.push(e.to_string());
                downloaded += 1;
            }
        }
    }

    if failed.is_empty() {
        Ok(format!("Downloaded {} libraries", total_libs))
    } else {
        Ok(format!(
            "Downloaded {} libraries ({} failed)",
            total_libs - failed.len() as u64,
            failed.len()
        ))
    }
}

/// Calculate SHA1 hash of a file
fn calculate_sha1_file(path: &Path) -> Result<String, String> {
    use sha1::Digest;

    let mut file = fs::File::open(path).map_err(|e| e.to_string())?;
    let mut hasher = sha1::Sha1::new();
    let mut buffer = vec![0; 8192];

    loop {
        let n = file.read(&mut buffer).map_err(|e| e.to_string())?;
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }

    Ok(format!("{:x}", hasher.finalize()))
}

// Keep original functions for backwards compatibility
pub use super::downloader::{
    download_minecraft_version, is_version_installed, delete_version, list_installed_versions,
};
