'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import {
  JVM_GLOBAL_DEFAULTS,
  JVM_SETTINGS_KEY,
  type JvmGlobalSettings,
} from '@/entities/java-version'

export function useJvmGlobal() {
  const [settings, setSettingsState] = React.useState<JvmGlobalSettings>(JVM_GLOBAL_DEFAULTS)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      try {
        const all = await invoke<Record<string, string>>('get_all_settings')
        const raw = all[JVM_SETTINGS_KEY]
        setSettingsState(raw ? { ...JVM_GLOBAL_DEFAULTS, ...JSON.parse(raw) } : JVM_GLOBAL_DEFAULTS)
      } catch {
        setSettingsState(JVM_GLOBAL_DEFAULTS)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const update = async (partial: Partial<JvmGlobalSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial }
      invoke('set_setting', { key: JVM_SETTINGS_KEY, value: JSON.stringify(next) }).catch(() => {})
      return next
    })
  }

  return { settings, update, isLoading }
}
