use serde::{Deserialize, Serialize};

/// Game profile — contains all settings for a specific Minecraft instance
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: String,                    // unique identifier (UUID)
    pub name: String,                   // display name
    pub game_version: String,           // e.g. "1.21", "1.20.1"
    pub mod_loader: String,             // "vanilla", "forge", "fabric", "neoforge", "quilt", "optifine", "forge-optifine"
    pub java_version: u8,               // 8, 11, 17, 21
    pub java_args: Option<String>,      // override global Java args
    pub icon: Option<String>,           // base64 encoded icon or path
    pub notes: Option<String>,          // user notes
    pub game_dir: String,               // path to .minecraft equivalent for this profile
    pub created_at: i64,                // unix timestamp
    pub last_played: Option<i64>,       // unix timestamp
    pub playtime: i64,                  // total seconds played
    pub enabled: bool,                  // soft delete
}

impl Profile {
    pub fn new(name: String, game_version: String, game_dir: String) -> Self {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs() as i64)
            .unwrap_or(0);

        Self {
            id: uuid::Uuid::new_v4().to_string(),
            name,
            game_version,
            mod_loader: "vanilla".to_string(),
            java_version: 21,
            java_args: None,
            icon: None,
            notes: None,
            game_dir,
            created_at: now,
            last_played: None,
            playtime: 0,
            enabled: true,
        }
    }
}

/// Request to create a new profile
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProfileRequest {
    pub name: String,
    pub game_version: String,
    pub game_dir: Option<String>,
}

/// Request to update a profile
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProfileRequest {
    pub name: Option<String>,
    pub game_version: Option<String>,
    pub mod_loader: Option<String>,
    pub java_version: Option<u8>,
    pub java_args: Option<Option<String>>,
    pub icon: Option<Option<String>>,
    pub notes: Option<Option<String>>,
}
