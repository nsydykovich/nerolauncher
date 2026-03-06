'use client'

import * as React from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/input'
import { useTranslation } from '@/shared/lib/i18n'

export function MinecraftSection() {
  const { t } = useTranslation()
  const [showConsole, setShowConsole] = React.useState(false)
  const [showErrorConsole, setShowErrorConsole] = React.useState(false)
  const [keepLauncherOpen, setKeepLauncherOpen] = React.useState(false)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold'>Minecraft Global Settings</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          These settings apply to all profiles unless overridden per-profile
        </p>
      </div>

      {/* Console Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>Console & Logging</CardTitle>
          <CardDescription>
            Control console visibility when launching games
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Eye className='h-4 w-4 text-muted-foreground' />
              <div>
                <Label className='text-sm font-medium'>Show Console</Label>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Display game console window during launch
                </p>
              </div>
            </div>
            <Switch checked={showConsole} onCheckedChange={setShowConsole} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='h-4 w-4 text-amber-500' />
              <div>
                <Label className='text-sm font-medium'>Show Error Console</Label>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Always show console if game crashes or has errors
                </p>
              </div>
            </div>
            <Switch checked={showErrorConsole} onCheckedChange={setShowErrorConsole} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <EyeOff className='h-4 w-4 text-muted-foreground' />
              <div>
                <Label className='text-sm font-medium'>Keep Launcher Open</Label>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Don't close launcher when game starts
                </p>
              </div>
            </div>
            <Switch checked={keepLauncherOpen} onCheckedChange={setKeepLauncherOpen} />
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <div className='rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3'>
        <p className='text-xs text-blue-600 dark:text-blue-400'>
          <strong>💡 Tip:</strong> You can override these settings per-profile in the Profiles section
        </p>
      </div>
    </div>
  )
}
