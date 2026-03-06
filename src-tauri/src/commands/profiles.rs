use tauri::State;
use crate::db::DbState;
use crate::models::{Profile, profile::{CreateProfileRequest, UpdateProfileRequest}};

#[tauri::command]
pub fn create_profile(
    req: CreateProfileRequest,
    db: State<DbState>,
) -> Result<Profile, String> {
    let game_dir = req.game_dir.unwrap_or_else(|| {
        let home = dirs::home_dir()
            .map(|p| p.join(".minecraft"))
            .unwrap_or_default();
        home.to_string_lossy().to_string()
    });

    let profile = Profile::new(req.name, req.game_version, game_dir);
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    crate::db::profiles::create_profile(&conn, &profile)
        .map_err(|e| e.to_string())?;

    Ok(profile)
}

#[tauri::command]
pub fn get_profile(id: String, db: State<DbState>) -> Result<Option<Profile>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    crate::db::profiles::get_profile(&conn, &id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_profiles(db: State<DbState>) -> Result<Vec<Profile>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    crate::db::profiles::list_profiles(&conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_profile(
    id: String,
    req: UpdateProfileRequest,
    db: State<DbState>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    if let Some(ref name) = req.name {
        crate::db::profiles::update_profile_name(&conn, &id, name)
            .map_err(|e| e.to_string())?;
    }
    if let Some(ref version) = req.game_version {
        crate::db::profiles::update_profile_version(&conn, &id, version)
            .map_err(|e| e.to_string())?;
    }
    if let Some(ref loader) = req.mod_loader {
        crate::db::profiles::update_profile_loader(&conn, &id, loader)
            .map_err(|e| e.to_string())?;
    }
    if let Some(java) = req.java_version {
        crate::db::profiles::update_profile_java(&conn, &id, java)
            .map_err(|e| e.to_string())?;
    }
    if let Some(ref args) = req.java_args {
        let args_ref: Option<&str> = args.as_ref().map(|s| s.as_str());
        crate::db::profiles::update_profile_java_args(&conn, &id, args_ref)
            .map_err(|e| e.to_string())?;
    }
    if let Some(ref icon) = req.icon {
        let icon_ref: Option<&str> = icon.as_ref().map(|s| s.as_str());
        crate::db::profiles::update_profile_icon(&conn, &id, icon_ref)
            .map_err(|e| e.to_string())?;
    }
    if let Some(ref notes) = req.notes {
        let notes_ref: Option<&str> = notes.as_ref().map(|s| s.as_str());
        crate::db::profiles::update_profile_notes(&conn, &id, notes_ref)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn delete_profile(id: String, db: State<DbState>) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    crate::db::profiles::delete_profile(&conn, &id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_last_played(id: String, db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    crate::db::profiles::update_last_played(&conn, &id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_playtime(id: String, seconds: i64, db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    crate::db::profiles::add_playtime(&conn, &id, seconds)
        .map_err(|e| e.to_string())
}
