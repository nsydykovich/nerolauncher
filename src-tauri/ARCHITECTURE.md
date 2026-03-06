# Backend Architecture - Nero Launcher

## Overview

The Tauri backend is organized into modular layers following Clean Architecture principles:

```
src-tauri/src/
├── lib.rs           # Application entry point and command registration
├── models/          # Data structures (Profile, requests, responses)
├── db/              # Database layer (SQLite)
│   ├── mod.rs       # DB initialization and state management
│   ├── settings.rs  # Settings CRUD operations
│   ├── themes.rs    # Custom themes persistence
│   └── profiles.rs  # Game profiles management
├── commands/        # Tauri command handlers (RPC layer)
│   ├── mod.rs
│   ├── settings.rs  # Settings commands
│   ├── java.rs      # JVM arguments resolution
│   ├── themes.rs    # Theme commands
│   └── profiles.rs  # Profile commands
└── tray.rs          # System tray integration
```

## Data Flow

1. **Frontend** (Next.js/React) calls Tauri command via JavaScript
2. **Commands** (`src/commands/`) validate input and call DB layer
3. **Database** (`src/db/`) executes SQL operations on SQLite
4. **Models** (`src/models/`) define data structures with serde serialization
5. Response flows back to Frontend as JSON

## Key Modules

### Models (`models/`)

**Profile** - Game instance configuration:
- `id` — UUID identifier
- `name` — Display name (user-provided)
- `gameVersion` — Minecraft version (e.g., "1.21")
- `modLoader` — Loader type (vanilla, forge, fabric, etc.)
- `javaVersion` — JDK version (8, 11, 17, 21)
- `javaArgs` — JVM arguments override
- `icon` — Base64 encoded icon
- `notes` — User notes
- `gameDir` — Profile-specific game directory
- `createdAt` — Creation timestamp
- `lastPlayed` — Last launch timestamp
- `playtime` — Total seconds played
- `enabled` — Soft delete flag

### Database (`db/`)

#### Initialization
```rust
init_db(app_data_dir) -> Connection
```
Creates SQLite database at `%APPDATA%/nerolauncher/settings.db` and initializes all tables.

#### Profile Table Operations
- `create_profile()` — Insert new profile
- `get_profile(id)` — Fetch single profile
- `list_profiles()` — Fetch all enabled profiles (sorted by last played)
- `update_profile_*()` — Update individual fields (name, version, loader, etc.)
- `delete_profile(id)` — Soft delete (sets enabled=0)
- `update_last_played(id)` — Update last launch timestamp
- `add_playtime(id, seconds)` — Accumulate playtime

### Commands (`commands/`)

#### Profile Commands
All commands return errors as strings for frontend error handling.

**create_profile(req: CreateProfileRequest) → Profile**
- Creates new profile with UUID
- Defaults: vanilla loader, Java 21, default .minecraft dir
- Returns created profile

**list_profiles() → Vec<Profile>**
- Returns all non-deleted profiles
- Sorted by last_played DESC, then created_at DESC

**get_profile(id: String) → Option<Profile>**
- Fetch single profile or None if not found

**update_profile(id: String, req: UpdateProfileRequest) → ()**
- Patch updates (optional fields)
- Only provided fields are updated

**delete_profile(id: String) → bool**
- Soft deletes profile (sets enabled=0)
- Returns true if profile existed

**update_last_played(id: String) → ()**
- Called when profile is launched

**add_playtime(id: String, seconds: i64) → ()**
- Called periodically or at game close

## Database Schema

### profiles table
```sql
CREATE TABLE profiles (
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
)
```

Indices (future optimization):
- `idx_enabled_last_played` — For list_profiles() query
- `idx_created_at` — For sorting by creation

## Error Handling

All Tauri commands return `Result<T, String>` where errors are serialized as strings:

```rust
db.0.lock().map_err(|e| e.to_string())?
crate::db::profiles::operation(&conn).map_err(|e| e.to_string())?
```

Frontend receives error message in `.err()` field of response.

## State Management

### DbState
```rust
pub struct DbState(pub Mutex<Connection>);
```

Single shared SQLite connection wrapped in Mutex for thread-safe access. Initialized in `setup()` hook.

### Configuration
- **Database file**: `%APPDATA%/nerolauncher/settings.db`
- **Max profiles**: No limit (SQLite scales well for user-level data)
- **Concurrency**: Single writer (SQLite limitation), multiple readers

## Future Enhancements

1. **Database Migrations** — Add migration system for schema updates
2. **Indices** — Add indices for large profile collections
3. **Backup** — Automated database backups
4. **Validation** — Input validation at command layer
5. **Logging** — Command execution logging for debugging
6. **Transaction Support** — Multi-operation transactions
7. **Sync** — Cloud sync for multi-device profiles

## Dependencies

- **tauri** — Desktop framework and IPC
- **rusqlite** — SQLite bindings (bundled)
- **serde** — Serialization/deserialization
- **uuid** — UUID generation for profile IDs
- **dirs** — Platform-specific directory paths

## Testing

To test backend commands:

1. Build Tauri app: `npm run tauri build`
2. Use DevTools console: `await invoke('create_profile', { ... })`
3. Check database: `sqlite3 %APPDATA%/nerolauncher/settings.db`
