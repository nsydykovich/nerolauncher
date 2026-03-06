'use client'

import * as React from 'react'
import { useAppTheme } from '@/shared/ui/theme-provider'
import { useWindowClose } from '@/shared/lib/use-window-close'
import { AppearanceSection } from './sections/appearance'
import { StubSection } from './sections/stub-section'
import { LanguageSection } from './sections/language-section'
import { JavaSection } from './sections/java-section'
import { MinecraftSection } from './sections/minecraft-section'
import { SystemSection } from './system-section'
import { SettingsSidebar, type Section } from './settings-sidebar'

export function SettingsPage() {
    const [activeSection, setActiveSection] = React.useState<Section>('appearance')
    const { minimizeToTray } = useAppTheme()
    useWindowClose(minimizeToTray)

    return (
        <div className='flex h-full overflow-hidden'>
            <SettingsSidebar
                activeSection={activeSection}
                onSelectSection={setActiveSection}
            />

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
