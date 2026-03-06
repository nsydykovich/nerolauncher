'use client'

import * as React from 'react'
import { useProfiles } from '@/features/profile-manager'
import { HeroSection } from './hero-section'
import { NewsFeed } from './news-feed'
import { ModsPanel } from './mods-panel'
import { ProfileSidebar } from './profile-sidebar'

export function HomePage() {
    const { profiles, isLoading } = useProfiles()
    const [activeProfileId, setActiveProfileId] = React.useState<string | null>(null)
    const [isLaunching, setIsLaunching] = React.useState(false)

    // Set first profile as active once profiles load
    React.useEffect(() => {
        if (!isLoading && profiles.length > 0 && !activeProfileId) {
            setActiveProfileId(profiles[0].id)
        }
    }, [profiles, isLoading, activeProfileId])

    const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0]

    const handlePlay = () => {
        setIsLaunching(true)
        // Would call launcher here
        setTimeout(() => setIsLaunching(false), 3000)
    }

    if (isLoading) {
        return (
            <div className='flex h-full items-center justify-center bg-background'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border border-primary border-t-transparent mx-auto mb-4' />
                    <p className='text-sm text-muted-foreground'>Loading profiles...</p>
                </div>
            </div>
        )
    }

    if (profiles.length === 0) {
        return (
            <div className='flex h-full items-center justify-center bg-background'>
                <div className='text-center max-w-md'>
                    <h2 className='text-xl font-semibold mb-2'>No profiles yet</h2>
                    <p className='text-sm text-muted-foreground mb-6'>
                        Create your first profile to get started
                    </p>
                    {/* ProfileManager modal would go here */}
                </div>
            </div>
        )
    }

    return (
        <div className='flex h-full overflow-hidden bg-background'>
            <ProfileSidebar
                activeProfileId={activeProfileId ?? ''}
                onSelectProfile={setActiveProfileId}
            />

            <main className='flex-1 flex flex-col overflow-hidden'>
                {activeProfile && (
                    <HeroSection
                        activeProfile={activeProfile}
                        activeProfileId={activeProfileId ?? ''}
                        isLaunching={isLaunching}
                        onPlay={handlePlay}
                        onSelectProfile={setActiveProfileId}
                    />
                )}

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
