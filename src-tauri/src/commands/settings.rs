use std::collections::HashMap;
use tauri::State;
use crate::db::DbState;
use crate::db::settings as db_settings;

#[tauri::command]
pub async fn get_setting(
    key: String,
    db: State<'_, DbState>,
) -> Result<Option<String>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_settings::get_setting(&conn, &key).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_setting(
    key: String,
    value: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_settings::set_setting(&conn, &key, &value).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_all_settings(
    db: State<'_, DbState>,
) -> Result<HashMap<String, String>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_settings::get_all_settings(&conn).map_err(|e| e.to_string())
}
