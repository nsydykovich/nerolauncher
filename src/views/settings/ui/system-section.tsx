'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { useAppTheme } from '@/shared/ui/theme-provider'
import { Switch } from '@/shared/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'

export function SystemSection() {
    const { minimizeToTray, setMinimizeToTray } = useAppTheme()
    const { t } = useTranslation()
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold'>{t('system.title')}</h2>
            </div>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle className='text-sm'>{t('system.minimizeToTray')}</CardTitle>
                            <CardDescription>{t('system.minimizeToTrayDesc')}</CardDescription>
                        </div>
                        <Switch
                            checked={mounted ? minimizeToTray : false}
                            onCheckedChange={setMinimizeToTray}
                        />
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
