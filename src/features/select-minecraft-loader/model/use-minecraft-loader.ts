'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { ModLoaderType } from '@/entities/minecraft-loader'

export function useMinecraftLoader() {
  const [selectedLoader, setSelectedLoaderState] = React.useState<ModLoaderType | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Load on mount
  React.useEffect(() => {
    const loadLoaderFromDb = async () => {
      try {
        const value = await invoke<string | null>('get_setting', {
          key: 'preferred_mod_loader',
        })
        setSelectedLoaderState((value as ModLoaderType) || 'vanilla')
      } catch (error) {
        console.error('Failed to load mod loader preference:', error)
        setSelectedLoaderState('vanilla')
      } finally {
        setIsLoading(false)
      }
    }
    loadLoaderFromDb()
  }, [])

  const setSelectedLoader = async (id: ModLoaderType) => {
    setSelectedLoaderState(id)
    try {
      await invoke('set_setting', {
        key: 'preferred_mod_loader',
        value: id,
      })
    } catch (error) {
      console.error('Failed to save mod loader preference:', error)
    }
  }

  return {
    selectedLoader,
    setSelectedLoader,
    isLoading,
  }
}
