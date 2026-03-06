'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useInstances } from '@/features/instance-manager'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Separator } from '@/shared/ui/separator'
import { Card } from '@/shared/ui/card'
import { useTranslation } from '@/shared/lib/i18n'

const MOD_LOADERS = ['vanilla', 'forge', 'fabric', 'neoforge', 'quilt']
const JAVA_VERSIONS = [8, 11, 17, 21]

interface InstanceEditViewProps {
  instanceId: string
}

export function InstanceEditView({ instanceId }: InstanceEditViewProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { profiles: instances, getInstance, updateInstance, deleteInstance, isLoading } = useInstances()

  const instance = instances.find((i) => i.id === instanceId)
  const [isSaving, setIsSaving] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    gameVersion: '',
    modLoader: 'vanilla',
    javaVersion: 17,
    javaArgs: '',
    notes: '',
  })

  React.useEffect(() => {
    if (instance) {
      setFormData({
        name: instance.name,
        gameVersion: instance.gameVersion,
        modLoader: instance.modLoader || 'vanilla',
        javaVersion: instance.javaVersion,
        javaArgs: instance.javaArgs || '',
        notes: instance.notes || '',
      })
    }
  }, [instance])

  const handleSave = async () => {
    if (!instance) return

    setIsSaving(true)
    try {
      await updateInstance(instance.id, {
        name: formData.name,
        gameVersion: formData.gameVersion,
        modLoader: formData.modLoader,
        javaVersion: formData.javaVersion,
        javaArgs: formData.javaArgs || undefined,
        notes: formData.notes || undefined,
      })
      router.back()
    } catch (error) {
      console.error('Failed to save instance:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!instance) return
    if (!confirm(`${t('instances.deleteConfirm')} "${instance.name}"?`)) return

    setIsSaving(true)
    try {
      await deleteInstance(instance.id)
      router.push('/instances')
    } catch (error) {
      console.error('Failed to delete instance:', error)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border border-primary border-t-transparent mx-auto mb-4' />
          <p className='text-sm text-muted-foreground'>Loading instance...</p>
        </div>
      </div>
    )
  }

  if (!instance) {
    return (
      <div className='flex h-full items-center justify-center flex-col gap-4'>
        <p className='text-muted-foreground'>Instance not found</p>
        <Button variant='outline' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Go back
        </Button>
      </div>
    )
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* Header */}
      <div className='flex-shrink-0 border-b border-border/50 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.back()}
              className='gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>{instance.name}</h1>
              <p className='text-sm text-muted-foreground mt-1'>Edit instance settings and configuration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className='max-w-2xl mx-auto space-y-6'>
          {/* Basic Settings */}
          <Card className='p-6'>
            <h2 className='text-lg font-semibold mb-4'>Basic Settings</h2>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>Instance Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='My awesome instance…'
                  className='mt-1'
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Game Version</label>
                <Input
                  value={formData.gameVersion}
                  onChange={(e) => setFormData({ ...formData, gameVersion: e.target.value })}
                  placeholder='1.20.1'
                  className='mt-1'
                  disabled
                />
                <p className='text-xs text-muted-foreground mt-1'>Game version cannot be changed. Create a new instance to use a different version.</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Mod Loader</label>
                  <Select
                    value={formData.modLoader}
                    onChange={(e) => setFormData({ ...formData, modLoader: e.target.value })}
                  >
                    {MOD_LOADERS.map((loader) => (
                      <option key={loader} value={loader}>
                        {loader.charAt(0).toUpperCase() + loader.slice(1)}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium'>Java Version</label>
                  <Select
                    value={formData.javaVersion.toString()}
                    onChange={(e) => setFormData({ ...formData, javaVersion: Number(e.target.value) })}
                  >
                    {JAVA_VERSIONS.map((version) => (
                      <option key={version} value={version}>
                        Java {version}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Java Settings */}
          <Card className='p-6'>
            <h2 className='text-lg font-semibold mb-4'>Java Configuration</h2>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>JVM Arguments</label>
                <textarea
                  value={formData.javaArgs}
                  onChange={(e) => setFormData({ ...formData, javaArgs: e.target.value })}
                  placeholder='-XX:+SomeFlag -Dsomething=value'
                  className='w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
                  rows={3}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Custom JVM arguments for this instance. Default memory settings (-Xms512M -Xmx2048M) are always applied.
                </p>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className='p-6'>
            <h2 className='text-lg font-semibold mb-4'>Notes</h2>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>Instance Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder='Add notes about this instance…'
                  className='w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card className='p-6 bg-muted/30'>
            <h2 className='text-lg font-semibold mb-4'>Statistics</h2>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Playtime</p>
                <p className='text-lg font-semibold mt-1'>{Math.floor(instance.playtime / 3600)}h</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Last Played</p>
                <p className='text-lg font-semibold mt-1'>
                  {instance.lastPlayed
                    ? new Date(instance.lastPlayed * 1000).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Created</p>
                <p className='text-lg font-semibold mt-1'>
                  {instance.createdAt
                    ? new Date(instance.createdAt * 1000).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer - Action Buttons */}
      <div className='flex-shrink-0 border-t border-border/50 bg-background px-6 py-4'>
        <div className='flex items-center justify-between max-w-2xl mx-auto'>
          <Button
            variant='destructive'
            size='sm'
            onClick={handleDelete}
            disabled={isSaving}
            className='gap-2'
          >
            <Trash2 className='h-4 w-4' />
            Delete Instance
          </Button>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size='sm'
              onClick={handleSave}
              disabled={isSaving}
              className='gap-2'
            >
              <Save className='h-4 w-4' />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
