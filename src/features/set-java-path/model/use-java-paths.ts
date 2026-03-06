'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import {
  JAVA_VERSION_NUMBERS,
  versionToSettingKey,
  versionToSourceKey,
  versionToArgsPresetKey,
  versionToCustomArgsKey,
  versionToExtraArgsKey,
  type JavaVersionNumber,
  type JavaVersion,
  type JavaSourceType,
  type JavaArgsPresetId,
} from '@/entities/java-version'

export function useJavaPaths() {
  const [versions, setVersions] = React.useState<JavaVersion[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      try {
        const all = await invoke<Record<string, string>>('get_all_settings')
        setVersions(
          JAVA_VERSION_NUMBERS.map((v) => ({
            javaVersion: v,
            javaPath: all[versionToSettingKey(v)] || '',
            sourceType: (all[versionToSourceKey(v)] as JavaSourceType) || 'mojang',
            argsPreset: (all[versionToArgsPresetKey(v)] as JavaArgsPresetId) || 'aikars',
            customArgs: all[versionToCustomArgsKey(v)] || '',
            extraArgs: all[versionToExtraArgsKey(v)] || '',
          })),
        )
      } catch {
        setVersions(
          JAVA_VERSION_NUMBERS.map((v) => ({
            javaVersion: v,
            javaPath: '',
            sourceType: 'mojang' as JavaSourceType,
            argsPreset: 'aikars' as JavaArgsPresetId,
            customArgs: '',
            extraArgs: '',
          })),
        )
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const setPath = async (version: JavaVersionNumber, path: string) => {
    setVersions((prev) => prev.map((v) => v.javaVersion === version ? { ...v, javaPath: path } : v))
    try { await invoke('set_setting', { key: versionToSettingKey(version), value: path }) } catch {}
  }

  const setSourceType = async (version: JavaVersionNumber, source: JavaSourceType) => {
    setVersions((prev) => prev.map((v) => v.javaVersion === version ? { ...v, sourceType: source } : v))
    try { await invoke('set_setting', { key: versionToSourceKey(version), value: source }) } catch {}
  }

  const setArgsPreset = async (version: JavaVersionNumber, preset: JavaArgsPresetId) => {
    setVersions((prev) => prev.map((v) => v.javaVersion === version ? { ...v, argsPreset: preset } : v))
    try { await invoke('set_setting', { key: versionToArgsPresetKey(version), value: preset }) } catch {}
  }

  const setCustomArgs = async (version: JavaVersionNumber, args: string) => {
    setVersions((prev) => prev.map((v) => v.javaVersion === version ? { ...v, customArgs: args } : v))
    try { await invoke('set_setting', { key: versionToCustomArgsKey(version), value: args }) } catch {}
  }

  const setExtraArgs = async (version: JavaVersionNumber, args: string) => {
    setVersions((prev) => prev.map((v) => v.javaVersion === version ? { ...v, extraArgs: args } : v))
    try { await invoke('set_setting', { key: versionToExtraArgsKey(version), value: args }) } catch {}
  }

  const browse = async (version: JavaVersionNumber) => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog')
      const selected = await open({
        multiple: false,
        directory: false,
        filters: [{ name: 'Java Executable', extensions: ['exe', 'bin', 'cmd'] }],
      })
      if (typeof selected === 'string') await setPath(version, selected)
    } catch {}
  }

  return {
    versions,
    setPath,
    setSourceType,
    setArgsPreset,
    setCustomArgs,
    setExtraArgs,
    browse,
    isLoading,
  }
}
