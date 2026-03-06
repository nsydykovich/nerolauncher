use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// PolyMC-style Library metadata from version.json
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Library {
    pub name: String,
    #[serde(default)]
    pub url: Option<String>,
    #[serde(default)]
    pub downloads: Option<LibraryDownloads>,
    #[serde(default)]
    pub rules: Option<Vec<Rule>>,
    #[serde(default)]
    pub natives: Option<HashMap<String, String>>,
    #[serde(default)]
    pub extract: Option<Extract>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LibraryDownloads {
    pub artifact: Option<Artifact>,
    #[serde(default)]
    pub classifiers: Option<HashMap<String, Artifact>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Artifact {
    pub path: String,
    pub url: String,
    pub sha1: String,
    pub size: u64,
}

/// OS-specific rules for including/excluding files
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rule {
    pub action: String, // "allow" or "disallow"
    #[serde(default)]
    pub os: Option<OsRule>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OsRule {
    pub name: Option<String>,
    #[serde(default)]
    pub version: Option<String>,
    #[serde(default)]
    pub arch: Option<String>,
}

/// Extract rules (which files to skip when extracting natives)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Extract {
    #[serde(default)]
    pub exclude: Vec<String>,
}

/// Asset metadata from asset index
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Asset {
    pub hash: String,
    pub size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetIndex {
    pub objects: HashMap<String, Asset>,
}

/// Version metadata structure (simplified from Mojang format)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VersionMetadata {
    pub id: String,
    #[serde(rename = "type")]
    pub version_type: String,
    #[serde(rename = "releaseTime")]
    pub release_time: String,
    #[serde(default)]
    pub downloads: Option<VersionDownloads>,
    #[serde(default)]
    pub libraries: Vec<Library>,
    #[serde(rename = "assetIndex")]
    pub asset_index: Option<AssetIndexRef>,
    #[serde(default)]
    pub mainClass: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VersionDownloads {
    pub client: Option<Artifact>,
    pub server: Option<Artifact>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetIndexRef {
    pub id: String,
    pub url: String,
    pub sha1: String,
    pub size: u64,
}

/// Download task progress tracking
#[derive(Debug, Clone, Serialize)]
pub struct DownloadProgress {
    pub stage: String,
    pub current: u64,
    pub total: u64,
    pub percentage: f64,
    pub file_name: Option<String>,
}

/// Determine which OS we're running on for library rules
pub fn get_os_name() -> &'static str {
    match std::env::consts::OS {
        "windows" => "windows",
        "macos" => "osx",
        "linux" => "linux",
        _ => "unknown",
    }
}

pub fn get_os_arch() -> &'static str {
    match std::env::consts::ARCH {
        "x86_64" => "x86_64",
        "aarch64" => "arm64",
        "x86" => "x86",
        "arm" => "arm",
        _ => "unknown",
    }
}

/// Check if a library should be downloaded for current OS
pub fn should_download_library(library: &Library) -> bool {
    if let Some(rules) = &library.rules {
        let mut applies = false;
        for rule in rules {
            match rule.action.as_str() {
                "allow" => {
                    // Check OS rule
                    if let Some(os) = &rule.os {
                        if let Some(os_name) = &os.name {
                            if os_name == get_os_name() {
                                applies = true;
                            }
                        }
                    } else {
                        // No OS restriction, always apply
                        applies = true;
                    }
                }
                "disallow" => {
                    // Check OS rule for disallow
                    if let Some(os) = &rule.os {
                        if let Some(os_name) = &os.name {
                            if os_name == get_os_name() {
                                applies = false;
                            }
                        }
                    } else {
                        applies = false;
                    }
                }
                _ => {}
            }
        }
        applies
    } else {
        // No rules = include by default
        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_os_detection() {
        println!("Current OS: {}", get_os_name());
        println!("Current Arch: {}", get_os_arch());
    }
}
