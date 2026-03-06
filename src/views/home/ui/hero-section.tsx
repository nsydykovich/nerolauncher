'use client'

import * as React from 'react'
import { Play, ChevronDown, Clock, RefreshCw, Settings } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { PROFILES, type Profile } from '../model/mock-data'

export function HeroSection({
    activeProfile,
    activeProfileId,
    isLaunching,
    onPlay,
    onSelectProfile,
}: {
    activeProfile: Profile
    activeProfileId: string
    isLaunching: boolean
    onPlay: () => void
    onSelectProfile: (id: string) => void
}) {
    const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!profileDropdownOpen) return
        const h = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [profileDropdownOpen])

    return (
        <div className='relative overflow-hidden border-b border-border'>
            {/* Background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none' />
            <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent' />

            <div className='relative p-8 flex items-center gap-8'>
                {/* Profile info */}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-1'>
                        <span className='text-4xl'>{activeProfile.icon}</span>
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight'>{activeProfile.name}</h1>
                            <div className='flex items-center gap-2 mt-0.5'>
                                <span className='text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium'>
                                    {activeProfile.version}
                                </span>
                                <span className='text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium'>
                                    {activeProfile.modLoader}
                                </span>
                                <span className='text-xs text-muted-foreground flex items-center gap-1'>
                                    <Clock className='h-3 w-3' />
                                    {activeProfile.lastPlayed}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className='flex items-center gap-2 shrink-0'>
                    <button className='p-2.5 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-muted-foreground hover:text-foreground'>
                        <RefreshCw className='h-4 w-4' />
                    </button>
                    <button className='p-2.5 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-muted-foreground hover:text-foreground'>
                        <Settings className='h-4 w-4' />
                    </button>

                    {/* Profile switcher */}
                    <div ref={dropdownRef} className='relative'>
                        <button
                            onClick={() => setProfileDropdownOpen(v => !v)}
                            className='flex items-center gap-2 h-11 px-4 rounded-l-xl border border-r-0 border-border bg-card hover:bg-accent transition-colors text-sm font-medium'
                        >
                            {activeProfile.name}
                            <ChevronDown className='h-3.5 w-3.5 text-muted-foreground' />
                        </button>
                        {profileDropdownOpen && (
                            <div className='absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-popover shadow-xl py-1 z-50'>
                                {PROFILES.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => { onSelectProfile(p.id); setProfileDropdownOpen(false) }}
                                        className={cn(
                                            'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                                            p.id === activeProfileId
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-popover-foreground hover:bg-accent',
                                        )}
                                    >
                                        <span>{p.icon}</span>
                                        <span className='truncate'>{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Play button */}
                    <button
                        onClick={onPlay}
                        disabled={isLaunching}
                        className={cn(
                            'flex items-center gap-2 h-11 px-6 rounded-r-xl font-semibold text-sm transition-all duration-200',
                            'bg-primary text-primary-foreground',
                            isLaunching
                                ? 'opacity-80 cursor-not-allowed'
                                : 'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25',
                        )}
                    >
                        {isLaunching ? (
                            <>
                                <RefreshCw className='h-4 w-4 animate-spin' />
                                Запуск...
                            </>
                        ) : (
                            <>
                                <Play className='h-4 w-4 fill-current' />
                                Играть
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
