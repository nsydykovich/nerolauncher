'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { useAppTheme } from '@/shared/ui/theme-provider'
import { useWindowClose } from '@/shared/lib/use-window-close'
import { cn } from '@/shared/lib/utils'
import { AppearanceSection } from './sections/appearance'
import { StubSection } from './sections/stub-section'
import { LanguageSection } from './sections/language-section'
import { JavaSection } from './sections/java-section'
import { MinecraftSection } from './sections/minecraft-section'
import { Switch } from '@/shared/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'

type Section = 'profile' | 'appearance' | 'java' | 'minecraft' | 'language' | 'system'

function SystemSection() {
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

export function SettingsView() {
    const [activeSection, setActiveSection] = React.useState<Section>('appearance')
    const { t } = useTranslation()
    const { minimizeToTray } = useAppTheme()
    useWindowClose(minimizeToTray)

    const NAV_ITEMS: { id: Section; label: string }[] = [
        { id: 'profile',    label: t('settings.profile')    },
        { id: 'appearance', label: t('settings.appearance') },
        { id: 'java',       label: t('settings.java')       },
        { id: 'minecraft',  label: t('settings.minecraft')  },
        { id: 'language',   label: t('settings.language')   },
        { id: 'system',     label: t('settings.system')     },
    ]

    return (
        <div className='flex h-full overflow-hidden'>
            {/* Sidebar */}
            <aside className='w-56 shrink-0 border-r border-border bg-sidebar p-3 overflow-y-auto'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2'>
                    {t('settings.title')}
                </p>
                <nav className='space-y-0.5'>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                'w-full text-left rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                activeSection === item.id
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <main className='flex-1 overflow-y-auto p-8'>
                {activeSection === 'appearance' && <AppearanceSection />}
                {activeSection === 'language'   && <LanguageSection />}
                {activeSection === 'system'     && <SystemSection />}
                {activeSection === 'profile'    && <StubSection titleKey='settings.profile' />}
                {activeSection === 'java'       && <JavaSection />}
                {activeSection === 'minecraft'  && <MinecraftSection />}
            </main>
        </div>
    )
}
