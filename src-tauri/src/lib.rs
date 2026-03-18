use tauri::Manager;
use tauri_plugin_prevent_default::Flags;

mod commands;
mod models;
mod state;

use commands::profile::{get_profile, set_profile};
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
            get_profile,
            set_profile,
        ]);

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
