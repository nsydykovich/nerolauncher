use tauri::{Manager, Emitter};
use db::DbState;

mod db;
mod commands;
mod models;
mod tray;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_prevent_default::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("failed to get app data dir");

            let conn = db::init_db(&app_data_dir)
                .expect("failed to initialize database");

            app.manage(DbState(std::sync::Mutex::new(conn)));

            tray::setup_tray(app.handle())?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                // Check if minimize_to_tray is enabled (read from DB would require state)
                // We emit a JS event instead and let frontend decide
                let _ = window.emit("close-requested", ());
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::settings::get_setting,
            commands::settings::set_setting,
            commands::settings::get_all_settings,
            commands::themes::list_custom_themes,
            commands::themes::theme_name_exists,
            commands::themes::save_custom_theme,
            commands::themes::delete_custom_theme,
            commands::themes::rename_custom_theme,
            commands::java::get_java_args,
            commands::profiles::create_profile,
            commands::profiles::get_profile,
            commands::profiles::list_profiles,
            commands::profiles::update_profile,
            commands::profiles::delete_profile,
            commands::profiles::update_last_played,
            commands::profiles::add_playtime,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
