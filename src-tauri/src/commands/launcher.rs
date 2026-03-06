use std::process::Command;
use std::path::PathBuf;
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

/// Launch game parameters struct for Tauri serialization
#[derive(Debug, serde::Deserialize)]
pub struct LaunchGameParams {
    #[serde(alias = "profileId")]
    pub profile_id: String,
    #[serde(alias = "gameVersion")]
    pub game_version: String,
    #[serde(alias = "javaVersion")]
    pub java_version: u8,
    #[serde(alias = "gameDirStrategy")]
    pub game_dir_strategy: String,
    #[serde(alias = "javaArgs")]
    pub java_args: Option<String>,
    #[serde(alias = "extraArgs")]
    pub extra_args: Option<String>,
    pub username: String,
    pub uuid: String,
    #[serde(alias = "accessToken")]
    pub access_token: String,
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

/// Build classpath from libraries and client JAR
fn build_classpath(game_version: &str) -> Result<String, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let versions_dir = home.join(".nerolauncher").join("versions");
    let version_dir = versions_dir.join(game_version);
    let libs_dir = home.join(".nerolauncher").join("libraries");

    // Load version.json to get list of libraries
    let version_json_path = version_dir.join(format!("{}.json", game_version));
    let version_json_str = std::fs::read_to_string(&version_json_path)
        .map_err(|e| format!("Failed to read version.json: {}", e))?;

    let version_json: serde_json::Value = serde_json::from_str(&version_json_str)
        .map_err(|e| format!("Failed to parse version.json: {}", e))?;

    let mut classpath_parts = Vec::new();

    // Add client JAR first
    let client_jar = version_dir.join(format!("{}.jar", game_version));
    classpath_parts.push(client_jar.to_string_lossy().to_string());

    // Add libraries from version.json
    if let Some(libraries) = version_json.get("libraries").and_then(|l| l.as_array()) {
        for lib in libraries {
            // Check if library should be included (OS rules)
            if let Some(rules) = lib.get("rules").and_then(|r| r.as_array()) {
                let mut should_include = false;
                for rule in rules {
                    if let Some(action) = rule.get("action").and_then(|a| a.as_str()) {
                        if action == "allow" {
                            // Check OS condition
                            if let Some(os) = rule.get("os") {
                                if let Some(os_name) = os.get("name").and_then(|n| n.as_str()) {
                                    let current_os = std::env::consts::OS;
                                    let os_match = match (os_name, current_os) {
                                        ("windows", "windows") => true,
                                        ("linux", "linux") => true,
                                        ("osx", "macos") => true,
                                        _ => false,
                                    };
                                    should_include = os_match;
                                }
                            } else {
                                should_include = true;
                            }
                        } else if action == "disallow" {
                            should_include = false;
                        }
                    }
                }

                if !should_include {
                    continue;
                }
            }

            // Get library name and construct path
            if let Some(name) = lib.get("name").and_then(|n| n.as_str()) {
                let parts: Vec<&str> = name.split(':').collect();
                if parts.len() >= 3 {
                    let lib_path = format!(
                        "{}/{}/{}/{}",
                        parts[0].replace('.', "/"),
                        parts[1],
                        parts[2],
                        format!("{}-{}.jar", parts[1], parts[2])
                    );
                    let full_path = libs_dir.join(&lib_path);

                    if full_path.exists() {
                        classpath_parts.push(full_path.to_string_lossy().to_string());
                    }
                }
            }
        }
    }

    // Join with platform-specific separator
    let separator = if cfg!(windows) { ";" } else { ":" };
    Ok(classpath_parts.join(separator))
}

/// Get natives directory path
fn get_natives_dir(game_version: &str) -> Result<PathBuf, String> {
    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let natives_dir = home
        .join(".nerolauncher")
        .join("versions")
        .join(game_version)
        .join("natives");

    Ok(natives_dir)
}

/// Launch Minecraft with specified profile
/// Returns PID of the launched process
#[tauri::command]
pub fn launch_game(
    params: LaunchGameParams,
    db: State<DbState>,
) -> Result<u32, String> {
    // Parse strategy
    let strategy = match params.game_dir_strategy.as_str() {
        "global" => GameDirStrategy::Global,
        "per-profile" => GameDirStrategy::PerProfile,
        "per-family" => GameDirStrategy::PerFamily,
        _ => GameDirStrategy::Global,
    };

    // Resolve game directory
    let game_dir = resolve_game_dir(strategy, &params.profile_id, None);

    // Ensure game directory exists
    std::fs::create_dir_all(&game_dir).map_err(|e| e.to_string())?;

    let home = dirs::home_dir()
        .ok_or("Could not determine home directory")?;

    let assets_dir = home.join(".nerolauncher").join("assets");
    let version_dir = home.join(".nerolauncher").join("versions").join(&params.game_version);

    // Get asset index ID from version.json
    let version_json_path = version_dir.join(format!("{}.json", &params.game_version));
    let version_json_str = std::fs::read_to_string(&version_json_path)
        .map_err(|e| format!("Failed to read version.json: {}", e))?;

    let version_json: serde_json::Value = serde_json::from_str(&version_json_str)
        .map_err(|e| format!("Failed to parse version.json: {}", e))?;

    let asset_index = version_json
        .get("assetIndex")
        .and_then(|a| a.get("id"))
        .and_then(|i| i.as_str())
        .unwrap_or("legacy");

    // Get Java path from database
    let java_path = {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        let java_version_str = params.java_version.to_string();
        let setting_key = format!("java_path_{}", java_version_str);

        crate::db::settings::get_setting(&conn, &setting_key)
            .map_err(|e| e.to_string())?
            .unwrap_or_else(|| "java".to_string())
    };

    // Build classpath
    let classpath = build_classpath(&params.game_version)?;

    // Get natives directory
    let natives_dir = get_natives_dir(&params.game_version)?;
    std::fs::create_dir_all(&natives_dir).map_err(|e| e.to_string())?;

    // Build JVM command
    let mut cmd = Command::new(&java_path);

    // Add memory settings
    let has_xmx = params.java_args.as_ref().map(|a| a.contains("-Xmx")).unwrap_or(false);
    let has_xms = params.java_args.as_ref().map(|a| a.contains("-Xms")).unwrap_or(false);

    if !has_xmx {
        cmd.arg("-Xmx2048M");
    }
    if !has_xms {
        cmd.arg("-Xms512M");
    }

    // Add custom Java arguments if provided
    if let Some(args) = &params.java_args {
        for arg in args.split_whitespace() {
            cmd.arg(arg);
        }
    }

    // Add natives library path
    let natives_path = natives_dir.to_string_lossy().to_string();
    cmd.arg(format!("-Djava.library.path={}", natives_path));

    // Add classpath
    cmd.arg("-cp");
    cmd.arg(classpath);

    // Main class — PROPER Minecraft launcher
    cmd.arg("net.minecraft.client.main.Main");

    // Game arguments
    cmd.arg("--username").arg(&params.username);
    cmd.arg("--uuid").arg(&params.uuid);
    cmd.arg("--accessToken").arg(&params.access_token);
    cmd.arg("--userType").arg("msa");
    cmd.arg("--versionType").arg("release");
    cmd.arg("--version").arg(&params.game_version);
    cmd.arg("--gameDir").arg(&game_dir);
    cmd.arg("--assetsDir").arg(assets_dir.to_string_lossy().to_string());
    cmd.arg("--assetIndex").arg(asset_index);
    cmd.arg("--nativesDirectory").arg(natives_path);

    // Add extra arguments if provided
    if let Some(extra) = &params.extra_args {
        for arg in extra.split_whitespace() {
            cmd.arg(arg);
        }
    }

    // Launch the game
    let child = cmd.spawn().map_err(|e| e.to_string())?;

    // Update profile's last played time
    {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        let _ = crate::db::instances::update_last_played(&conn, &params.profile_id);
    }

    Ok(child.id())
}

/// Get game dir params
#[derive(Debug, serde::Deserialize)]
pub struct GetGameDirParams {
    #[serde(alias = "profileId")]
    pub profile_id: String,
    pub strategy: String,
}

/// Get resolved game directory for a profile
#[tauri::command]
pub fn get_game_dir(
    params: GetGameDirParams,
) -> Result<String, String> {
    let strat = match params.strategy.as_str() {
        "global" => GameDirStrategy::Global,
        "per-profile" => GameDirStrategy::PerProfile,
        "per-family" => GameDirStrategy::PerFamily,
        _ => GameDirStrategy::Global,
    };

    Ok(resolve_game_dir(strat, &params.profile_id, None))
}
