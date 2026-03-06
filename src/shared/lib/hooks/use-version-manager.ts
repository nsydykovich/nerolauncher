import { useState, useCallback, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

export interface MinecraftVersion {
  id: string
  version: string
  type: string
  release_time: string
  url?: string
  installed: boolean
  size?: number
}

export interface DownloadProgress {
  version_id: string
  stage: string
  progress: number
  total_bytes: number
  downloaded_bytes: number
}

export function useVersionManager() {
  const [versions, setVersions] = useState<MinecraftVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Listen for download progress events
  useEffect(() => {
    let unlisten: (() => void) | null = null

    listen<DownloadProgress>('download-progress', (event) => {
      setDownloadProgress(event.payload)
    })
      .then((fn) => {
        unlisten = fn
      })
      .catch((err) => console.error('Failed to listen for progress:', err))

    return () => {
      if (unlisten) unlisten()
    }
  }, [])

  const fetchVersions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = (await invoke('fetch_minecraft_versions')) as MinecraftVersion[]
      setVersions(result)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadVersion = useCallback(
    async (versionId: string, versionUrl: string) => {
      setError(null)
      try {
        await invoke('download_minecraft_version', {
          version_id: versionId,
          version_url: versionUrl,
        })
        // Refresh versions list
        await fetchVersions()
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(errorMsg)
        throw err
      }
    },
    [fetchVersions]
  )

  const deleteVersion = useCallback(async (versionId: string) => {
    setError(null)
    try {
      await invoke('delete_version', { version_id: versionId })
      // Refresh versions list
      await fetchVersions()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
      throw err
    }
  }, [fetchVersions])

  const isVersionInstalled = useCallback(async (versionId: string) => {
    try {
      return (await invoke('is_version_installed', {
        version_id: versionId,
      })) as boolean
    } catch {
      return false
    }
  }, [])

  const listInstalledVersions = useCallback(async () => {
    try {
      return (await invoke('list_installed_versions')) as string[]
    } catch {
      return []
    }
  }, [])

  return {
    versions,
    isLoading,
    downloadProgress,
    error,
    fetchVersions,
    downloadVersion,
    deleteVersion,
    isVersionInstalled,
    listInstalledVersions,
  }
}
