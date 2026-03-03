'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import {
  JAVA_VERSION_NUMBERS,
  JAVA_ACTIVE_VERSION_KEY,
  versionToSettingKey,
  type JavaVersionNumber,
  type JavaVersion,
} from '@/entities/java-version'

export function useJavaPaths() {
  const [versions, setVersions] = React.useState<JavaVersion[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Load all paths on mount
  React.useEffect(() => {
    const loadPathsFromDb = async () => {
      try {
        const allSettings = await invoke<Record<string, string>>('get_all_settings')

        const loadedVersions: JavaVersion[] = JAVA_VERSION_NUMBERS.map((versionNum) => ({
          javaVersion: versionNum,
          javaPath: allSettings[versionToSettingKey(versionNum)] || '',
          isActive: allSettings[JAVA_ACTIVE_VERSION_KEY] === String(versionNum),
        }))

        setVersions(loadedVersions)
      } catch (error) {
        console.error('Failed to load Java paths:', error)
        setVersions(
          JAVA_VERSION_NUMBERS.map((versionNum) => ({
            javaVersion: versionNum,
            javaPath: '',
            isActive: false,
          })),
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPathsFromDb()
  }, [])

  const setPath = async (version: JavaVersionNumber, path: string) => {
    setVersions((prev) =>
      prev.map((v) => (v.javaVersion === version ? { ...v, javaPath: path } : v)),
    )
    try {
      await invoke('set_setting', {
        key: versionToSettingKey(version),
        value: path,
      })
    } catch (error) {
      console.error(`Failed to save Java ${version} path:`, error)
    }
  }

  const setActive = async (version: JavaVersionNumber) => {
    setVersions((prev) =>
      prev.map((v) => ({
        ...v,
        isActive: v.javaVersion === version,
      })),
    )
    try {
      await invoke('set_setting', {
        key: JAVA_ACTIVE_VERSION_KEY,
        value: String(version),
      })
    } catch (error) {
      console.error(`Failed to set active Java version to ${version}:`, error)
    }
  }

  const browse = async (version: JavaVersionNumber) => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog')
      const selected = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            name: 'Java Executable',
            extensions: ['exe', 'bin', 'cmd'],
          },
        ],
      })
      if (typeof selected === 'string') {
        await setPath(version, selected)
      }
    } catch (error) {
      console.warn('Dialog plugin not available or cancelled:', error)
    }
  }

  return {
    versions,
    setPath,
    setActive,
    browse,
    isLoading,
  }
}
