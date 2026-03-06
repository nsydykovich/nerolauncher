'use client'

import * as React from 'react'
import { Plus, Trash2, Settings } from 'lucide-react'
import { useProfiles } from '../model/use-profiles'
import { ProfileCard } from '@/entities/profile'
import { Button } from '@/shared/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import type { CreateProfileRequest } from '@/entities/profile'

interface ProfileSelectorProps {
  onSelectProfile?: (profileId: string) => void
  selectedProfileId?: string
}

export function ProfileSelector({
  onSelectProfile,
  selectedProfileId,
}: ProfileSelectorProps) {
  const { profiles, isLoading, error, createProfile, deleteProfile } = useProfiles()
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    gameVersion: '1.21',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      await createProfile({
        name: formData.name,
        gameVersion: formData.gameVersion,
      })
      setFormData({ name: '', gameVersion: '1.21' })
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create profile:', err)
    }
  }

  const handleDelete = async (profileId: string) => {
    if (confirm('Delete this profile?')) {
      try {
        await deleteProfile(profileId)
      } catch (err) {
        console.error('Failed to delete profile:', err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-32 animate-pulse rounded-lg border border-border bg-muted/30'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Create form */}
      {showCreateForm && (
        <Card className='border-primary/50'>
          <CardHeader>
            <CardTitle className='text-sm'>New Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className='space-y-3'>
              <div>
                <label className='text-sm font-medium block mb-1.5'>Name</label>
                <Input
                  placeholder='e.g. Survival World'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  autoFocus
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-1.5'>Minecraft Version</label>
                <Input
                  placeholder='e.g. 1.21'
                  value={formData.gameVersion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gameVersion: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='flex gap-2'>
                <Button
                  type='submit'
                  size='sm'
                  disabled={!formData.name.trim()}
                >
                  Create
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Create button */}
      {!showCreateForm && (
        <Button
          onClick={() => setShowCreateForm(true)}
          variant='outline'
          size='sm'
          className='w-full'
        >
          <Plus className='h-4 w-4 mr-2' />
          New Profile
        </Button>
      )}

      {/* Error message */}
      {error && (
        <div className='rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive'>
          {error}
        </div>
      )}

      {/* Profiles list */}
      {profiles.length === 0 ? (
        <div className='rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center'>
          <p className='text-sm text-muted-foreground'>No profiles yet</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Create one to get started
          </p>
        </div>
      ) : (
        <div className='grid gap-2'>
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isSelected={selectedProfileId === profile.id}
              onClick={() => onSelectProfile?.(profile.id)}
              onDelete={() => handleDelete(profile.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
