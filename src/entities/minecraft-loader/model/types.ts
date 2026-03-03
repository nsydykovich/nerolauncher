export const MOD_LOADERS = [
  {
    id: 'vanilla',
    displayName: 'Vanilla',
    color: 'from-slate-500 to-slate-600',
    bgClass: 'bg-slate-50 dark:bg-slate-900',
    twoLetters: 'VA',
  },
  {
    id: 'forge',
    displayName: 'Forge',
    color: 'from-orange-500 to-orange-600',
    bgClass: 'bg-orange-50 dark:bg-orange-950',
    twoLetters: 'FG',
  },
  {
    id: 'fabric',
    displayName: 'Fabric',
    color: 'from-blue-500 to-blue-600',
    bgClass: 'bg-blue-50 dark:bg-blue-950',
    twoLetters: 'FB',
  },
  {
    id: 'neoforge',
    displayName: 'NeoForge',
    color: 'from-purple-500 to-purple-600',
    bgClass: 'bg-purple-50 dark:bg-purple-950',
    twoLetters: 'NF',
  },
  {
    id: 'quilt',
    displayName: 'Quilt',
    color: 'from-pink-500 to-pink-600',
    bgClass: 'bg-pink-50 dark:bg-pink-950',
    twoLetters: 'QL',
  },
  {
    id: 'optifine',
    displayName: 'OptiFine',
    color: 'from-green-500 to-green-600',
    bgClass: 'bg-green-50 dark:bg-green-950',
    twoLetters: 'OF',
  },
  {
    id: 'forge-optifine',
    displayName: 'Forge+OptiFine',
    color: 'from-amber-500 to-amber-600',
    bgClass: 'bg-amber-50 dark:bg-amber-950',
    twoLetters: 'FO',
  },
] as const

export type ModLoaderType = (typeof MOD_LOADERS)[number]['id']

export interface MinecraftLoader {
  id: ModLoaderType
  displayName: string
  color: string
  bgClass: string
  twoLetters: string
}
