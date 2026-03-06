export interface Profile {
  id: string
  name: string
  gameVersion: string
  modLoader: 'vanilla' | 'forge' | 'fabric' | 'neoforge' | 'quilt' | 'optifine' | 'forge-optifine'
  javaVersion: 8 | 11 | 17 | 21
  javaArgs?: string
  icon?: string
  notes?: string
  gameDir: string
  createdAt: number
  lastPlayed?: number
  playtime: number
  enabled: boolean
}

export interface CreateProfileRequest {
  name: string
  gameVersion: string
  gameDir?: string
}

export interface UpdateProfileRequest {
  name?: string
  gameVersion?: string
  modLoader?: string
  javaVersion?: number
  javaArgs?: string | null
  icon?: string | null
  notes?: string | null
}
