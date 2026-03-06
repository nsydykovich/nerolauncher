use tauri::State;
use crate::db::{DbState, themes as db_themes};
use crate::db::themes::CustomTheme;

#[tauri::command]
pub async fn list_custom_themes(db: State<'_, DbState>) -> Result<Vec<CustomTheme>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_themes::list_themes(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn theme_name_exists(
    name: String,
    exclude_id: Option<String>,
    db: State<'_, DbState>,
) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_themes::theme_name_exists(&conn, &name, exclude_id.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_custom_theme(
    theme: CustomTheme,
    db: State<'_, DbState>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_themes::save_theme(&conn, &theme).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_custom_theme(
    id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_themes::delete_theme(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn rename_custom_theme(
    id: String,
    new_name: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    db_themes::rename_theme(&conn, &id, &new_name).map_err(|e| e.to_string())
}
