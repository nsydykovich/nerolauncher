use std::fs;
use std::path::PathBuf;
use chrono::Utc;
use tauri::State;
use uuid::Uuid;

use crate::models::instance::{CreateInstanceInput, Instance, UpdateInstanceInput};
use crate::state::AppState;

fn instances_dir(app_data_dir: &PathBuf) -> PathBuf {
    app_data_dir.join("instances")
}

fn instance_dir(app_data_dir: &PathBuf, id: &str) -> PathBuf {
    instances_dir(app_data_dir).join(id)
}

fn read_instance(path: &PathBuf) -> Result<Instance, String> {
    let json = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&json).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_instances(state: State<AppState>) -> Result<Vec<Instance>, String> {
    let dir = instances_dir(&state.app_data_dir);
    if !dir.exists() {
        return Ok(vec![]);
    }

    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;
    let mut instances: Vec<Instance> = entries
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let json_path = entry.path().join("instance.json");
            read_instance(&json_path).ok()
        })
        .collect();

    instances.sort_by(|a, b| {
        let a_time = a.last_played_at.as_deref().unwrap_or(&a.created_at);
        let b_time = b.last_played_at.as_deref().unwrap_or(&b.created_at);
        b_time.cmp(a_time)
    });

    Ok(instances)
}

#[tauri::command]
pub fn get_instance(instance_id: String, state: State<AppState>) -> Result<Instance, String> {
    let path = instance_dir(&state.app_data_dir, &instance_id).join("instance.json");
    read_instance(&path)
}

#[tauri::command]
pub fn create_instance(
    input: CreateInstanceInput,
    state: State<AppState>,
) -> Result<Instance, String> {
    let id = Uuid::new_v4().to_string();
    let dir = instance_dir(&state.app_data_dir, &id);

    fs::create_dir_all(dir.join("minecraft/versions")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("minecraft/assets")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("minecraft/libraries")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("mods")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("config")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("saves")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("screenshots")).map_err(|e| e.to_string())?;

    let instance = Instance {
        id: id.clone(),
        name: input.name,
        icon_path: None,
        minecraft_version: input.minecraft_version,
        loader: input.loader,
        created_at: Utc::now().to_rfc3339(),
        last_played_at: None,
        total_playtime_seconds: 0,
        path: dir.to_string_lossy().to_string(),
        java_override_path: None,
        jvm_args: vec!["-Xmx2G".to_string(), "-Xms512M".to_string()],
        game_resolution: None,
    };

    let json = serde_json::to_string_pretty(&instance).map_err(|e| e.to_string())?;
    fs::write(dir.join("instance.json"), json).map_err(|e| e.to_string())?;

    Ok(instance)
}

#[tauri::command]
pub fn update_instance(
    instance_id: String,
    input: UpdateInstanceInput,
    state: State<AppState>,
) -> Result<Instance, String> {
    let path = instance_dir(&state.app_data_dir, &instance_id).join("instance.json");
    let mut instance = read_instance(&path)?;

    if let Some(name) = input.name {
        instance.name = name;
    }
    if let Some(icon_path) = input.icon_path {
        instance.icon_path = icon_path;
    }
    if let Some(java_override_path) = input.java_override_path {
        instance.java_override_path = java_override_path;
    }
    if let Some(jvm_args) = input.jvm_args {
        instance.jvm_args = jvm_args;
    }
    if let Some(game_resolution) = input.game_resolution {
        instance.game_resolution = game_resolution;
    }

    let json = serde_json::to_string_pretty(&instance).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    Ok(instance)
}

#[tauri::command]
pub fn delete_instance(instance_id: String, state: State<AppState>) -> Result<(), String> {
    let dir = instance_dir(&state.app_data_dir, &instance_id);
    if dir.exists() {
        fs::remove_dir_all(&dir).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn get_app_data_dir(state: State<AppState>) -> String {
    state.app_data_dir.to_string_lossy().to_string()
}
