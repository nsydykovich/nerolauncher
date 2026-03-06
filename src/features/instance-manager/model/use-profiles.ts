'use client'

import * as React from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Profile, CreateProfileRequest, UpdateProfileRequest } from '@/entities/profile'

interface UseProfilesReturn {
  profiles: Profile[]
  isLoading: boolean
  error: string | null
  createProfile: (req: CreateProfileRequest) => Promise<Profile>
  getProfile: (id: string) => Promise<Profile | null>
  updateProfile: (id: string, req: UpdateProfileRequest) => Promise<void>
  deleteProfile: (id: string) => Promise<void>
  updateLastPlayed: (id: string) => Promise<void>
  addPlaytime: (id: string, seconds: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useProfiles(): UseProfilesReturn {
  const [profiles, setProfiles] = React.useState<Profile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchProfiles = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await invoke<Profile[]>('list_profiles')
      setProfiles(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      console.error('Failed to fetch profiles:', message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const createProfile = React.useCallback(
    async (req: CreateProfileRequest): Promise<Profile> => {
      try {
        const profile = await invoke<Profile>('create_profile', { req })
        setProfiles((prev) => [profile, ...prev])
        return profile
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        throw new Error(message)
      }
    },
    [],
  )

  const getProfile = React.useCallback(
    async (id: string): Promise<Profile | null> => {
      try {
        return await invoke<Profile | null>('get_profile', { id })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        return null
      }
    },
    [],
  )

  const updateProfile = React.useCallback(
    async (id: string, req: UpdateProfileRequest): Promise<void> => {
      try {
        await invoke<void>('update_profile', { id, req })
        // Fetch fresh profile after update to ensure type consistency
        const updated = await invoke<Profile | null>('get_profile', { id })
        if (updated) {
          setProfiles((prev) =>
            prev.map((p) => (p.id === id ? updated : p)),
          )
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        throw new Error(message)
      }
    },
    [],
  )

  const deleteProfile = React.useCallback(
    async (id: string): Promise<void> => {
      try {
        await invoke<void>('delete_profile', { id })
        setProfiles((prev) => prev.filter((p) => p.id !== id))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
        throw new Error(message)
      }
    },
    [],
  )

  const updateLastPlayed = React.useCallback(
    async (id: string): Promise<void> => {
      try {
        await invoke<void>('update_last_played', { id })
        const now = Math.floor(Date.now() / 1000)
        setProfiles((prev) =>
          prev.map((p) => (p.id === id ? { ...p, lastPlayed: now } : p)),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('Failed to update last played:', message)
      }
    },
    [],
  )

  const addPlaytime = React.useCallback(
    async (id: string, seconds: number): Promise<void> => {
      try {
        await invoke<void>('add_playtime', { id, seconds })
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, playtime: p.playtime + seconds } : p,
          ),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('Failed to add playtime:', message)
      }
    },
    [],
  )

  return {
    profiles,
    isLoading,
    error,
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    updateLastPlayed,
    addPlaytime,
    refetch: fetchProfiles,
  }
}
