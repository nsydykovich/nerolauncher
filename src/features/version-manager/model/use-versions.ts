'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { MinecraftVersion } from '@/shared/types/minecraft'

interface UseVersionsReturn {
  versions: MinecraftVersion[]
  installedVersions: string[]
  isLoading: boolean
  isDownloading: boolean
  downloadProgress: number
  error: string | null
  fetchVersions: () => Promise<void>
  downloadVersion: (versionId: string, versionUrl: string) => Promise<void>
  deleteVersion: (versionId: string) => Promise<void>
  listInstalled: () => Promise<void>
}

interface DownloadedVersion {
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
  const [downloadProgress, setDownloadProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const fetchVersions = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await invoke<DownloadedVersion[]>('fetch_minecraft_versions')

      const mapped: MinecraftVersion[] = result.map((v) => ({
        id: v.id,
        version: v.version,
        type: v.type as 'release' | 'snapshot' | 'old_alpha' | 'old_beta',
        releaseTime: new Date(v.releaseTime).getTime(),
        installed: v.installed,
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
        setDownloadProgress(0)
        setError(null)

        await invoke('download_minecraft_version', {
          versionId,
          versionUrl,
        })

        setDownloadProgress(100)

        // Update versions list
        setVersions((prev) =>
          prev.map((v) => (v.id === versionId ? { ...v, installed: true } : v)),
        )

        // Refresh installed list
        await listInstalled()

        setTimeout(() => setIsDownloading(false), 1000)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        setIsDownloading(false)
        console.error('Download failed:', message)
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
    downloadProgress,
    error,
    fetchVersions,
    downloadVersion,
    deleteVersion,
    listInstalled,
  }
}
