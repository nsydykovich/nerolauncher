'use client'

import * as React from 'react'
import { useAppTheme } from '@/shared/ui/theme-provider'
import { useTranslation } from '@/shared/lib/i18n'
import { DENSITY_OPTIONS, FONT_OPTIONS } from '@/shared/config/themes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/lib/utils'

function Slider({ value, min, max, step, label, format, onChange }: {
    value: number; min: number; max: number; step: number
    label: string; format: (v: number) => string; onChange: (v: number) => void
}) {
    return (
        <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
                <span className='font-medium'>{label}</span>
                <span className='text-muted-foreground tabular-nums'>{format(value)}</span>
            </div>
            <input
                type='range' min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className='w-full accent-primary cursor-pointer'
            />
            <div className='flex justify-between text-xs text-muted-foreground'>
                <span>{format(min)}</span><span>{format(max)}</span>
            </div>
        </div>
    )
}

export function ColorSchemeTab() {
    const { colorScheme, setColorScheme } = useAppTheme()
    const { t } = useTranslation()
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const densityLabels: Record<string, string> = {
        compact:     t('appearance.colorScheme.compact'),
        normal:      t('appearance.colorScheme.normal'),
        comfortable: t('appearance.colorScheme.comfortable'),
    }

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-base font-semibold'>{t('appearance.colorScheme.title')}</h3>
                <p className='text-sm text-muted-foreground'>{t('appearance.colorScheme.description')}</p>
            </div>

            {/* Blur */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle className='text-sm'>{t('appearance.colorScheme.blur')}</CardTitle>
                            <CardDescription>{t('appearance.colorScheme.blurDesc')}</CardDescription>
                        </div>
                        <Switch
                            checked={colorScheme.blur}
                            onCheckedChange={(v) => setColorScheme({ blur: v })}
                        />
                    </div>
                </CardHeader>
            </Card>

            {/* Density */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-sm'>{t('appearance.colorScheme.density')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex gap-2'>
                        {DENSITY_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setColorScheme({ density: opt.id })}
                                className={cn(
                                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                                    colorScheme.density === opt.id
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border hover:bg-accent',
                                )}
                            >
                                {densityLabels[opt.id]}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Font */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-sm'>{t('appearance.colorScheme.fontFamily')}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-2'>
                        {FONT_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setColorScheme({ fontId: opt.id })}
                                className={cn(
                                    'rounded-md border px-3 py-2.5 text-sm transition-colors text-left',
                                    colorScheme.fontId === opt.id
                                        ? 'border-primary bg-primary/10 text-primary font-medium'
                                        : 'border-border hover:bg-accent',
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <Slider
                        label={t('appearance.colorScheme.fontSize')}
                        value={colorScheme.fontSize} min={8} max={14} step={1}
                        format={(v) => `${(v / 10).toFixed(1)}rem`}
                        onChange={(v) => setColorScheme({ fontSize: v })}
                    />
                </CardContent>
            </Card>

            {/* Scale */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-sm'>{t('appearance.colorScheme.scale')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Slider
                        label={t('appearance.colorScheme.scale')}
                        value={colorScheme.scale} min={7} max={15} step={1}
                        format={(v) => `${v * 10}%`}
                        onChange={(v) => setColorScheme({ scale: v })}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
