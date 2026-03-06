export const JAVA_VERSION_NUMBERS = [8, 11, 17, 21] as const

export type JavaVersionNumber = (typeof JAVA_VERSION_NUMBERS)[number]

export type JavaSourceType = 'mojang' | 'custom'

export type JavaArgsPresetId = 'aikars' | 'g1gc-client' | 'zgc' | 'shenandoah' | 'custom'

export interface JavaVersion {
  javaVersion: JavaVersionNumber
  javaPath: string
  sourceType: JavaSourceType
  argsPreset: JavaArgsPresetId    // selected preset or 'custom'
  customArgs: string               // custom args when argsPreset='custom'
  extraArgs: string                // additional args (appended to preset or custom)
}

export const versionToSettingKey = (version: JavaVersionNumber): string =>
  `java_path_${version}`

export const versionToSourceKey = (version: JavaVersionNumber): string =>
  `java_source_${version}`

export const versionToArgsPresetKey = (version: JavaVersionNumber): string =>
  `java_args_preset_${version}`

export const versionToCustomArgsKey = (version: JavaVersionNumber): string =>
  `java_custom_args_${version}`

export const versionToExtraArgsKey = (version: JavaVersionNumber): string =>
  `java_extra_args_${version}`

// ── Global JVM settings ───────────────────────────────────────────────────────

export interface JvmGlobalSettings {
  xms: number          // MB
  xmx: number          // MB
  largePages: boolean
}

export const JVM_GLOBAL_DEFAULTS: JvmGlobalSettings = {
  xms: 512,
  xmx: 2048,
  largePages: false,
}

export const JVM_SETTINGS_KEY = 'jvm_global'

// ── GC presets ────────────────────────────────────────────────────────────────

export interface GcPreset {
  id: string
  label: string
  description: string
  argsPerVersion: Partial<Record<JavaVersionNumber, string>>
}

export const GC_PRESETS: GcPreset[] = [
  {
    id: 'aikars',
    label: "Aikar's Flags (G1GC)",
    description: 'Battle-tested preset for Minecraft. Best all-round choice.',
    argsPerVersion: {
      8: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true',
      11: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true',
      17: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true',
      21: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true',
    },
  },
  {
    id: 'g1gc-client',
    label: 'G1GC Client',
    description: 'Optimised for low GC pauses on client instances.',
    argsPerVersion: {
      8: '-XX:+UseG1GC -XX:MaxGCPauseMillis=37 -XX:+PerfDisableSharedMem -XX:G1HeapRegionSize=16M -XX:G1NewSizePercent=23 -XX:G1ReservePercent=20 -XX:SurvivorRatio=32 -XX:G1MixedGCCountTarget=3 -XX:G1HeapWastePercent=20 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:MaxTenuringThreshold=1 -XX:GCTimeRatio=99',
      11: '-XX:+UseG1GC -XX:MaxGCPauseMillis=37 -XX:+PerfDisableSharedMem -XX:G1HeapRegionSize=16M -XX:G1NewSizePercent=23 -XX:G1ReservePercent=20 -XX:SurvivorRatio=32 -XX:G1MixedGCCountTarget=3 -XX:G1HeapWastePercent=20 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:MaxTenuringThreshold=1 -XX:GCTimeRatio=99',
      17: '-XX:+UseG1GC -XX:MaxGCPauseMillis=37 -XX:+PerfDisableSharedMem -XX:G1HeapRegionSize=16M -XX:G1NewSizePercent=23 -XX:G1ReservePercent=20 -XX:SurvivorRatio=32 -XX:G1MixedGCCountTarget=3 -XX:G1HeapWastePercent=20 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:MaxTenuringThreshold=1 -XX:GCTimeRatio=99',
      21: '-XX:+UseG1GC -XX:MaxGCPauseMillis=37 -XX:+PerfDisableSharedMem -XX:G1HeapRegionSize=16M -XX:G1NewSizePercent=23 -XX:G1ReservePercent=20 -XX:SurvivorRatio=32 -XX:G1MixedGCCountTarget=3 -XX:G1HeapWastePercent=20 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:MaxTenuringThreshold=1 -XX:GCTimeRatio=99',
    },
  },
  {
    id: 'zgc',
    label: 'ZGC Generational',
    description: 'Ultra-low pause GC for large heaps (6 GB+, 4+ cores).',
    argsPerVersion: {
      21: '-XX:+UseZGC -XX:+ZGenerational -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+PerfDisableSharedMem -XX:+UseDynamicNumberOfGCThreads',
    },
  },
  {
    id: 'shenandoah',
    label: 'Shenandoah GC',
    description: 'Concurrent low-pause collector.',
    argsPerVersion: {
      17: '-XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+ParallelRefProcEnabled -XX:+PerfDisableSharedMem',
      21: '-XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+ParallelRefProcEnabled -XX:+PerfDisableSharedMem',
    },
  },
]

// ── Helper to get preset args for a specific Java version ──────────────────────

export function getPresetArgs(presetId: JavaArgsPresetId, javaVersion: JavaVersionNumber): string {
  if (presetId === 'custom') return ''
  const preset = GC_PRESETS.find((p) => p.id === presetId)
  return preset?.argsPerVersion[javaVersion] ?? ''
}
