use rusqlite::{Connection, params, Result};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct NewsItem {
    pub id: String,
    pub title: String,
    pub content: String,
    pub image_url: Option<String>,
    pub link: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

pub fn create_news_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS news (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT,
            link TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )",
        [],
    )?;
    Ok(())
}

pub fn list_news(conn: &Connection) -> Result<Vec<NewsItem>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, content, image_url, link, created_at, updated_at
         FROM news
         ORDER BY created_at DESC
         LIMIT 50"
    )?;

    let news_items = stmt.query_map([], |row| {
        Ok(NewsItem {
            id: row.get(0)?,
            title: row.get(1)?,
            content: row.get(2)?,
            image_url: row.get(3)?,
            link: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    })?
    .collect::<Result<Vec<_>>>()?;

    Ok(news_items)
}

pub fn get_news(conn: &Connection, id: &str) -> Result<Option<NewsItem>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, content, image_url, link, created_at, updated_at
         FROM news
         WHERE id = ?1"
    )?;

    let result = stmt.query_row(params![id], |row| {
        Ok(NewsItem {
            id: row.get(0)?,
            title: row.get(1)?,
            content: row.get(2)?,
            image_url: row.get(3)?,
            link: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    });

    match result {
        Ok(item) => Ok(Some(item)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e),
    }
}

pub fn create_news(
    conn: &Connection,
    id: &str,
    title: &str,
    content: &str,
    image_url: Option<&str>,
    link: Option<&str>,
) -> Result<()> {
    let now = chrono::Local::now().timestamp();

    conn.execute(
        "INSERT INTO news (id, title, content, image_url, link, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![id, title, content, image_url, link, now, now],
    )?;
    Ok(())
}

pub fn update_news(
    conn: &Connection,
    id: &str,
    title: Option<&str>,
    content: Option<&str>,
    image_url: Option<&str>,
    link: Option<&str>,
) -> Result<()> {
    let now = chrono::Local::now().timestamp();

    if let Some(title_val) = title {
        conn.execute(
            "UPDATE news SET title = ?1, updated_at = ?2 WHERE id = ?3",
            params![title_val, now, id],
        )?;
    }

    if let Some(content_val) = content {
        conn.execute(
            "UPDATE news SET content = ?1, updated_at = ?2 WHERE id = ?3",
            params![content_val, now, id],
        )?;
    }

    if let Some(image_url_val) = image_url {
        conn.execute(
            "UPDATE news SET image_url = ?1, updated_at = ?2 WHERE id = ?3",
            params![image_url_val, now, id],
        )?;
    }

    if let Some(link_val) = link {
        conn.execute(
            "UPDATE news SET link = ?1, updated_at = ?2 WHERE id = ?3",
            params![link_val, now, id],
        )?;
    }

    Ok(())
}

pub fn delete_news(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM news WHERE id = ?1", params![id])?;
    Ok(())
}
