'use client'

import { Globe, Star, Download, Package, Gamepad2 } from 'lucide-react'
import { QUICK_MODS } from '../model/mock-data'

export function ModsPanel() {
    return (
        <div className='p-5 overflow-y-auto'>
            {/* Modrinth-style search bar */}
            <div className='mb-5'>
                <div className='flex items-center gap-2 px-3 py-2.5 rounded-xl bg-input border border-border text-sm text-muted-foreground cursor-text hover:border-primary/40 transition-colors'>
                    <Globe className='h-4 w-4 shrink-0' />
                    <span>Поиск модов...</span>
                </div>
            </div>

            {/* Popular mods */}
            <div className='mb-4'>
                <div className='flex items-center gap-2 mb-3'>
                    <Star className='h-4 w-4 text-muted-foreground' />
                    <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Популярные моды
                    </h3>
                </div>
                <div className='space-y-2'>
                    {QUICK_MODS.map((mod) => (
                        <div
                            key={mod.id}
                            className='flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors cursor-pointer group'
                        >
                            <span className='text-lg'>{mod.icon}</span>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium'>{mod.name}</p>
                                <p className='text-xs text-muted-foreground'>{mod.category}</p>
                            </div>
                            <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                <Download className='h-3 w-3' />
                                {mod.downloads}
                            </div>
                        </div>
                    ))}
                </div>
                <button className='w-full mt-3 py-2 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all'>
                    Открыть каталог модов →
                </button>
            </div>

            {/* Quick links */}
            <div className='space-y-1.5'>
                <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                    Быстрые ссылки
                </h3>
                {[
                    { icon: Globe, label: 'Modrinth' },
                    { icon: Package, label: 'CurseForge' },
                    { icon: Gamepad2, label: 'MC Wiki' },
                ].map(({ icon: Icon, label }) => (
                    <button
                        key={label}
                        className='w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                    >
                        <Icon className='h-4 w-4 shrink-0' />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}
