'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useTranslation } from '@/shared/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ColorModeTab() {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    const { theme, setTheme } = useTheme()
    const { t } = useTranslation()

    const modes = [
        { id: 'light',  label: t('appearance.colorMode.light'),  icon: Sun     },
        { id: 'dark',   label: t('appearance.colorMode.dark'),   icon: Moon    },
        { id: 'system', label: t('appearance.colorMode.system'), icon: Monitor },
    ] as const

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-base font-semibold'>{t('appearance.colorMode.title')}</h3>
                <p className='text-sm text-muted-foreground'>{t('appearance.colorMode.description')}</p>
            </div>

            <div className='grid grid-cols-3 gap-3'>
                {modes.map(({ id, label, icon: Icon }) => {
                    const active = mounted && theme === id
                    return (
                        <button
                            key={id}
                            onClick={() => setTheme(id)}
                            className={cn(
                                'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                                active
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40 hover:bg-accent/30',
                            )}
                        >
                            <div className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-full border-2',
                                active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted',
                            )}>
                                <Icon className='h-5 w-5' />
                            </div>
                            <span className={cn('text-sm font-medium', active && 'text-primary')}>
                                {label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Preview */}
            <Card variant='outline'>
                <CardHeader>
                    <CardTitle className='text-sm'>Preview</CardTitle>
                    <CardDescription>
                        {mounted ? `Current mode: ${theme}` : '…'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 gap-3'>
                        {/* Light preview */}
                        <div className='rounded-lg border border-border bg-white p-3 text-slate-900'>
                            <div className='mb-2 h-2 w-16 rounded-full bg-slate-200' />
                            <div className='mb-1 h-2 w-24 rounded-full bg-slate-100' />
                            <div className='h-2 w-20 rounded-full bg-slate-100' />
                        </div>
                        {/* Dark preview */}
                        <div className='rounded-lg border border-slate-700 bg-slate-900 p-3 text-white'>
                            <div className='mb-2 h-2 w-16 rounded-full bg-slate-600' />
                            <div className='mb-1 h-2 w-24 rounded-full bg-slate-700' />
                            <div className='h-2 w-20 rounded-full bg-slate-700' />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
