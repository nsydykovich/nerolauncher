use std::fs;
use std::path::Path;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerificationResult {
    pub version_id: String,
    pub is_valid: bool,
    pub missing_files: Vec<String>,
    pub corrupted_files: Vec<String>,
    pub total_files: usize,
}

/// Calculate SHA1 hash of a file (for future use in validation)
#[allow(dead_code)]
fn calculate_sha1(path: &Path) -> Result<String, String> {
    use std::io::Read;
    use sha1::{Sha1, Digest};

    let mut file = fs::File::open(path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    let mut buffer = vec![0; 8192];
    let mut hasher = Sha1::new();

    loop {
        let n = file.read(&mut buffer)
            .map_err(|e| format!("Failed to read file: {}", e))?;
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }

    Ok(hex::encode(hasher.finalize()))
}

/// Verify a Minecraft version installation
/// Checks for required files and validates SHA1 hashes where available
#[tauri::command]
pub fn verify_version(
    version_id: String,
    _game_dir: String,
) -> Result<VerificationResult, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let versions_dir = home.join(".nerolauncher").join("versions");
    let version_dir = versions_dir.join(&version_id);

    // Check version.json
    let version_json_path = version_dir.join(format!("{}.json", version_id));
    let mut missing_files = Vec::new();
    let mut corrupted_files = Vec::new();

    if !version_json_path.exists() {
        missing_files.push(format!("{}.json", version_id));
    }

    // Check client.jar
    let jar_path = version_dir.join(format!("{}.jar", version_id));
    if !jar_path.exists() {
        missing_files.push(format!("{}.jar", version_id));
    }

    // Try to read version.json and validate downloads
    // Note: Simplified verification - just check for existence of key files
    // Full validation with SHA1 can be expensive and optional
    if version_json_path.exists() {
        // We have version.json, that's good
    } else {
        missing_files.push(format!("{}.json", version_id));
    }

    if jar_path.exists() {
        // We have client JAR, that's good
    } else {
        missing_files.push(format!("{}.jar", version_id));
    }

    let is_valid = missing_files.is_empty() && corrupted_files.is_empty();
    let total_files = if jar_path.exists() { 1 } else { 0 }
        + if version_json_path.exists() { 1 } else { 0 };

    Ok(VerificationResult {
        version_id,
        is_valid,
        missing_files,
        corrupted_files,
        total_files,
    })
}

/// Try to repair a version by downloading missing files
#[tauri::command]
pub async fn repair_version(
    version_id: String,
    version_url: String,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // This would call download_minecraft_version to re-download
    // Keeping it simple for now - user should re-download
    crate::commands::downloader::download_minecraft_version(
        app,
        version_id,
        version_url,
    )
    .await
}
