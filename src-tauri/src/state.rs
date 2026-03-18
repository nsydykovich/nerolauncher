use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Mutex;
use tokio::process::Child;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum InstanceStatus {
    Idle,
    Launching,
    Running,
    Downloading,
    Error,
}

pub struct AppState {
    pub app_data_dir: PathBuf,
    pub running_instances: Mutex<HashMap<String, Child>>,
    pub instance_statuses: Mutex<HashMap<String, InstanceStatus>>,
}

impl AppState {
    pub fn new(app_data_dir: PathBuf) -> Self {
        Self {
            app_data_dir,
            running_instances: Mutex::new(HashMap::new()),
            instance_statuses: Mutex::new(HashMap::new()),
        }
    }
}
