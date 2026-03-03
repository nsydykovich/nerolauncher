'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'
import { ThemeTab } from './theme-tab'
import { ColorModeTab } from './color-mode-tab'
import { ColorSchemeTab } from './color-scheme-tab'

type Tab = 'theme' | 'colorMode' | 'colorScheme'

export function AppearanceSection() {
    const [tab, setTab] = React.useState<Tab>('theme')
    const { t } = useTranslation()

    const TABS: { id: Tab; label: string }[] = [
        { id: 'theme',       label: t('appearance.tabs.theme')       },
        { id: 'colorMode',   label: t('appearance.tabs.colorMode')   },
        { id: 'colorScheme', label: t('appearance.tabs.colorScheme') },
    ]

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold'>{t('appearance.title')}</h2>
                <p className='text-sm text-muted-foreground mt-1'>{t('appearance.description')}</p>
            </div>

            {/* Sub-tabs */}
            <div className='flex gap-1 rounded-lg bg-muted p-1 w-fit'>
                {TABS.map((tb) => (
                    <button
                        key={tb.id}
                        onClick={() => setTab(tb.id)}
                        className={cn(
                            'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                            tab === tb.id
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {tb.label}
                    </button>
                ))}
            </div>

            {tab === 'theme'       && <ThemeTab />}
            {tab === 'colorMode'   && <ColorModeTab />}
            {tab === 'colorScheme' && <ColorSchemeTab />}
        </div>
    )
}
