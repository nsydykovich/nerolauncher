'use client'

import * as React from 'react'
import { PROFILES } from '../model/mock-data'
import { ProfileSidebar } from './profile-sidebar'
import { HeroSection } from './hero-section'
import { NewsFeed } from './news-feed'
import { ModsPanel } from './mods-panel'

export function HomePage() {
    const [activeProfileId, setActiveProfileId] = React.useState(PROFILES[0].id)
    const [isLaunching, setIsLaunching] = React.useState(false)

    const activeProfile = PROFILES.find((p) => p.id === activeProfileId) ?? PROFILES[0]

    const handlePlay = () => {
        setIsLaunching(true)
        setTimeout(() => setIsLaunching(false), 3000)
    }

    return (
        <div className='flex h-full overflow-hidden bg-background'>
            <ProfileSidebar
                activeProfileId={activeProfileId}
                onSelectProfile={setActiveProfileId}
            />

            <main className='flex-1 flex flex-col overflow-hidden'>
                <HeroSection
                    activeProfile={activeProfile}
                    activeProfileId={activeProfileId}
                    isLaunching={isLaunching}
                    onPlay={handlePlay}
                    onSelectProfile={setActiveProfileId}
                />

                <div className='flex-1 overflow-y-auto'>
                    <div className='grid grid-cols-[1fr_280px] gap-0 h-full'>
                        <NewsFeed onSelectProfile={setActiveProfileId} />
                        <ModsPanel />
                    </div>
                </div>
            </main>
        </div>
    )
}
