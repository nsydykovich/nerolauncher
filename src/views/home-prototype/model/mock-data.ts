export const PROFILES = [
    { id: '1', name: 'Survival 1.21.4', version: '1.21.4', modLoader: 'Vanilla',    lastPlayed: '2 часа назад',   icon: '⚔️' },
    { id: '2', name: 'Create Modpack',  version: '1.20.1', modLoader: 'Forge',      lastPlayed: 'Вчера',          icon: '⚙️' },
    { id: '3', name: 'Hypixel Client',  version: '1.8.9',  modLoader: 'OptiFine',   lastPlayed: '3 дня назад',    icon: '🏆' },
    { id: '4', name: 'Skyblock Setup',  version: '1.20.4', modLoader: 'Fabric',     lastPlayed: 'Неделю назад',   icon: '🌐' },
]

export const NEWS = [
    {
        id: '1',
        title: 'Minecraft 1.21.4 — The Garden Awakens',
        description: 'Новое обновление добавляет Pale Garden биом, Creaking моба и множество новых блоков.',
        date: '28 ноя 2024',
        tag: 'Релиз',
        tagColor: 'bg-green-500/20 text-green-400',
        image: null,
    },
    {
        id: '2',
        title: 'Forge 49.1.0 для 1.21.4',
        description: 'Стабильный релиз Forge для последней версии Minecraft с улучшенной совместимостью модов.',
        date: '5 дек 2024',
        tag: 'Forge',
        tagColor: 'bg-orange-500/20 text-orange-400',
        image: null,
    },
    {
        id: '3',
        title: 'Fabric 0.16.9 выпущен',
        description: 'Обновление Fabric Loader с поддержкой новых API и исправлением критических ошибок.',
        date: '10 дек 2024',
        tag: 'Fabric',
        tagColor: 'bg-blue-500/20 text-blue-400',
        image: null,
    },
]

export const QUICK_MODS = [
    { id: '1', name: 'Sodium',         downloads: '28M',   icon: '🧪', category: 'Оптимизация' },
    { id: '2', name: 'Iris Shaders',   downloads: '18M',   icon: '🌈', category: 'Шейдеры' },
    { id: '3', name: 'Create',         downloads: '52M',   icon: '⚙️', category: 'Геймплей' },
    { id: '4', name: 'JEI',            downloads: '210M',  icon: '📖', category: 'Утилиты' },
]

export type Profile = typeof PROFILES[number]
export type NewsItem = typeof NEWS[number]
export type Mod = typeof QUICK_MODS[number]
