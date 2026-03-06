use std::fs;

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

/// Fetch available Minecraft versions from official launcher metadata
#[tauri::command]
pub async fn fetch_minecraft_versions() -> Result<Vec<MinecraftVersion>, String> {
    // Fetch from official manifest
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

    let home = dirs::home_dir()
        .map(|p| p.join(".minecraft"))
        .unwrap_or_default();

    let result = versions
        .iter()
        .take(50) // Limit to last 50 versions
        .filter_map(|v| {
            let id = v.get("id")?.as_str()?.to_string();
            let version = id.clone();
            let version_type = v.get("type")?.as_str()?.to_string();
            let release_time = v.get("releaseTime")?.as_str()?.to_string();
            let url = v.get("url").and_then(|u| u.as_str()).map(|s| s.to_string());

            let version_dir = home.join("versions").join(&id);
            let installed = version_dir.exists();

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

/// Download a specific Minecraft version
#[tauri::command]
pub async fn download_minecraft_version(
    version_id: String,
    version_url: String,
) -> Result<String, String> {
    let home = dirs::home_dir()
        .map(|p| p.join(".minecraft"))
        .ok_or("Could not determine home directory")?;

    let version_dir = home.join("versions").join(&version_id);
    fs::create_dir_all(&version_dir).map_err(|e| e.to_string())?;

    // Download version JSON
    let response = reqwest::get(&version_url)
        .await
        .map_err(|e| format!("Failed to download: {}", e))?;

    let version_json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse version JSON: {}", e))?;

    // Save version.json
    let version_json_path = version_dir.join(format!("{}.json", version_id));
    let json_str = serde_json::to_string_pretty(&version_json)
        .map_err(|e| e.to_string())?;
    fs::write(&version_json_path, json_str).map_err(|e| e.to_string())?;

    // Download client JAR
    if let Some(downloads) = version_json.get("downloads").and_then(|d| d.get("client")) {
        if let Some(url) = downloads.get("url").and_then(|u| u.as_str()) {
            let jar_response = reqwest::get(url)
                .await
                .map_err(|e| format!("Failed to download JAR: {}", e))?;

            let jar_path = version_dir.join(format!("{}.jar", version_id));
            let mut file = fs::File::create(&jar_path).map_err(|e| e.to_string())?;

            let bytes = jar_response
                .bytes()
                .await
                .map_err(|e| format!("Failed to read JAR: {}", e))?;

            use std::io::Write;
            file.write_all(&bytes).map_err(|e| e.to_string())?;

            return Ok(format!("Downloaded Minecraft {}", version_id));
        }
    }

    Err("Failed to find download URL in version manifest".to_string())
}

/// Check if a version is installed
#[tauri::command]
pub fn is_version_installed(version_id: String) -> Result<bool, String> {
    let home = dirs::home_dir()
        .map(|p| p.join(".minecraft"))
        .ok_or("Could not determine home directory")?;

    let version_dir = home.join("versions").join(&version_id);
    let jar_path = version_dir.join(format!("{}.jar", version_id));

    Ok(jar_path.exists())
}

/// Delete a downloaded version
#[tauri::command]
pub fn delete_version(version_id: String) -> Result<(), String> {
    let home = dirs::home_dir()
        .map(|p| p.join(".minecraft"))
        .ok_or("Could not determine home directory")?;

    let version_dir = home.join("versions").join(&version_id);
    fs::remove_dir_all(&version_dir).map_err(|e| e.to_string())?;

    Ok(())
}

/// Get list of installed versions
#[tauri::command]
pub fn list_installed_versions() -> Result<Vec<String>, String> {
    let home = dirs::home_dir()
        .map(|p| p.join(".minecraft"))
        .ok_or("Could not determine home directory")?;

    let versions_dir = home.join("versions");
    if !versions_dir.exists() {
        return Ok(Vec::new());
    }

    let mut versions = Vec::new();
    for entry in fs::read_dir(&versions_dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.is_dir() {
            if let Some(version_id) = path.file_name() {
                if let Some(version_str) = version_id.to_str() {
                    versions.push(version_str.to_string());
                }
            }
        }
    }

    Ok(versions)
}
