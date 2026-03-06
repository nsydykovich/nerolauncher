use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::sync::Mutex;

pub mod settings;
pub mod themes;
pub mod profiles;
pub mod news;

pub struct DbState(pub Mutex<Connection>);

pub fn get_db_path(app_data_dir: &PathBuf) -> PathBuf {
    app_data_dir.join("settings.db")
}

pub fn init_db(app_data_dir: &PathBuf) -> Result<Connection> {
    std::fs::create_dir_all(app_data_dir).ok();
    let path = get_db_path(app_data_dir);
    let conn = Connection::open(&path)?;
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );",
    )?;
    themes::init_themes_table(&conn)?;
    profiles::init_profiles_table(&conn)?;
    news::create_news_table(&conn)?;
    Ok(conn)
}
