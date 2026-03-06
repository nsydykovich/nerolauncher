'use client'

import * as React from 'react'
import { Download, Trash2, Check, AlertCircle } from 'lucide-react'
import { useVersions } from '@/features/version-manager'
import { GameDirStrategy } from '@/features/minecraft-settings'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { useTranslation } from '@/shared/lib/i18n'
import { cn } from '@/shared/lib/utils'
import type { GameDirStrategy as GameDirStrategyType } from '@/shared/types/minecraft'

export function MinecraftAdvancedSection() {
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
  const [gameDirStrategy, setGameDirStrategy] = React.useState<GameDirStrategyType>('per-profile')

  React.useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  const releaseVersions = versions.filter((v) => v.type === 'release')
  const snapshotVersions = versions.filter((v) => v.type === 'snapshot')

  return (
    <div className='space-y-6'>
      {/* Game Directory Strategy */}
      <div>
        <h3 className='text-lg font-semibold mb-4'>Game Directory Settings</h3>
        <GameDirStrategy value={gameDirStrategy} onChange={setGameDirStrategy} />
      </div>

      {/* Version Downloader */}
      <div>
        <h3 className='text-lg font-semibold mb-4'>Minecraft Versions</h3>

        {error && (
          <div className='rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 mb-4 flex items-start gap-2'>
            <AlertCircle className='h-5 w-5 text-destructive shrink-0 mt-0.5' />
            <div>
              <p className='text-sm font-medium text-destructive'>Error</p>
              <p className='text-xs text-destructive/80'>{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className='space-y-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-20 animate-pulse rounded-lg bg-muted/30' />
            ))}
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Release Versions */}
            <div>
              <h4 className='text-sm font-semibold mb-3'>Release Versions</h4>
              <div className='grid gap-2'>
                {releaseVersions.slice(0, 15).map((version) => (
                  <VersionCard
                    key={version.id}
                    version={version}
                    onDownload={downloadVersion}
                    onDelete={deleteVersion}
                    isDownloading={isDownloading && downloadProgress > 0}
                    downloadProgress={downloadProgress}
                  />
                ))}
              </div>
            </div>

            {/* Snapshot Versions */}
            {snapshotVersions.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold mb-3'>Snapshot Versions</h4>
                <div className='grid gap-2'>
                  {snapshotVersions.slice(0, 10).map((version) => (
                    <VersionCard
                      key={version.id}
                      version={version}
                      onDownload={downloadVersion}
                      onDelete={deleteVersion}
                      isDownloading={isDownloading}
                      downloadProgress={downloadProgress}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface VersionCardProps {
  version: {
    id: string
    version: string
    type: string
    releaseTime: number
    installed: boolean
  }
  onDownload: (versionId: string, versionUrl: string) => Promise<void>
  onDelete: (versionId: string) => Promise<void>
  isDownloading: boolean
  downloadProgress: number
}

function VersionCard({
  version,
  onDownload,
  onDelete,
  isDownloading,
  downloadProgress,
}: VersionCardProps) {
  const date = new Date(version.releaseTime).toLocaleDateString()

  return (
    <div className='rounded-lg border border-border bg-card p-4 flex items-center justify-between gap-4'>
      <div className='flex-1'>
        <div className='flex items-center gap-2 mb-1'>
          <p className='font-mono text-sm font-medium'>{version.version}</p>
          <Badge variant={version.type === 'snapshot' ? 'secondary' : 'default'} className='text-xs'>
            {version.type}
          </Badge>
          {version.installed && (
            <Badge className='bg-green-600'>
              <Check className='h-3 w-3 mr-1' />
              Installed
            </Badge>
          )}
        </div>
        <p className='text-xs text-muted-foreground'>{date}</p>
      </div>

      <div className='flex items-center gap-2'>
        {version.installed ? (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(version.id)}
            className='text-destructive hover:text-destructive hover:bg-destructive/10'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        ) : (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onDownload(version.id, `https://launcher.mojang.com/v1/objects/${version.id}/client.json`)}
            disabled={isDownloading}
          >
            <Download className='h-4 w-4 mr-2' />
            Download
          </Button>
        )}
      </div>

      {isDownloading && downloadProgress > 0 && (
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg'>
          <div
            className='h-full bg-primary rounded-b-lg transition-all duration-300'
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}
    </div>
  )
}
