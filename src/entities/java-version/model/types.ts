export const JAVA_VERSION_NUMBERS = [8, 11, 17, 21] as const

export type JavaVersionNumber = (typeof JAVA_VERSION_NUMBERS)[number]

export interface JavaVersion {
  javaVersion: JavaVersionNumber
  javaPath: string
  isActive: boolean
}

export const versionToSettingKey = (version: JavaVersionNumber): string => {
  return `java_path_${version}`
}

export const JAVA_ACTIVE_VERSION_KEY = 'java_active_version'
