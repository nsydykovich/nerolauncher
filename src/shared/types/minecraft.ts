export type GameDirStrategy = 'global' | 'per-profile' | 'per-family'

export interface MinecraftSettings {
  gameDirStrategy: GameDirStrategy
  customGameDir?: string
  autoDownloadVersions: boolean
  modsSource: 'curseforge' | 'modrinth' | 'both'
}

export interface MinecraftVersion {
  id: string
  version: string
  type: 'release' | 'snapshot' | 'old_alpha' | 'old_beta'
  releaseTime: number
  installed: boolean
  size?: number
}
