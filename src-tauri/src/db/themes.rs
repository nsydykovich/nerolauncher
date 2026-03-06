use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomTheme {
    pub id: String,
    pub name: String,
    pub light_variant: String,
    pub dark_variant: String,
    pub created_at: i64,
    pub data: String, // full JSON blob for export
}

pub fn init_themes_table(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS custom_themes (
            id           TEXT PRIMARY KEY,
            name         TEXT NOT NULL UNIQUE,
            light_variant TEXT NOT NULL,
            dark_variant  TEXT NOT NULL,
            created_at   INTEGER NOT NULL,
            data         TEXT NOT NULL DEFAULT '{}'
        );",
    )
}

pub fn list_themes(conn: &Connection) -> Result<Vec<CustomTheme>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, light_variant, dark_variant, created_at, data
         FROM custom_themes ORDER BY created_at ASC",
    )?;
    let rows = stmt.query_map([], |row| {
        Ok(CustomTheme {
            id: row.get(0)?,
            name: row.get(1)?,
            light_variant: row.get(2)?,
            dark_variant: row.get(3)?,
            created_at: row.get(4)?,
            data: row.get(5)?,
        })
    })?;
    rows.collect()
}

pub fn theme_name_exists(conn: &Connection, name: &str, exclude_id: Option<&str>) -> Result<bool> {
    let count: i64 = match exclude_id {
        Some(id) => conn.query_row(
            "SELECT COUNT(*) FROM custom_themes WHERE name = ?1 AND id != ?2",
            [name, id],
            |r| r.get(0),
        )?,
        None => conn.query_row(
            "SELECT COUNT(*) FROM custom_themes WHERE name = ?1",
            [name],
            |r| r.get(0),
        )?,
    };
    Ok(count > 0)
}

pub fn save_theme(conn: &Connection, theme: &CustomTheme) -> Result<()> {
    conn.execute(
        "INSERT INTO custom_themes (id, name, light_variant, dark_variant, created_at, data)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT(id) DO UPDATE SET
             name          = excluded.name,
             light_variant = excluded.light_variant,
             dark_variant  = excluded.dark_variant,
             data          = excluded.data",
        rusqlite::params![
            theme.id, theme.name, theme.light_variant,
            theme.dark_variant, theme.created_at, theme.data
        ],
    )?;
    Ok(())
}

pub fn delete_theme(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM custom_themes WHERE id = ?1", [id])?;
    Ok(())
}

pub fn rename_theme(conn: &Connection, id: &str, new_name: &str) -> Result<()> {
    conn.execute(
        "UPDATE custom_themes SET name = ?1 WHERE id = ?2",
        [new_name, id],
    )?;
    Ok(())
}
