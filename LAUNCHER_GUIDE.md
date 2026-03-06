# Nero Launcher - Рабочий гайд по запуску

## ✅ Что реализовано (Фазы 2-3)

### Фаза 2: Реальный запуск Minecraft
Теперь лаунчер **реально запускает Minecraft** с корректными параметрами:

**Правильная команда запуска:**
```bash
java -Xmx2048M -Xms512M \
  -Djava.library.path=~/.nerolauncher/versions/{version}/natives \
  -cp {classpath with all libraries and client.jar} \
  net.minecraft.client.main.Main \
  --username {username} \
  --uuid {uuid} \
  --accessToken {token} \
  --userType msa \
  --version {version} \
  --gameDir {game directory} \
  --assetsDir ~/.nerolauncher/assets \
  --assetIndex {asset index} \
  --nativesDirectory ~/.nerolauncher/versions/{version}/natives
```

**Ключевые улучшения:**
- ✅ Правильный main class (`net.minecraft.client.main.Main` вместо `Bootstrap`)
- ✅ Автоматическое построение classpath из version.json
- ✅ Поддержка OS-specific rules для библиотек (Windows/Linux/macOS)
- ✅ Передача authentication данных (username, UUID, access token)
- ✅ Правильные пути для ассетов и natives

### Фаза 3: Полная загрузка ресурсов
Перед запуском автоматически скачиваются все необходимые ресурсы:

**1. Assets (текстуры, звуки)**
- Источник: `https://resources.download.minecraft.net/`
- Параллельная загрузка (4 потока)
- Сохранение: `~/.nerolauncher/assets/objects/{hash[:2]}/{hash}`

**2. Libraries (зависимости)**
- Источник: Maven репозитории
- Проверка OS rules (allow/disallow)
- Сохранение: `~/.nerolauncher/libraries/{path}/`

**3. Natives (LWJGL и др.)**
- Классификация по ОС
- Автоматическая распаковка JAR файлов
- Сохранение: `~/.nerolauncher/versions/{version}/natives/`

## 🔧 Использование

### Для разработчика

**Запуск лаунчера:**
```bash
cd src-tauri
cargo build --release
```

**Тестирование in-game запуска:**
1. Откройте Home страницу
2. Нажмите кнопку "Play"
3. Лаунчер автоматически:
   - Скачает ассеты, библиотеки, natives
   - Запустит Minecraft с параметрами

**Проверка версии:**
```rust
// Rust backend
let result = verify_version("1.21", game_dir)?;
println!("Is valid: {}", result.is_valid);
println!("Missing: {:?}", result.missing_files);
```

**Из TypeScript:**
```typescript
import { useLauncher } from '@/features/game-launcher'

const { launch, isLaunching, error } = useLauncher()

await launch({
  profileId: 'profile-1',
  gameVersion: '1.21',
  javaVersion: 17,
  gameDirStrategy: 'per-profile',
  username: 'Steve',
  uuid: 'ffffffffffffffffffffffffffffffff',
  accessToken: '', // for offline mode
})
```

## 📦 Backend команды

### Launcher commands
```rust
// Запуск игры с полными параметрами
launch_game(
  profile_id: String,
  game_version: String,
  java_version: u8,
  game_dir_strategy: String,
  java_args: Option<String>,
  extra_args: Option<String>,
  username: String,
  uuid: String,
  access_token: String,
) -> Result<u32, String>

// Получить game directory
get_game_dir(profile_id: String, strategy: String) -> Result<String, String>
```

### Downloader commands
```rust
// Скачать ассеты для версии
download_assets(
  version_id: String,
  asset_index_id: String,
) -> Result<String, String>

// Скачать библиотеки
download_libraries(version_id: String) -> Result<String, String>

// Скачать и распаковать natives
download_natives(version_id: String) -> Result<String, String>
```

### Verifier commands
```rust
// Проверить целостность версии
verify_version(
  version_id: String,
  game_dir: String,
) -> Result<VerificationResult, String>

// Попытаться восстановить версию
repair_version(
  version_id: String,
  version_url: String,
) -> Result<String, String>
```

## 🔌 Events

### Frontend слушает события загрузки:
```typescript
import { listen } from '@tauri-apps/api/event'

listen('download-progress', (event) => {
  console.log(`${event.payload.stage}: ${event.payload.progress}%`)
})
```

**Stages:**
- `metadata` - загрузка version.json
- `client_jar` - загрузка client.jar
- `assets` - загрузка ассетов
- `libraries` - загрузка библиотек
- `natives` - распаковка natives

## 🎯 Следующие шаги (Фаза 1: Авторизация)

**TODO:**
- [ ] Microsoft OAuth integration
- [ ] Oauth token refresh
- [ ] Account management UI
- [ ] Store tokens in DB securely
- [ ] Profile-specific account selection

**Временно:**
- Используется stub аккаунт "Steve" (offline mode)
- UUID = `ffffffffffffffffffffffffffffffff` (offline signature)
- Access token не требуется для offline

## 📝 Примечания

### Структура каталогов
```
~/.nerolauncher/
├── versions/
│   └── {version}/
│       ├── {version}.json
│       ├── {version}.jar
│       └── natives/
│           ├── lwjgl.dll
│           └── lwjgl_opengl.dll
├── libraries/
│   └── org/lwjgl/...
├── assets/
│   ├── indexes/
│   │   └── {index}.json
│   └── objects/
│       └── {hash[:2]}/
│           └── {hash}
└── settings.db
```

### Поддерживаемые версии
- Release версии (стабильные)
- Snapshot версии (beta)
- Old versions (old_alpha, old_beta)

### Mod loaders
- ✅ Vanilla (чистый Minecraft)
- ⚠️ Forge (требуется installer)
- ⚠️ Fabric (требуется installer)
- ⚠️ NeoForge
- ⚠️ Quilt

(Mod loaders требуют отдельной реализации installers)

## 🐛 Отладка

**Проверка логов:**
```bash
# Backend (Rust)
RUST_BACKTRACE=1 cargo build

# Frontend (TypeScript)
console.error() для ошибок
console.log() для отладки
```

**Очистить cache:**
```bash
rm -rf ~/.nerolauncher/versions/{version}  # одна версия
rm -rf ~/.nerolauncher/assets              # все ассеты
rm -rf ~/.nerolauncher/libraries           # все библиотеки
```
