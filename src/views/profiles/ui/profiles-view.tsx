'use client'

import * as React from 'react'
import { Plus, Upload, Download as DownloadIcon, Layers, Check, Download, Trash2, AlertCircle, FolderOpen } from 'lucide-react'
import { useVersions } from '@/features/version-manager'
import { useProfiles } from '@/features/profile-manager'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'
import type { MinecraftVersion } from '@/shared/types/minecraft'

// ── Types ──────────────────────────────────────────────────────────────────────

type ModLoader = 'vanilla' | 'forge' | 'neoforge' | 'fabric' | 'quilt'
type VersionFilter = 'release' | 'snapshot' | 'old'

// ── ProfilesView ──────────────────────────────────────────────────────────────

export function ProfilesView() {
  const { t } = useTranslation()
  const { profiles, isLoading: profilesLoading } = useProfiles()

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex-shrink-0 border-b border-border px-6 py-4'>
          <h1 className='text-2xl font-bold'>{t('profiles.title')}</h1>
          <p className='text-sm text-muted-foreground mt-1'>{t('profiles.description')}</p>
        </div>

        {/* Profiles list */}
        <div className='flex-1 overflow-y-auto p-6'>
          {profilesLoading ? (
            <div className='space-y-2'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-16 animate-pulse rounded-lg bg-muted/30' />
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-48 text-center'>
              <Layers className='h-10 w-10 text-muted-foreground/40 mb-3' />
              <p className='font-medium text-muted-foreground'>{t('profiles.empty')}</p>
              <p className='text-sm text-muted-foreground/60 mt-1'>{t('profiles.emptyDesc')}</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className='flex items-center gap-4 rounded-lg border border-border bg-card/50 px-4 py-3 hover:bg-card transition-colors cursor-pointer'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{profile.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {profile.gameVersion} · {profile.modLoader ?? 'vanilla'}
                    </p>
                  </div>
                  <Badge variant='outline' className='text-xs shrink-0'>
                    {profile.gameVersion}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Version downloader section */}
          <div className='mt-8'>
            <VersionDownloader />
          </div>
        </div>
      </div>

      {/* Aside */}
      <ProfilesAside />
    </div>
  )
}

// ── ProfilesAside ─────────────────────────────────────────────────────────────

function ProfilesAside() {
  const { t } = useTranslation()

  return (
    <aside className='w-56 shrink-0 border-l border-border bg-sidebar p-4 flex flex-col gap-2'>
      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1'>
        {t('profiles.title')}
      </p>

      <Button
        variant='default'
        size='sm'
        className='w-full justify-start gap-2'
      >
        <Plus className='h-4 w-4' />
        {t('profiles.create')}
      </Button>

      <Button
        variant='outline'
        size='sm'
        className='w-full justify-start gap-2'
      >
        <Upload className='h-4 w-4' />
        {t('profiles.import')}
      </Button>

      <Button
        variant='outline'
        size='sm'
        className='w-full justify-start gap-2'
      >
        <DownloadIcon className='h-4 w-4' />
        {t('profiles.export')}
      </Button>
    </aside>
  )
}

// ── VersionDownloader ─────────────────────────────────────────────────────────

function VersionDownloader() {
  const { t } = useTranslation()
  const {
    versions,
    isLoading,
    isDownloading,
    downloadProgress,
    error,
    fetchVersions,
    downloadVersion,
    deleteVersion,
  } = useVersions()

  const [selectedLoader, setSelectedLoader] = React.useState<ModLoader>('vanilla')
  const [activeFilter, setActiveFilter] = React.useState<VersionFilter>('release')
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)

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

  const handleDownload = async (version: MinecraftVersion) => {
    if (!version.url) return
    setDownloadingId(version.id)
    await downloadVersion(version.id, version.url)
    setDownloadingId(null)
  }

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold'>{t('profiles.versions')}</h3>
        <p className='text-sm text-muted-foreground'>{t('profiles.versionsDesc')}</p>
      </div>

      {/* Mod loader radio */}
      <div>
        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2'>
          {t('profiles.loader')}
        </p>
        <div className='flex flex-wrap gap-2'>
          {LOADERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedLoader(id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors',
                selectedLoader === id
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80',
              )}
            >
              {selectedLoader === id && <Check className='h-3 w-3' />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Version filter tabs */}
      <div className='flex gap-1 p-1 rounded-lg bg-muted/40 w-fit'>
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              activeFilter === id
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className='rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 flex items-start gap-2'>
          <AlertCircle className='h-4 w-4 text-destructive shrink-0 mt-0.5' />
          <div>
            <p className='text-sm font-medium text-destructive'>{t('common.error')}</p>
            <p className='text-xs text-destructive/80'>{error}</p>
          </div>
        </div>
      )}

      {/* Version list */}
      {isLoading ? (
        <div className='space-y-2'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-14 animate-pulse rounded-lg bg-muted/30' />
          ))}
        </div>
      ) : filteredVersions.length === 0 ? (
        <div className='py-8 text-center text-sm text-muted-foreground'>
          {t('profiles.noVersions')}
        </div>
      ) : (
        <div className='space-y-1.5'>
          {filteredVersions.slice(0, 20).map((version) => (
            <VersionRow
              key={version.id}
              version={version}
              isCurrentlyDownloading={downloadingId === version.id}
              downloadProgress={downloadingId === version.id ? downloadProgress : 0}
              isAnyDownloading={isDownloading}
              onDownload={handleDownload}
              onDelete={deleteVersion}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── VersionRow ────────────────────────────────────────────────────────────────

interface VersionRowProps {
  version: MinecraftVersion
  isCurrentlyDownloading: boolean
  downloadProgress: number
  isAnyDownloading: boolean
  onDownload: (v: MinecraftVersion) => void
  onDelete: (id: string) => void
}

function VersionRow({
  version,
  isCurrentlyDownloading,
  downloadProgress,
  isAnyDownloading,
  onDownload,
  onDelete,
}: VersionRowProps) {
  const { t } = useTranslation()
  const date = new Date(version.releaseTime).toLocaleDateString()

  return (
    <div className='relative flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 overflow-hidden'>
      {/* Progress bar background */}
      {isCurrentlyDownloading && downloadProgress > 0 && (
        <div
          className='absolute inset-0 bg-primary/8 transition-all duration-300 pointer-events-none'
          style={{ width: `${downloadProgress}%` }}
        />
      )}

      <div className='flex-1 min-w-0 relative'>
        <div className='flex items-center gap-2'>
          <span className='font-mono text-sm font-medium'>{version.version}</span>
          {version.installed && (
            <Badge variant='outline' className='text-xs text-green-600 border-green-600/30 bg-green-600/10 py-0'>
              <Check className='h-2.5 w-2.5 mr-1' />
              {t('profiles.installed')}
            </Badge>
          )}
          {isCurrentlyDownloading && (
            <span className='text-xs text-primary'>{downloadProgress}%</span>
          )}
        </div>
        <p className='text-xs text-muted-foreground mt-0.5'>{date}</p>
      </div>

      <div className='relative shrink-0'>
        {version.installed ? (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(version.id)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        ) : (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onDownload(version)}
            disabled={isAnyDownloading || !version.url}
            className='h-8 gap-1.5 text-xs'
          >
            <Download className='h-3 w-3' />
            {t('profiles.download')}
          </Button>
        )}
      </div>
    </div>
  )
}
