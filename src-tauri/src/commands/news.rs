use crate::db::DbState;
use crate::db::news::{NewsItem, self};
use tauri::State;

#[tauri::command]
pub fn list_news(db: State<DbState>) -> Result<Vec<NewsItem>, String> {
    let conn = db.0.lock().map_err(|e| format!("Database lock error: {}", e))?;
    news::list_news(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_news(db: State<DbState>, id: String) -> Result<Option<NewsItem>, String> {
    let conn = db.0.lock().map_err(|e| format!("Database lock error: {}", e))?;
    news::get_news(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_news(
    db: State<DbState>,
    id: String,
    title: String,
    content: String,
    image_url: Option<String>,
    link: Option<String>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| format!("Database lock error: {}", e))?;
    news::create_news(
        &conn,
        &id,
        &title,
        &content,
        image_url.as_deref(),
        link.as_deref(),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_news(
    db: State<DbState>,
    id: String,
    title: Option<String>,
    content: Option<String>,
    image_url: Option<String>,
    link: Option<String>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| format!("Database lock error: {}", e))?;
    news::update_news(
        &conn,
        &id,
        title.as_deref(),
        content.as_deref(),
        image_url.as_deref(),
        link.as_deref(),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_news(db: State<DbState>, id: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| format!("Database lock error: {}", e))?;
    news::delete_news(&conn, &id).map_err(|e| e.to_string())
}
