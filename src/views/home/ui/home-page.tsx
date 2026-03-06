'use client'

import * as React from 'react'
import { useInstances } from '@/features/instance-manager'
import { useLauncher } from '@/features/game-launcher/model/use-launcher'
import { useAuth } from '@/shared/lib/auth/auth-context'
import { InstanceShowcase } from './instance-showcase'
import { NewsFeed } from './news-feed'
import { ModsPanel } from './mods-panel'

export function HomePage() {
    const { profiles: instances, isLoading } = useInstances()
    const [activeInstanceId, setActiveInstanceId] = React.useState<string | null>(null)
    const [isLaunching, setIsLaunching] = React.useState(false)
    const { launch } = useLauncher()
    const { activeAccount } = useAuth()

    // Set first instance as active once instances load
    React.useEffect(() => {
        if (!isLoading && instances.length > 0 && !activeInstanceId) {
            setActiveInstanceId(instances[0].id)
        }
    }, [instances, isLoading, activeInstanceId])

    const activeInstance = instances.find((i) => i.id === activeInstanceId) ?? instances[0] ?? null

    const handlePlay = async () => {
        if (!activeInstance || !activeAccount) return

        setIsLaunching(true)
        try {
            await launch({
                profileId: activeInstance.id,
                gameVersion: activeInstance.gameVersion,
                javaVersion: activeInstance.javaVersion,
                gameDirStrategy: 'per-profile',
                username: activeAccount.username,
                uuid: activeAccount.uuid,
                accessToken: activeAccount.accessToken,
                javaArgs: activeInstance.javaArgs,
            })
        } catch (error) {
            console.error('Launch failed:', error)
        } finally {
            setIsLaunching(false)
        }
    }

    if (isLoading) {
        return (
            <div className='flex h-full items-center justify-center bg-background'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border border-primary border-t-transparent mx-auto mb-4' />
                    <p className='text-sm text-muted-foreground'>Loading instances...</p>
                </div>
            </div>
        )
    }

    return (
        <main className='flex-1 flex flex-col overflow-hidden bg-background'>
            {/* Instance Showcase */}
            <div className='p-6 border-b border-border/50'>
                <InstanceShowcase
                    instance={activeInstance}
                    isLaunching={isLaunching}
                    onPlay={handlePlay}
                />
            </div>

            {/* News Feed and Mods Panel */}
            <div className='flex-1 overflow-y-auto'>
                <div className='grid grid-cols-[1fr_280px] gap-0 h-full'>
                    <NewsFeed onSelectProfile={setActiveInstanceId} />
                    <ModsPanel />
                </div>
            </div>
        </main>
    )
}
