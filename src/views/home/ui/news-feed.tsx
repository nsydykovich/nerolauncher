'use client'

import { Clock, Gamepad2, Play, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { NEWS, PROFILES, type NewsItem } from '../model/mock-data'

function NewsCard({ item }: { item: NewsItem }) {
    return (
        <div className='flex flex-col gap-3 p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-colors'>
            <div className='h-32 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden'>
                <Gamepad2 className='h-12 w-12 text-muted-foreground/30' />
            </div>
            <div className='flex items-center gap-2'>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', item.tagColor)}>
                    {item.tag}
                </span>
                <span className='text-xs text-muted-foreground'>{item.date}</span>
            </div>
            <h3 className='text-sm font-semibold leading-snug line-clamp-2'>{item.title}</h3>
            <p className='text-xs text-muted-foreground leading-relaxed line-clamp-3'>{item.description}</p>
        </div>
    )
}

export function NewsFeed({
    onSelectProfile,
}: {
    onSelectProfile: (id: string) => void
}) {
    return (
        <div className='p-6 border-r border-border overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4 text-muted-foreground' />
                    <h2 className='text-sm font-semibold'>Новости и обновления</h2>
                </div>
                <button className='text-xs text-muted-foreground hover:text-foreground transition-colors'>
                    Все новости →
                </button>
            </div>
            <div className='grid grid-cols-3 gap-4'>
                {NEWS.map((item) => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>

            {/* Recently played */}
            <div className='mt-6'>
                <div className='flex items-center gap-2 mb-3'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <h2 className='text-sm font-semibold'>Недавние профили</h2>
                </div>
                <div className='space-y-2'>
                    {PROFILES.slice(0, 3).map((p) => (
                        <div
                            key={p.id}
                            className='flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer'
                            onClick={() => onSelectProfile(p.id)}
                        >
                            <span className='text-xl'>{p.icon}</span>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium truncate'>{p.name}</p>
                                <p className='text-xs text-muted-foreground'>{p.lastPlayed}</p>
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <span className='text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground'>
                                    {p.version}
                                </span>
                                <Play className='h-3.5 w-3.5 text-muted-foreground' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
