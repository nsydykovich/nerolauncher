import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'

export interface LaunchProgress {
  stage: string
  progress: number
  total_bytes: number
  downloaded_bytes: number
}

export interface LaunchResult {
  pid: number
  success: boolean
  error?: string
}

export function useLauncher() {
  const [isLaunching, setIsLaunching] = useState(false)
  const [progress, setProgress] = useState<LaunchProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const launchGame = useCallback(
    async (
      profileId: string,
      gameVersion: string,
      javaVersion: number,
      gameDirStrategy: string,
      username: string,
      uuid: string,
      accessToken: string,
      javaArgs?: string,
      extraArgs?: string
    ): Promise<LaunchResult> => {
      setIsLaunching(true)
      setError(null)

      try {
        // Trigger download of assets and libraries if needed
        console.log('Downloading assets and libraries...')
        await invoke('download_assets', {
          versionId: gameVersion,
          assetIndexId: gameVersion, // simplified — should come from version.json
        }).catch((e) => {
          console.warn('Asset download warning:', e)
        })

        await invoke('download_libraries', {
          versionId: gameVersion,
        }).catch((e) => {
          console.warn('Library download warning:', e)
        })

        await invoke('download_natives', {
          versionId: gameVersion,
        }).catch((e) => {
          console.warn('Native download warning:', e)
        })

        // Launch the game
        const pid = (await invoke('launch_game', {
          profile_id: profileId,
          game_version: gameVersion,
          java_version: javaVersion,
          game_dir_strategy: gameDirStrategy,
          java_args: javaArgs,
          extra_args: extraArgs,
          username,
          uuid,
          access_token: accessToken,
        })) as number

        setIsLaunching(false)
        return { pid, success: true }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(errorMsg)
        setIsLaunching(false)
        return { pid: 0, success: false, error: errorMsg }
      }
    },
    []
  )

  const verifyVersion = useCallback(
    async (versionId: string, gameDir: string) => {
      try {
        const result = await invoke('verify_version', {
          version_id: versionId,
          game_dir: gameDir,
        })
        return result
      } catch (err) {
        console.error('Verification error:', err)
        throw err
      }
    },
    []
  )

  return {
    launchGame,
    verifyVersion,
    isLaunching,
    progress,
    error,
  }
}
