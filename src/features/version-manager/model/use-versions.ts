'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import type { MinecraftVersion } from '@/shared/types/minecraft'

interface DownloadProgress {
  version_id: string
  stage: string
  progress: number
  total_bytes: number
  downloaded_bytes: number
}

interface UseVersionsReturn {
  versions: MinecraftVersion[]
  installedVersions: string[]
  isLoading: boolean
  isDownloading: boolean
  downloadingVersionId: string | null
  downloadStage: string
  downloadProgress: number
  error: string | null
  fetchVersions: () => Promise<void>
  downloadVersion: (versionId: string, versionUrl: string) => Promise<void>
  deleteVersion: (versionId: string) => Promise<void>
  listInstalled: () => Promise<void>
}

interface RawVersion {
  id: string
  version: string
  type: string
  releaseTime: string
  url?: string
  installed: boolean
  size?: number
}

export function useVersions(): UseVersionsReturn {
  const [versions, setVersions] = React.useState<MinecraftVersion[]>([])
  const [installedVersions, setInstalledVersions] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [downloadingVersionId, setDownloadingVersionId] = React.useState<string | null>(null)
  const [downloadStage, setDownloadStage] = React.useState('')
  const [downloadProgress, setDownloadProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  // Listen for download progress events from Tauri
  React.useEffect(() => {
    let unlisten: (() => void) | undefined

    listen<DownloadProgress>('download-progress', (event) => {
      const { stage, progress } = event.payload
      setDownloadStage(stage)
      setDownloadProgress(progress)
    }).then((fn) => {
      unlisten = fn
    }).catch(() => {
      // Not in Tauri environment
    })

    return () => { unlisten?.() }
  }, [])

  const fetchVersions = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await invoke<RawVersion[]>('fetch_minecraft_versions')

      const mapped: MinecraftVersion[] = result.map((v) => ({
        id: v.id,
        version: v.version,
        type: v.type as MinecraftVersion['type'],
        releaseTime: new Date(v.releaseTime).getTime(),
        installed: v.installed,
        url: v.url,
        size: v.size,
      }))

      setVersions(mapped)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      console.error('Failed to fetch versions:', message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadVersion = React.useCallback(
    async (versionId: string, versionUrl: string) => {
      try {
        setIsDownloading(true)
        setDownloadingVersionId(versionId)
        setDownloadProgress(0)
        setDownloadStage('metadata')
        setError(null)

        await invoke('download_minecraft_version', {
          versionId,
          versionUrl,
        })

        // Mark as installed in local state
        setVersions((prev) =>
          prev.map((v) => (v.id === versionId ? { ...v, installed: true } : v)),
        )

        await listInstalled()
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        console.error('Download failed:', message)
      } finally {
        setIsDownloading(false)
        setDownloadingVersionId(null)
        setDownloadStage('')
        setDownloadProgress(0)
      }
    },
    [],
  )

  const listInstalled = React.useCallback(async () => {
    try {
      const installed = await invoke<string[]>('list_installed_versions')
      setInstalledVersions(installed)
    } catch (err) {
      console.error('Failed to list installed:', err)
    }
  }, [])

  const deleteVersion = React.useCallback(async (versionId: string) => {
    try {
      await invoke('delete_version', { versionId })

      setVersions((prev) =>
        prev.map((v) => (v.id === versionId ? { ...v, installed: false } : v)),
      )

      await listInstalled()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      console.error('Delete failed:', message)
    }
  }, [])

  return {
    versions,
    installedVersions,
    isLoading,
    isDownloading,
    downloadingVersionId,
    downloadStage,
    downloadProgress,
    error,
    fetchVersions,
    downloadVersion,
    deleteVersion,
    listInstalled,
  }
}
