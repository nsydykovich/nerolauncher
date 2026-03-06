'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, Upload, Download as DownloadIcon, Layers, Play, Clock, Gamepad2 } from 'lucide-react'
import { useProfiles } from '@/features/instance-manager'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'

export function ProfilesView() {
  const { t } = useTranslation()
  const { profiles, isLoading: profilesLoading } = useProfiles()

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex-shrink-0 px-6 py-4'>
          <h1 className='text-2xl font-bold'>{t('profiles.title')}</h1>
          <p className='text-sm text-muted-foreground mt-1'>{t('profiles.description')}</p>
        </div>

        {/* Profiles list */}
        <div className='flex-1 overflow-y-auto px-6 pb-6'>
          {profilesLoading ? (
            <div className='grid gap-3 grid-cols-1 sm:grid-cols-2'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='h-24 animate-pulse rounded-xl bg-muted/30' />
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-center'>
              <div className='h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4'>
                <Gamepad2 className='h-8 w-8 text-muted-foreground/40' />
              </div>
              <p className='font-medium text-muted-foreground'>{t('profiles.empty')}</p>
              <p className='text-sm text-muted-foreground/60 mt-1 mb-4'>{t('profiles.emptyDesc')}</p>
              <Link href='/profiles/new'>
                <Button size='sm' className='gap-2'>
                  <Plus className='h-4 w-4' />
                  {t('profiles.create')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className='grid gap-3 grid-cols-1 sm:grid-cols-2'>
              {profiles.map((profile) => {
                const playtimeHrs = Math.floor(profile.playtime / 3600)
                const lastPlayedDate = profile.lastPlayed
                  ? new Date(profile.lastPlayed).toLocaleDateString()
                  : null

                return (
                  <div
                    key={profile.id}
                    className='group relative flex flex-col rounded-xl border border-border bg-card/50 p-4 hover:bg-card hover:shadow-sm transition-all cursor-pointer'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold truncate'>{profile.name}</p>
                        <p className='text-xs text-muted-foreground mt-0.5'>
                          {profile.gameVersion} · {profile.modLoader ?? 'vanilla'}
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary'
                      >
                        <Play className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='flex items-center gap-3 mt-auto pt-2 text-[11px] text-muted-foreground'>
                      {playtimeHrs > 0 && (
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {playtimeHrs}h
                        </span>
                      )}
                      {lastPlayedDate && (
                        <span>{lastPlayedDate}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Aside */}
      <aside className='w-52 shrink-0 border-l border-border/50 bg-sidebar/50 backdrop-blur-sm p-4 flex flex-col gap-2'>
        <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1'>
          {t('profiles.title')}
        </p>

        <Link href='/profiles/new'>
          <Button variant='default' size='sm' className='w-full justify-start gap-2'>
            <Plus className='h-4 w-4' />
            {t('profiles.create')}
          </Button>
        </Link>

        <Button variant='outline' size='sm' className='w-full justify-start gap-2'>
          <Upload className='h-4 w-4' />
          {t('profiles.import')}
        </Button>

        <Button variant='outline' size='sm' className='w-full justify-start gap-2'>
          <DownloadIcon className='h-4 w-4' />
          {t('profiles.export')}
        </Button>
      </aside>
    </div>
  )
}
