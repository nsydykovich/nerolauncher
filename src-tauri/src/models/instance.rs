use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum LoaderType {
    Vanilla,
    Fabric,
    Forge,
    Neoforge,
    Quilt,
    Optifine,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct LoaderConfig {
    #[serde(rename = "type")]
    pub loader_type: LoaderType,
    pub version: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GameResolution {
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Instance {
    pub id: String,
    pub name: String,
    pub icon_path: Option<String>,
    pub minecraft_version: String,
    pub loader: LoaderConfig,
    pub created_at: String,
    pub last_played_at: Option<String>,
    pub total_playtime_seconds: u64,
    pub path: String,
    pub java_override_path: Option<String>,
    pub jvm_args: Vec<String>,
    pub game_resolution: Option<GameResolution>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct CreateInstanceInput {
    pub name: String,
    pub minecraft_version: String,
    pub loader: LoaderConfig,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct UpdateInstanceInput {
    pub name: Option<String>,
    pub icon_path: Option<Option<String>>,
    pub java_override_path: Option<Option<String>>,
    pub jvm_args: Option<Vec<String>>,
    pub game_resolution: Option<Option<GameResolution>>,
}
