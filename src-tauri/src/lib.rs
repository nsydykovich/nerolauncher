use tauri::Manager;
use tauri_plugin_prevent_default::Flags;

mod commands;
mod models;
mod state;

use commands::instances::{
    create_instance, delete_instance, get_app_data_dir, get_instance, list_instances,
    update_instance,
};
use commands::profile::{get_profile, set_profile};
use commands::versions::{
    fetch_fabric_versions, fetch_forge_versions, fetch_neoforge_versions, fetch_quilt_versions,
    fetch_vanilla_versions,
};
use state::AppState;

pub fn run() {
    let prevent_default = tauri_plugin_prevent_default::Builder::new()
        .with_flags(Flags::all())
        .build();

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(prevent_default)
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("failed to get app data dir");
            std::fs::create_dir_all(&app_data_dir).expect("failed to create app data dir");
            app.manage(AppState::new(app_data_dir));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_instances,
            get_instance,
            create_instance,
            update_instance,
            delete_instance,
            get_app_data_dir,
            get_profile,
            set_profile,
            fetch_vanilla_versions,
            fetch_fabric_versions,
            fetch_quilt_versions,
            fetch_forge_versions,
            fetch_neoforge_versions,
        ]);

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
