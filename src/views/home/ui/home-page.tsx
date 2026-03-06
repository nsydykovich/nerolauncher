'use client'

import * as React from 'react'
import { Terminal } from 'lucide-react'
import { useInstances } from '@/features/instance-manager'
import { useLauncher } from '@/features/game-launcher/model/use-launcher'
import { useAuth } from '@/shared/lib/auth/auth-context'
import { useConsole } from '@/shared/lib/hooks/use-console'
import { InstanceShowcase } from './instance-showcase'
import { ConsolePanel } from '@/shared/ui/console-panel'
import { Button } from '@/shared/ui/button'

export function HomePage() {
    const { profiles: instances, isLoading } = useInstances()
    const [activeInstanceId, setActiveInstanceId] = React.useState<string | null>(null)
    const [isLaunching, setIsLaunching] = React.useState(false)
    const { launch } = useLauncher()
    const { activeAccount } = useAuth()
    const console = useConsole()

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
        console.openConsole()
        console.clear()
        console.addMessage('Starting Minecraft launch...', 'info')

        try {
            console.addMessage(`Instance: ${activeInstance.name}`, 'info')
            console.addMessage(`Version: ${activeInstance.gameVersion}`, 'info')

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
            console.addMessage('Minecraft launched successfully!', 'success')
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            console.addMessage(`Launch failed: ${message}`, 'error')
            console.addMessage(JSON.stringify(error, null, 2), 'error')
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
        <main className='flex-1 flex flex-col overflow-hidden bg-background pb-64'>
            {/* Instance Showcase */}
            <div className='p-6 border-b border-border/50'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                        <InstanceShowcase
                            instance={activeInstance}
                            isLaunching={isLaunching}
                            onPlay={handlePlay}
                        />
                    </div>
                </div>
            </div>

            {/* Console Toggle Button */}
            <div className='flex-shrink-0 px-6 py-4 border-b border-border/50'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={console.toggleConsole}
                    className='gap-2'
                >
                    <Terminal className='h-4 w-4' />
                    {console.isOpen ? 'Hide Console' : 'Show Console'}
                </Button>
            </div>

            {/* Coming Soon Section */}
            <div className='flex-1 overflow-y-auto px-6 py-8'>
                <div className='max-w-2xl mx-auto space-y-8'>
                    <div className='rounded-lg border border-border/50 bg-muted/30 p-6'>
                        <h2 className='text-lg font-semibold mb-2'>📰 News & Updates</h2>
                        <p className='text-sm text-muted-foreground'>Coming soon...</p>
                    </div>

                    <div className='rounded-lg border border-border/50 bg-muted/30 p-6'>
                        <h2 className='text-lg font-semibold mb-2'>🎮 Mods & Content</h2>
                        <p className='text-sm text-muted-foreground'>Coming soon...</p>
                    </div>

                    <div className='rounded-lg border border-border/50 bg-muted/30 p-6'>
                        <h2 className='text-lg font-semibold mb-2'>⭐ Featured</h2>
                        <p className='text-sm text-muted-foreground'>Coming soon...</p>
                    </div>
                </div>
            </div>

            {/* Console Panel */}
            <ConsolePanel
                isOpen={console.isOpen}
                onClose={console.closeConsole}
                messages={console.messages}
                onClear={console.clear}
            />
        </main>
    )
}
