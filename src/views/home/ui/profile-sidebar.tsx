'use client'

import * as React from 'react'
import { Clock, Package, Folder, Settings, Plus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { PROFILES, type Profile } from '../model/mock-data'

function StatBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className='flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-card border border-border'>
            <Icon className='h-4 w-4 text-muted-foreground' />
            <span className='text-base font-bold tabular-nums'>{value}</span>
            <span className='text-xs text-muted-foreground'>{label}</span>
        </div>
    )
}

function ProfileCard({
    profile,
    isActive,
    onClick,
}: {
    profile: Profile
    isActive: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 border',
                isActive
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-card border-border hover:bg-accent/50 hover:border-border text-card-foreground',
            )}
        >
            <span className='text-2xl leading-none'>{profile.icon}</span>
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold truncate'>{profile.name}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                    {profile.version} · {profile.modLoader}
                </p>
            </div>
            {isActive && (
                <div className='h-2 w-2 rounded-full bg-primary shrink-0' />
            )}
        </button>
    )
}

export function ProfileSidebar({
    activeProfileId,
    onSelectProfile,
}: {
    activeProfileId: string
    onSelectProfile: (id: string) => void
}) {
    return (
        <aside className='w-64 shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden'>
            {/* User header */}
            <div className='p-4 border-b border-border'>
                <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0'>
                        <span className='text-lg'>🎮</span>
                    </div>
                    <div className='min-w-0'>
                        <p className='text-sm font-semibold truncate'>Steve</p>
                        <p className='text-xs text-muted-foreground'>Лицензионный аккаунт</p>
                    </div>
                    <button className='ml-auto p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground'>
                        <Settings className='h-3.5 w-3.5' />
                    </button>
                </div>
            </div>

            {/* Profiles list */}
            <div className='flex-1 overflow-y-auto p-3 space-y-1.5'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2'>
                    Профили
                </p>
                {PROFILES.map((p) => (
                    <ProfileCard
                        key={p.id}
                        profile={p}
                        isActive={p.id === activeProfileId}
                        onClick={() => onSelectProfile(p.id)}
                    />
                ))}
                <button className='w-full flex items-center gap-2 rounded-xl p-3 text-sm text-muted-foreground border border-dashed border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200'>
                    <Plus className='h-4 w-4' />
                    Новый профиль
                </button>
            </div>

            {/* Quick stats */}
            <div className='p-3 border-t border-border'>
                <div className='grid grid-cols-3 gap-1.5'>
                    <StatBadge icon={Clock}    label='Часов'  value='142' />
                    <StatBadge icon={Package}  label='Модов'  value='37'  />
                    <StatBadge icon={Folder}   label='Миров'  value='8'   />
                </div>
            </div>
        </aside>
    )
}
