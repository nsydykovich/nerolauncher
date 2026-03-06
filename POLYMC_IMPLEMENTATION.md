# PolyMC-Inspired Downloader Implementation

Nero Launcher теперь использует архитектуру и подходы из [PolyMC](https://github.com/PolyMC/PolyMC) для надёжного скачивания Minecraft ресурсов.

## Основные улучшения

### 1. SHA1 Верификация (как в PolyMC)
Каждый скачанный файл проверяется по SHA1 хешу перед сохранением:

```rust
// Перед сохранением файла:
let actual_sha1 = format!("{:x}", sha1::Sha1::new().chain_update(&bytes).finalize());
if actual_sha1 != expected_sha1 {
    return Err("SHA1 mismatch");
}
```

**Преимущества**:
- ✅ Защита от повреждённых загрузок
- ✅ Защита от MITM атак
- ✅ Гарантия целостности

### 2. Intelligent Caching
Если файл уже загружен и его SHA1 совпадает, повторная загрузка пропускается:

```rust
if file_exists && calculate_sha1(file) == expected_sha1 {
    // Skip download
    return Ok(());
}
```

**Преимущества**:
- ✅ Экономия трафика
- ✅ Быстрое переиндексирование
- ✅ Сработает даже при прерывании загрузки

### 3. Multiple Fallback URLs (как в PolyMC)
Библиотеки скачиваются с несколько URL источников:

```rust
const LIBRARIES_DOWNLOAD_URLS: &[&str] = &[
    "https://libraries.minecraft.net",    // Официальный репо
    "https://repo1.maven.org/maven2",     // Maven Central (fallback)
];
```

Если загрузка с одного URL не удалась, автоматически пробуется следующий.

**Преимущества**:
- ✅ Надёжность (работает при недоступности официального репо)
- ✅ Скорость (могут выбираться ближайшие зеркала)
- ✅ Отказоустойчивость

### 4. Parallel Downloads с Ограничениями
Как в PolyMC, загрузки ограничены 4 одновременными потоками:

```rust
let semaphore = std::sync::Arc::new(tokio::sync::Semaphore::new(4));
```

**Преимущества**:
- ✅ Сбалансированное использование ресурсов
- ✅ Не перегружает сервер
- ✅ Оптимальная скорость для большинства соединений

### 5. OS-Specific Rules (как в PolyMC)
Библиотеки скачиваются с учётом правил ОС:

```json
{
  "name": "org.lwjgl:lwjgl-opengl",
  "rules": [
    {
      "action": "allow",
      "os": { "name": "windows" }
    },
    {
      "action": "disallow",
      "os": { "name": "osx" }
    }
  ]
}
```

**Преимущества**:
- ✅ Загружаются только необходимые для ОС файлы
- ✅ Сокращает размер установки
- ✅ Избегаются несовместимые библиотеки

## Архитектура

### Models (`src-tauri/src/models/download.rs`)
```rust
pub struct Library {
    pub name: String,
    pub downloads: Option<LibraryDownloads>,
    pub rules: Option<Vec<Rule>>,  // OS-specific rules
    pub natives: Option<HashMap<String, String>>,
}

pub struct Asset {
    pub hash: String,
    pub size: u64,
}

pub struct VersionMetadata {
    pub id: String,
    pub libraries: Vec<Library>,
    pub assetIndex: Option<AssetIndexRef>,
}
```

### Commands (`src-tauri/src/commands/downloader_v2.rs`)
```rust
// Скачать ассеты с SHA1 верификацией
pub async fn download_assets_polymc(
    app: AppHandle,
    version_id: String,
) -> Result<String, String>

// Скачать библиотеки с OS rules и fallback URLs
pub async fn download_libraries_polymc(
    app: AppHandle,
    version_id: String,
) -> Result<String, String>
```

## Сравнение с предыдущей реализацией

| Функция | Старый downloader | PolyMC V2 |
|---------|-------------------|-----------|
| SHA1 верификация | ❌ Нет | ✅ Да |
| Caching | ❌ Всегда перезагружает | ✅ Пропускает при совпадении хеша |
| Fallback URLs | ❌ Одна ссылка | ✅ Несколько (Maven + Official) |
| Parallel limit | ❌ Неограничено | ✅ 4 потока |
| OS Rules | ⚠️ Базовая | ✅ Полная поддержка |
| Progress tracking | ✅ Есть | ✅ Улучшена |

## Frontend Integration

### Использование нового downloader'а:

```typescript
import { usePolymcDownloader } from '@/shared/lib/hooks/use-polymc-downloader'

export function MyComponent() {
  const { isDownloading, progress, error, downloadAllResources } = usePolymcDownloader()

  const handleDownload = async () => {
    try {
      await downloadAllResources('1.21')
      console.log('Success!')
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div>
      {isDownloading && <p>Progress: {progress?.progress}%</p>}
      <button onClick={handleDownload}>Download</button>
    </div>
  )
}
```

## Events

Frontend слушает эти события:

```typescript
// Прогресс любой загрузки
listen('download-progress', (event) => {
  console.log(`${event.payload.stage}: ${event.payload.progress}%`)
})

// Каждый загруженный ассет
listen('asset-downloaded', (event) => {
  console.log(`Asset: ${event.payload.asset}`)
})

// Каждая загруженная библиотека
listen('library-downloaded', (event) => {
  console.log(`Library: ${event.payload.library}`)
})
```

## Ошибки и Обработка

### SHA1 Mismatch
Если SHA1 не совпадает:
1. Файл **не сохраняется**
2. Возвращается ошибка
3. Повторная загрузка пробует следующий URL

### Connection Error
Если соединение разорвалось:
1. Автоматически пробуется следующий fallback URL
2. Если все URL исчерпаны, возвращается ошибка
3. Успешно загруженные файлы не удаляются

### Partial Download
Если загрузка прервана, файл не удаляется:
1. При следующей попытке вычисляется его SHA1
2. Если не совпадает, файл перезагружается
3. При совпадении загрузка пропускается

## Сравнение с PolyMC

| Функция | PolyMC | Nero Launcher |
|---------|--------|---------------|
| Язык | C++ | Rust (Tauri) |
| SHA1 верификация | ✅ Да | ✅ Да |
| Caching | ✅ Да | ✅ Да |
| Fallback URLs | ✅ Да | ✅ Да |
| Parallel downloads | ✅ Да (N потоков) | ✅ Да (4 потока) |
| Progress reporting | ✅ Детальная | ✅ Детальная |
| Error recovery | ✅ Хорошая | ✅ Хорошая |

## Файлы

- `src-tauri/src/models/download.rs` - Структуры данных для версий, библиотек, ассетов
- `src-tauri/src/commands/downloader_v2.rs` - Основная реализация PolyMC-стиля
- `src/shared/lib/hooks/use-polymc-downloader.ts` - Frontend hook для скачивания
- `src/features/game-launcher/model/use-launcher.ts` - Интеграция в запуск игры

## Источники

Реализация основана на:
- [PolyMC GitHub](https://github.com/PolyMC/PolyMC)
- [Minecraft Launcher Metadata](https://launchermeta.mojang.com/mc/game/version_manifest_v2.json)
- [Mojang Version Format](https://launcher.mojang.com/download/Launcher.jar)
