use std::collections::HashMap;
use std::path::PathBuf;
use std::time::{Duration, SystemTime};

use serde::{Deserialize, Serialize};

use crate::state::AppState;

const CACHE_MAX_AGE: Duration = Duration::from_secs(3600);

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VanillaVersion {
    pub id: String,
    #[serde(rename = "type")]
    pub version_type: String,
    pub url: String,
    #[serde(rename = "releaseTime")]
    pub release_time: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VanillaManifest {
    pub latest: LatestVersions,
    pub versions: Vec<VanillaVersion>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LatestVersions {
    pub release: String,
    pub snapshot: String,
}

#[derive(Debug, Deserialize)]
struct FabricLoaderInfo {
    version: String,
}

#[derive(Debug, Deserialize)]
struct FabricLoaderEntry {
    loader: FabricLoaderInfo,
}

#[derive(Debug, Deserialize)]
struct ForgePromotions {
    promos: HashMap<String, String>,
}

#[derive(Debug, Deserialize)]
struct NeoForgeVersionList {
    versions: Vec<String>,
}

fn cache_path(base: &PathBuf, name: &str) -> PathBuf {
    base.join("meta").join(name)
}

fn read_cache(path: &PathBuf) -> Option<String> {
    let metadata = std::fs::metadata(path).ok()?;
    let modified = metadata.modified().ok()?;
    if SystemTime::now().duration_since(modified).ok()? > CACHE_MAX_AGE {
        return None;
    }
    std::fs::read_to_string(path).ok()
}

fn write_cache(path: &PathBuf, data: &str) {
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    let _ = std::fs::write(path, data);
}

async fn fetch_cached(base: &PathBuf, cache_name: &str, url: &str) -> Result<String, String> {
    let path = cache_path(base, cache_name);
    if let Some(cached) = read_cache(&path) {
        return Ok(cached);
    }
    let body = reqwest::get(url)
        .await
        .map_err(|e| format!("Network error: {e}"))?
        .text()
        .await
        .map_err(|e| format!("Read error: {e}"))?;
    write_cache(&path, &body);
    Ok(body)
}

#[tauri::command]
pub async fn fetch_vanilla_versions(
    state: tauri::State<'_, AppState>,
) -> Result<VanillaManifest, String> {
    let data = fetch_cached(
        &state.app_data_dir,
        "vanilla_manifest.json",
        "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json",
    )
    .await?;
    serde_json::from_str(&data).map_err(|e| format!("Parse error: {e}"))
}

#[tauri::command]
pub async fn fetch_fabric_versions(
    state: tauri::State<'_, AppState>,
    mc_version: String,
) -> Result<Vec<String>, String> {
    let url = format!("https://meta.fabricmc.net/v2/versions/loader/{mc_version}");
    let cache_name = format!("fabric_{mc_version}.json");
    let data = fetch_cached(&state.app_data_dir, &cache_name, &url).await?;
    let entries: Vec<FabricLoaderEntry> =
        serde_json::from_str(&data).map_err(|e| format!("Parse error: {e}"))?;
    Ok(entries.into_iter().map(|e| e.loader.version).collect())
}

#[tauri::command]
pub async fn fetch_quilt_versions(
    state: tauri::State<'_, AppState>,
    mc_version: String,
) -> Result<Vec<String>, String> {
    let url = format!("https://meta.quiltmc.org/v3/versions/loader/{mc_version}");
    let cache_name = format!("quilt_{mc_version}.json");
    let data = fetch_cached(&state.app_data_dir, &cache_name, &url).await?;
    let entries: Vec<FabricLoaderEntry> =
        serde_json::from_str(&data).map_err(|e| format!("Parse error: {e}"))?;
    Ok(entries.into_iter().map(|e| e.loader.version).collect())
}

#[tauri::command]
pub async fn fetch_forge_versions(
    state: tauri::State<'_, AppState>,
    mc_version: String,
) -> Result<Vec<String>, String> {
    let data = fetch_cached(
        &state.app_data_dir,
        "forge_promotions.json",
        "https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json",
    )
    .await?;
    let promos: ForgePromotions =
        serde_json::from_str(&data).map_err(|e| format!("Parse error: {e}"))?;
    let prefix = format!("{mc_version}-");
    let mut versions: Vec<String> = promos
        .promos
        .iter()
        .filter(|(k, _)| k.starts_with(&prefix))
        .map(|(k, v)| {
            let label = k.strip_prefix(&prefix).unwrap_or(k);
            format!("{v} ({label})")
        })
        .collect();
    versions.sort();
    versions.dedup();
    Ok(versions)
}

#[tauri::command]
pub async fn fetch_neoforge_versions(
    state: tauri::State<'_, AppState>,
    mc_version: String,
) -> Result<Vec<String>, String> {
    let data = fetch_cached(
        &state.app_data_dir,
        "neoforge_versions.json",
        "https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge",
    )
    .await?;
    let list: NeoForgeVersionList =
        serde_json::from_str(&data).map_err(|e| format!("Parse error: {e}"))?;
    // NeoForge versions are like "20.4.123" where "20.4" maps to MC 1.20.4
    // Extract minor version from mc_version (e.g., "1.20.4" -> "20.4")
    let minor = mc_version
        .strip_prefix("1.")
        .unwrap_or(&mc_version);
    let versions: Vec<String> = list
        .versions
        .into_iter()
        .filter(|v| v.starts_with(&format!("{minor}.")))
        .rev()
        .collect();
    Ok(versions)
}
