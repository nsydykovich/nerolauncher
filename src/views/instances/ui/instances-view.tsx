'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, Play, Clock, Gamepad2, Trash2, Settings, Download as DownloadIcon } from 'lucide-react'
import { useInstances } from '@/features/instance-manager'
import { useLauncher } from '@/features/game-launcher/model/use-launcher'
import { useAuth } from '@/shared/lib/auth/auth-context'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import { useTranslation } from '@/shared/lib/i18n'

export function InstancesView() {
  const { t } = useTranslation()
  const { profiles: instances, isLoading, deleteInstance } = useInstances()
  const [selectedInstanceId, setSelectedInstanceId] = React.useState<string | null>(null)
  const [isLaunching, setIsLaunching] = React.useState(false)
  const { launch } = useLauncher()
  const { activeAccount } = useAuth()

  const selectedInstance = instances.find((i) => i.id === selectedInstanceId)

  const handlePlay = async () => {
    if (!selectedInstance || !activeAccount) return

    setIsLaunching(true)
    try {
      await launch({
        profileId: selectedInstance.id,
        gameVersion: selectedInstance.gameVersion,
        javaVersion: selectedInstance.javaVersion,
        gameDirStrategy: 'per-profile',
        username: activeAccount.username,
        uuid: activeAccount.uuid,
        accessToken: activeAccount.accessToken,
        javaArgs: selectedInstance.javaArgs,
      })
    } catch (error) {
      console.error('Launch failed:', error)
    } finally {
      setIsLaunching(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedInstance) return
    if (!confirm(`${t('instances.deleteConfirm')} "${selectedInstance.name}"?`)) return

    try {
      await deleteInstance(selectedInstance.id)
      setSelectedInstanceId(null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className='flex h-full overflow-hidden bg-background'>
      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex-shrink-0 px-6 py-4 border-b border-border/50'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>{t('instances.title')}</h1>
              <p className='text-sm text-muted-foreground mt-1'>{t('instances.description')}</p>
            </div>
            <Link href='/instances/new'>
              <Button className='gap-2'>
                <Plus className='h-4 w-4' />
                {t('instances.create')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Instances list */}
        <div className='flex-1 overflow-y-auto px-6 py-6'>
          {isLoading ? (
            <div className='space-y-3'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-20 animate-pulse rounded-lg bg-muted/30' />
              ))}
            </div>
          ) : instances.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-center'>
              <div className='h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4'>
                <Gamepad2 className='h-8 w-8 text-muted-foreground/40' />
              </div>
              <p className='font-medium text-muted-foreground'>{t('instances.empty')}</p>
              <p className='text-sm text-muted-foreground/60 mt-1 mb-4'>{t('instances.emptyDesc')}</p>
              <Link href='/instances/new'>
                <Button size='sm' className='gap-2'>
                  <Plus className='h-4 w-4' />
                  {t('instances.create')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {instances.map((instance) => {
                const isSelected = selectedInstanceId === instance.id
                const playtimeHrs = Math.floor(instance.playtime / 3600)
                const lastPlayedDate = instance.lastPlayed
                  ? new Date(instance.lastPlayed * 1000).toLocaleDateString()
                  : null

                return (
                  <Card
                    key={instance.id}
                    onClick={() => setSelectedInstanceId(instance.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/50 bg-card/50 hover:bg-card hover:border-border'
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold truncate'>{instance.name}</h3>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {instance.gameVersion} · {instance.modLoader ?? 'vanilla'} · Java {instance.javaVersion}
                        </p>
                        {(playtimeHrs > 0 || lastPlayedDate) && (
                          <div className='flex items-center gap-3 mt-2 text-xs text-muted-foreground'>
                            {playtimeHrs > 0 && (
                              <span className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                {playtimeHrs}h playtime
                              </span>
                            )}
                            {lastPlayedDate && (
                              <span>Last played: {lastPlayedDate}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Instance Details */}
      <aside className='w-72 shrink-0 border-l border-border/50 bg-sidebar/50 backdrop-blur-sm overflow-y-auto flex flex-col'>
        {selectedInstance ? (
          <div className='p-4 flex flex-col h-full'>
            {/* Instance Header */}
            <div className='mb-6'>
              <div className='text-4xl mb-3'>🎮</div>
              <h2 className='text-xl font-bold truncate'>{selectedInstance.name}</h2>
              <p className='text-sm text-muted-foreground mt-1'>{selectedInstance.gameVersion}</p>
            </div>

            {/* Instance Info */}
            <div className='space-y-4 mb-6 flex-1'>
              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase mb-2'>Game Settings</p>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Version</span>
                    <span className='font-medium'>{selectedInstance.gameVersion}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Mod Loader</span>
                    <span className='font-medium'>{selectedInstance.modLoader ?? 'Vanilla'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Java Version</span>
                    <span className='font-medium'>Java {selectedInstance.javaVersion}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase mb-2'>Statistics</p>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Playtime</span>
                    <span className='font-medium'>{Math.floor(selectedInstance.playtime / 3600)}h</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Last Played</span>
                    <span className='font-medium'>
                      {selectedInstance.lastPlayed
                        ? new Date(selectedInstance.lastPlayed * 1000).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedInstance.notes && (
                <>
                  <Separator />
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase mb-2'>Notes</p>
                    <p className='text-sm text-muted-foreground'>{selectedInstance.notes}</p>
                  </div>
                </>
              )}
            </div>

            <Separator className='mb-4' />

            {/* Action Buttons */}
            <div className='space-y-2'>
              <Button
                size='sm'
                className='w-full justify-start gap-2'
                onClick={handlePlay}
                disabled={isLaunching}
              >
                <Play className='h-4 w-4' />
                {isLaunching ? 'Launching...' : 'Play Now'}
              </Button>

              <Link href={`/instances/edit?id=${selectedInstance.id}`} className='w-full'>
                <Button variant='outline' size='sm' className='w-full justify-start gap-2'>
                  <Settings className='h-4 w-4' />
                  Edit Settings
                </Button>
              </Link>

              <Button
                variant='outline'
                size='sm'
                className='w-full justify-start gap-2 text-destructive hover:text-destructive'
                onClick={handleDelete}
              >
                <Trash2 className='h-4 w-4' />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className='p-4 flex flex-col items-center justify-center h-full text-center'>
            <Gamepad2 className='h-12 w-12 text-muted-foreground/30 mb-3' />
            <p className='text-sm font-medium text-muted-foreground'>No instance selected</p>
            <p className='text-xs text-muted-foreground/60 mt-1'>Click an instance to view details</p>
          </div>
        )}
      </aside>
    </div>
  )
}
