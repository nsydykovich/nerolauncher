use std::process::Command;
use tauri::State;
use crate::db::DbState;

/// Game directory strategy for Minecraft installations
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum GameDirStrategy {
    /// Use global .minecraft in home directory
    #[serde(rename = "global")]
    Global,
    /// Use profile-specific subdirectory (profileId/.minecraft)
    #[serde(rename = "per-profile")]
    PerProfile,
    /// Use family subdirectory (familyName/.minecraft) — for shared modpacks
    #[serde(rename = "per-family")]
    PerFamily,
}

/// Resolve game directory based on strategy
pub fn resolve_game_dir(
    strategy: GameDirStrategy,
    profile_id: &str,
    family_name: Option<&str>,
) -> String {
    let home = dirs::home_dir()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();

    match strategy {
        GameDirStrategy::Global => {
            format!("{}/.minecraft", home)
        }
        GameDirStrategy::PerProfile => {
            format!("{}/.nero-launcher/profiles/{}", home, profile_id)
        }
        GameDirStrategy::PerFamily => {
            let family = family_name.unwrap_or("default");
            format!("{}/.nero-launcher/families/{}", home, family)
        }
    }
}

/// Launch Minecraft with specified profile
/// Returns PID of the launched process
#[tauri::command]
pub fn launch_game(
    profile_id: String,
    game_version: String,
    java_version: u8,
    game_dir_strategy: String,
    java_args: Option<String>,
    extra_args: Option<String>,
    db: State<DbState>,
) -> Result<u32, String> {
    // Parse strategy
    let strategy = match game_dir_strategy.as_str() {
        "global" => GameDirStrategy::Global,
        "per-profile" => GameDirStrategy::PerProfile,
        "per-family" => GameDirStrategy::PerFamily,
        _ => GameDirStrategy::Global,
    };

    // Resolve game directory
    let game_dir = resolve_game_dir(strategy, &profile_id, None);

    // Ensure game directory exists
    std::fs::create_dir_all(&game_dir).map_err(|e| e.to_string())?;

    // Get Java path from database
    let java_path = {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        let java_version_str = java_version.to_string();
        let setting_key = format!("java_path_{}", java_version_str);

        crate::db::settings::get_setting(&conn, &setting_key)
            .map_err(|e| e.to_string())?
            .unwrap_or_else(|| {
                // Fallback: try to find java in PATH
                if let Ok(output) = Command::new("java").arg("-version").output() {
                    String::from_utf8_lossy(&output.stderr).to_string()
                } else {
                    "java".to_string()
                }
            })
    };

    // Build command
    let mut cmd = Command::new(&java_path);

    // Check if we need default memory settings
    let has_xmx = java_args.as_ref().map(|a| a.contains("-Xmx")).unwrap_or(false);
    let has_xms = java_args.as_ref().map(|a| a.contains("-Xms")).unwrap_or(false);

    // Add Java arguments
    if let Some(args) = &java_args {
        for arg in args.split_whitespace() {
            cmd.arg(arg);
        }
    }

    // Add memory defaults if not specified
    if !has_xmx {
        cmd.arg("-Xmx2048M");
    }
    if !has_xms {
        cmd.arg("-Xms512M");
    }

    // Game directory
    cmd.arg("-Dminecraft.client.jar.storage=").arg(&game_dir);

    // Version
    cmd.arg("-Dminecraft.version=").arg(&game_version);

    // Extra arguments
    if let Some(extra) = extra_args {
        for arg in extra.split_whitespace() {
            cmd.arg(arg);
        }
    }

    // Main class (placeholder — real implementation would need proper launcher)
    cmd.arg("net.minecraft.launcher.Bootstrap");

    // Launch
    let child = cmd.spawn().map_err(|e| e.to_string())?;

    // Update profile's last played time
    {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        let _ = crate::db::profiles::update_last_played(&conn, &profile_id);
    }

    Ok(child.id())
}

/// Get resolved game directory for a profile
#[tauri::command]
pub fn get_game_dir(
    profile_id: String,
    strategy: String,
) -> Result<String, String> {
    let strat = match strategy.as_str() {
        "global" => GameDirStrategy::Global,
        "per-profile" => GameDirStrategy::PerProfile,
        "per-family" => GameDirStrategy::PerFamily,
        _ => GameDirStrategy::Global,
    };

    Ok(resolve_game_dir(strat, &profile_id, None))
}
