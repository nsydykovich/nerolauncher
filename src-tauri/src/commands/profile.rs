use std::fs;
use tauri::State;
use uuid::Uuid;

use crate::models::profile::OfflineProfile;
use crate::state::AppState;

const PROFILE_FILE: &str = "profiles.json";
const OFFLINE_NAMESPACE: uuid::Uuid = uuid::Uuid::from_bytes([
    0x6b, 0xa7, 0xb8, 0x11, 0x9d, 0xad, 0x11, 0xd1,
    0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8,
]);

#[tauri::command]
pub fn get_profile(state: State<AppState>) -> Result<Option<OfflineProfile>, String> {
    let path = state.app_data_dir.join(PROFILE_FILE);
    if !path.exists() {
        return Ok(None);
    }
    let json = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let profile: OfflineProfile = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    Ok(Some(profile))
}

#[tauri::command]
pub fn set_profile(username: String, state: State<AppState>) -> Result<OfflineProfile, String> {
    let uuid = Uuid::new_v3(&OFFLINE_NAMESPACE, username.as_bytes()).to_string();
    let profile = OfflineProfile { username, uuid };

    fs::create_dir_all(&state.app_data_dir).map_err(|e| e.to_string())?;
    let path = state.app_data_dir.join(PROFILE_FILE);
    let json = serde_json::to_string_pretty(&profile).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    Ok(profile)
}
