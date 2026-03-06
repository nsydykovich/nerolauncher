'use client'

import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'

export type Section = 'profile' | 'appearance' | 'java' | 'minecraft' | 'language' | 'system'

export function SettingsSidebar({
    activeSection,
    onSelectSection,
}: {
    activeSection: Section
    onSelectSection: (section: Section) => void
}) {
    const { t } = useTranslation()

    const NAV_ITEMS: { id: Section; label: string }[] = [
        { id: 'profile',    label: t('settings.profile')    },
        { id: 'appearance', label: t('settings.appearance') },
        { id: 'java',       label: t('settings.java')       },
        { id: 'minecraft',  label: t('settings.minecraft')  },
        { id: 'language',   label: t('settings.language')   },
        { id: 'system',     label: t('settings.system')     },
    ]

    return (
        <aside className='w-56 shrink-0 border-r border-border bg-sidebar p-3 overflow-y-auto'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2'>
                {t('settings.title')}
            </p>
            <nav className='space-y-0.5'>
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectSection(item.id)}
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
    )
}
