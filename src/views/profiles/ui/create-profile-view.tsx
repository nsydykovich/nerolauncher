'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Download, Trash2, AlertCircle } from 'lucide-react'
import { useVersions } from '@/features/version-manager'
import { useProfiles } from '@/features/profile-manager'
import { Button } from '@/shared/ui/button'
import { Input, Label } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'
import type { MinecraftVersion } from '@/shared/types/minecraft'

type ModLoader = 'vanilla' | 'forge' | 'neoforge' | 'fabric' | 'quilt'
type VersionFilter = 'release' | 'snapshot' | 'old'

export function CreateProfileView() {
  const { t } = useTranslation()
  const router = useRouter()
  const { createProfile } = useProfiles()
  const {
    versions,
    isLoading: versionsLoading,
    isDownloading,
    downloadingVersionId,
    downloadStage,
    downloadProgress,
    error: versionsError,
    fetchVersions,
    downloadVersion,
    deleteVersion,
  } = useVersions()

  const [profileName, setProfileName] = React.useState('')
  const [selectedVersion, setSelectedVersion] = React.useState<string | null>(null)
  const [selectedLoader, setSelectedLoader] = React.useState<ModLoader>('vanilla')
  const [activeFilter, setActiveFilter] = React.useState<VersionFilter>('release')
  const [isCreating, setIsCreating] = React.useState(false)

  React.useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  const LOADERS: { id: ModLoader; label: string }[] = [
    { id: 'vanilla',  label: t('profiles.loaderVanilla')  },
    { id: 'forge',    label: t('profiles.loaderForge')    },
    { id: 'neoforge', label: t('profiles.loaderNeoForge') },
    { id: 'fabric',   label: t('profiles.loaderFabric')   },
    { id: 'quilt',    label: t('profiles.loaderQuilt')    },
  ]

  const FILTERS: { id: VersionFilter; label: string }[] = [
    { id: 'release',  label: t('profiles.filterRelease')  },
    { id: 'snapshot', label: t('profiles.filterSnapshot') },
    { id: 'old',      label: t('profiles.filterOld')      },
  ]

  const filteredVersions = versions.filter((v) => {
    if (activeFilter === 'release')  return v.type === 'release'
    if (activeFilter === 'snapshot') return v.type === 'snapshot'
    if (activeFilter === 'old')      return v.type === 'old_alpha' || v.type === 'old_beta'
    return true
  })

  const handleCreate = async () => {
    if (!profileName.trim() || !selectedVersion) return
    setIsCreating(true)
    try {
      await createProfile({
        name: profileName.trim(),
        gameVersion: selectedVersion,
      })
      router.push('/profiles')
    } catch (err) {
      console.error('Failed to create profile:', err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDownload = async (version: MinecraftVersion) => {
    if (!version.url) return
    await downloadVersion(version.id, version.url)
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Header */}
      <div className='flex-shrink-0 flex items-center gap-3 px-6 py-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.push('/profiles')}
          className='h-8 w-8 p-0'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-xl font-bold'>{t('profiles.create')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto px-6 pb-6'>
        <div className='max-w-3xl space-y-6'>

          {/* Profile name */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>{t('profiles.profileName')}</Label>
            <Input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={t('profiles.profileNamePlaceholder')}
              className='bg-card/50'
            />
          </div>

          {/* Mod loader radio */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              {t('profiles.loader')}
            </Label>
            <div className='flex flex-wrap gap-2'>
              {LOADERS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedLoader(id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm transition-all',
                    selectedLoader === id
                      ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm'
                      : 'border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card',
                  )}
                >
                  {selectedLoader === id && <Check className='h-3 w-3' />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Version selection */}
          <div className='space-y-3'>
            <div className='flex items-end justify-between'>
              <Label className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                {t('profiles.versions')}
              </Label>
              <div className='flex gap-0.5 p-0.5 rounded-lg bg-muted/40'>
                {FILTERS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveFilter(id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      activeFilter === id
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {versionsError && (
              <div className='rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 flex items-start gap-2'>
                <AlertCircle className='h-4 w-4 text-destructive shrink-0 mt-0.5' />
                <p className='text-xs text-destructive/80'>{versionsError}</p>
              </div>
            )}

            {versionsLoading ? (
              <div className='space-y-1.5'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='h-12 animate-pulse rounded-lg bg-muted/30' />
                ))}
              </div>
            ) : (
              <div className='space-y-1 max-h-[340px] overflow-y-auto rounded-lg border border-border p-1'>
                {filteredVersions.slice(0, 30).map((version) => {
                  const isSelected = selectedVersion === version.id
                  const date = new Date(version.releaseTime).toLocaleDateString()
                  const isThisDownloading = downloadingVersionId === version.id

                  return (
                    <div
                      key={version.id}
                      onClick={() => version.installed && setSelectedVersion(version.id)}
                      className={cn(
                        'relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-all overflow-hidden',
                        version.installed
                          ? 'cursor-pointer'
                          : 'cursor-default opacity-70',
                        isSelected
                          ? 'bg-primary/10 ring-1 ring-primary/30'
                          : version.installed
                            ? 'hover:bg-foreground/5'
                            : '',
                      )}
                    >
                      {/* Progress fill */}
                      {isThisDownloading && (
                        <div
                          className='absolute inset-0 bg-primary/8 transition-all duration-300 pointer-events-none'
                          style={{ width: `${downloadProgress}%` }}
                        />
                      )}

                      {/* Selection circle */}
                      <div className={cn(
                        'relative h-4 w-4 shrink-0 rounded-full border-2 transition-colors',
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30',
                      )}>
                        {isSelected && (
                          <Check className='h-2.5 w-2.5 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                        )}
                      </div>

                      <div className='flex-1 min-w-0 relative'>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono text-sm font-medium'>{version.version}</span>
                          {version.installed && (
                            <Badge variant='outline' className='text-[10px] text-green-600 border-green-600/30 bg-green-600/10 py-0 px-1.5'>
                              {t('profiles.installed')}
                            </Badge>
                          )}
                          {isThisDownloading && (
                            <span className='text-xs text-primary'>{downloadStage} {downloadProgress > 0 ? `${Math.round(downloadProgress)}%` : ''}</span>
                          )}
                        </div>
                        <p className='text-[11px] text-muted-foreground'>{date}</p>
                      </div>

                      <div className='relative shrink-0' onClick={(e) => e.stopPropagation()}>
                        {version.installed ? (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => deleteVersion(version.id)}
                            className='h-7 w-7 p-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10'
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        ) : (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDownload(version)}
                            disabled={isDownloading || !version.url}
                            className='h-7 gap-1 text-[11px] px-2'
                          >
                            <Download className='h-3 w-3' />
                            {t('profiles.download')}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Create button */}
          <div className='flex justify-end pt-2'>
            <Button
              onClick={handleCreate}
              disabled={!profileName.trim() || !selectedVersion || isCreating}
              className='px-6'
            >
              {isCreating ? t('common.loading') : t('profiles.create')}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
