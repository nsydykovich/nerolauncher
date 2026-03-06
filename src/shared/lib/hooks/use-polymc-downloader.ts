'use client'

import { useState, useCallback, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

export interface DownloadProgress {
  stage: string
  progress: number
  current?: number
  total?: number
  total_bytes?: number
  downloaded_bytes?: number
  file_name?: string
}

export function usePolymcDownloader() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState<DownloadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Listen for progress events
  useEffect(() => {
    let unlistenProgress: (() => void) | null = null
    let unlistenAsset: (() => void) | null = null
    let unlistenLib: (() => void) | null = null

    Promise.all([
      listen<DownloadProgress>('download-progress', (event) => {
        setProgress(event.payload)
      }),
      listen<any>('asset-downloaded', (event) => {
        console.log('Asset downloaded:', event.payload)
      }),
      listen<any>('library-downloaded', (event) => {
        console.log('Library downloaded:', event.payload)
      }),
    ]).then((listeners) => {
      unlistenProgress = listeners[0]
      unlistenAsset = listeners[1]
      unlistenLib = listeners[2]
    })

    return () => {
      if (unlistenProgress) unlistenProgress()
      if (unlistenAsset) unlistenAsset()
      if (unlistenLib) unlistenLib()
    }
  }, [])

  const downloadAssets = useCallback(async (versionId: string) => {
    setIsDownloading(true)
    setError(null)
    try {
      const result = (await invoke('download_assets_polymc', {
        version_id: versionId,
      })) as string
      console.log('Assets downloaded:', result)
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
      throw err
    } finally {
      setIsDownloading(false)
    }
  }, [])

  const downloadLibraries = useCallback(async (versionId: string) => {
    setIsDownloading(true)
    setError(null)
    try {
      const result = (await invoke('download_libraries_polymc', {
        version_id: versionId,
      })) as string
      console.log('Libraries downloaded:', result)
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
      throw err
    } finally {
      setIsDownloading(false)
    }
  }, [])

  const downloadAllResources = useCallback(
    async (versionId: string) => {
      try {
        setIsDownloading(true)
        setError(null)

        // Download assets
        console.log('Downloading assets...')
        await downloadAssets(versionId)

        // Download libraries
        console.log('Downloading libraries...')
        await downloadLibraries(versionId)

        return 'All resources downloaded successfully'
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(errorMsg)
        throw err
      } finally {
        setIsDownloading(false)
      }
    },
    [downloadAssets, downloadLibraries]
  )

  return {
    isDownloading,
    progress,
    error,
    downloadAssets,
    downloadLibraries,
    downloadAllResources,
  }
}
