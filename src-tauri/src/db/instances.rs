use rusqlite::{Connection, Result as SqliteResult, params, OptionalExtension};
use crate::models::Profile;

pub fn init_profiles_table(conn: &Connection) -> SqliteResult<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            game_version TEXT NOT NULL,
            mod_loader TEXT NOT NULL,
            java_version INTEGER NOT NULL,
            java_args TEXT,
            icon TEXT,
            notes TEXT,
            game_dir TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            last_played INTEGER,
            playtime INTEGER NOT NULL DEFAULT 0,
            enabled BOOLEAN NOT NULL DEFAULT 1
        )",
        [],
    )?;
    Ok(())
}

pub fn create_profile(conn: &Connection, profile: &Profile) -> SqliteResult<()> {
    conn.execute(
        "INSERT INTO profiles (id, name, game_version, mod_loader, java_version, java_args, icon, notes, game_dir, created_at, last_played, playtime, enabled)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
            &profile.id,
            &profile.name,
            &profile.game_version,
            &profile.mod_loader,
            profile.java_version,
            &profile.java_args,
            &profile.icon,
            &profile.notes,
            &profile.game_dir,
            profile.created_at,
            profile.last_played,
            profile.playtime,
            profile.enabled,
        ],
    )?;
    Ok(())
}

pub fn get_profile(conn: &Connection, id: &str) -> SqliteResult<Option<Profile>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, game_version, mod_loader, java_version, java_args, icon, notes, game_dir, created_at, last_played, playtime, enabled
         FROM profiles WHERE id = ?1 AND enabled = 1"
    )?;

    let profile = stmt.query_row([id], |row| {
        Ok(Profile {
            id: row.get(0)?,
            name: row.get(1)?,
            game_version: row.get(2)?,
            mod_loader: row.get(3)?,
            java_version: row.get(4)?,
            java_args: row.get(5)?,
            icon: row.get(6)?,
            notes: row.get(7)?,
            game_dir: row.get(8)?,
            created_at: row.get(9)?,
            last_played: row.get(10)?,
            playtime: row.get(11)?,
            enabled: row.get::<_, i32>(12)? != 0,
        })
    }).optional()?;

    Ok(profile)
}

pub fn list_profiles(conn: &Connection) -> SqliteResult<Vec<Profile>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, game_version, mod_loader, java_version, java_args, icon, notes, game_dir, created_at, last_played, playtime, enabled
         FROM profiles WHERE enabled = 1 ORDER BY last_played DESC, created_at DESC"
    )?;

    let profiles = stmt.query_map([], |row| {
        Ok(Profile {
            id: row.get(0)?,
            name: row.get(1)?,
            game_version: row.get(2)?,
            mod_loader: row.get(3)?,
            java_version: row.get(4)?,
            java_args: row.get(5)?,
            icon: row.get(6)?,
            notes: row.get(7)?,
            game_dir: row.get(8)?,
            created_at: row.get(9)?,
            last_played: row.get(10)?,
            playtime: row.get(11)?,
            enabled: row.get::<_, i32>(12)? != 0,
        })
    })?.collect::<SqliteResult<Vec<_>>>()?;

    Ok(profiles)
}

pub fn update_profile_name(conn: &Connection, id: &str, name: &str) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET name = ?1 WHERE id = ?2", params![name, id])? > 0)
}

pub fn update_profile_version(conn: &Connection, id: &str, version: &str) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET game_version = ?1 WHERE id = ?2", params![version, id])? > 0)
}

pub fn update_profile_loader(conn: &Connection, id: &str, loader: &str) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET mod_loader = ?1 WHERE id = ?2", params![loader, id])? > 0)
}

pub fn update_profile_java(conn: &Connection, id: &str, java_version: u8) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET java_version = ?1 WHERE id = ?2", params![java_version, id])? > 0)
}

pub fn update_profile_java_args(conn: &Connection, id: &str, args: Option<&str>) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET java_args = ?1 WHERE id = ?2", params![args, id])? > 0)
}

pub fn update_profile_icon(conn: &Connection, id: &str, icon: Option<&str>) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET icon = ?1 WHERE id = ?2", params![icon, id])? > 0)
}

pub fn update_profile_notes(conn: &Connection, id: &str, notes: Option<&str>) -> SqliteResult<bool> {
    Ok(conn.execute("UPDATE profiles SET notes = ?1 WHERE id = ?2", params![notes, id])? > 0)
}

pub fn delete_profile(conn: &Connection, id: &str) -> SqliteResult<bool> {
    let changed = conn.execute(
        "UPDATE profiles SET enabled = 0 WHERE id = ?1",
        [id],
    )? > 0;
    Ok(changed)
}

pub fn update_last_played(conn: &Connection, id: &str) -> SqliteResult<()> {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0);

    conn.execute(
        "UPDATE profiles SET last_played = ?1 WHERE id = ?2",
        params![now, id],
    )?;
    Ok(())
}

pub fn add_playtime(conn: &Connection, id: &str, seconds: i64) -> SqliteResult<()> {
    conn.execute(
        "UPDATE profiles SET playtime = playtime + ?1 WHERE id = ?2",
        params![seconds, id],
    )?;
    Ok(())
}
