'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'

const LOCALES = [
    { id: 'en' as const, flag: '🇬🇧' },
    { id: 'ru' as const, flag: '🇷🇺' },
]

export function LanguageSection() {
    const { t, locale, setLocale } = useTranslation()

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold'>{t('language.title')}</h2>
                <p className='text-sm text-muted-foreground mt-1'>{t('language.description')}</p>
            </div>

            <div className='grid grid-cols-2 gap-3 max-w-sm'>
                {LOCALES.map(({ id, flag }) => (
                    <button
                        key={id}
                        onClick={() => setLocale(id)}
                        className={cn(
                            'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                            locale === id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/40 hover:bg-accent/30',
                        )}
                    >
                        <span className='text-2xl'>{flag}</span>
                        <span className='text-sm font-medium'>{t(`language.${id}`)}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
