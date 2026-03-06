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
        <h2 className='text-2xl font-semibold'>{t('minecraft.title')}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>{t('minecraft.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>{t('minecraft.console')}</CardTitle>
          <CardDescription>{t('minecraft.consoleDesc')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Eye className='h-4 w-4 text-muted-foreground' />
              <div>
                <Label className='text-sm font-medium'>{t('minecraft.showConsole')}</Label>
                <p className='text-xs text-muted-foreground mt-0.5'>{t('minecraft.showConsoleDesc')}</p>
              </div>
            </div>
            <Switch checked={showConsole} onCheckedChange={setShowConsole} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='h-4 w-4 text-amber-500' />
              <div>
                <Label className='text-sm font-medium'>{t('minecraft.showErrorConsole')}</Label>
                <p className='text-xs text-muted-foreground mt-0.5'>{t('minecraft.showErrorConsoleDesc')}</p>
              </div>
            </div>
            <Switch checked={showErrorConsole} onCheckedChange={setShowErrorConsole} />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <EyeOff className='h-4 w-4 text-muted-foreground' />
              <div>
                <Label className='text-sm font-medium'>{t('minecraft.keepLauncher')}</Label>
                <p className='text-xs text-muted-foreground mt-0.5'>{t('minecraft.keepLauncherDesc')}</p>
              </div>
            </div>
            <Switch checked={keepLauncherOpen} onCheckedChange={setKeepLauncherOpen} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
