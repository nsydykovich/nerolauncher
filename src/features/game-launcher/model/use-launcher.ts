'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { GameDirStrategy } from '@/shared/types/minecraft'

interface LaunchOptions {
  profileId: string
  gameVersion: string
  javaVersion: number
  gameDirStrategy: GameDirStrategy
  javaArgs?: string
  extraArgs?: string
}

interface UseLauncherReturn {
  isLaunching: boolean
  error: string | null
  pid: number | null
  launch: (options: LaunchOptions) => Promise<void>
  getGameDir: (profileId: string, strategy: GameDirStrategy) => Promise<string>
}

export function useLauncher(): UseLauncherReturn {
  const [isLaunching, setIsLaunching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pid, setPid] = React.useState<number | null>(null)

  const launch = React.useCallback(async (options: LaunchOptions) => {
    try {
      setIsLaunching(true)
      setError(null)

      const launchPid = await invoke<number>('launch_game', {
        profileId: options.profileId,
        gameVersion: options.gameVersion,
        javaVersion: options.javaVersion,
        gameDirStrategy: options.gameDirStrategy,
        javaArgs: options.javaArgs,
        extraArgs: options.extraArgs,
      })

      setPid(launchPid)

      // Reset after some time
      setTimeout(() => {
        setIsLaunching(false)
        setPid(null)
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      setIsLaunching(false)
      console.error('Launch failed:', message)
    }
  }, [])

  const getGameDir = React.useCallback(
    async (profileId: string, strategy: GameDirStrategy): Promise<string> => {
      try {
        return await invoke<string>('get_game_dir', {
          profileId,
          strategy,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('Failed to get game dir:', message)
        throw new Error(message)
      }
    },
    [],
  )

  return {
    isLaunching,
    error,
    pid,
    launch,
    getGameDir,
  }
}
