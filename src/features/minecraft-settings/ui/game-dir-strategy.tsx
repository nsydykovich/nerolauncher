'use client'

import * as React from 'react'
import { HardDrive, FolderOpen, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import type { GameDirStrategy } from '@/shared/types/minecraft'

interface GameDirStrategyProps {
  value: GameDirStrategy
  onChange: (strategy: GameDirStrategy) => void
}

const STRATEGIES = [
  {
    id: 'global',
    label: 'Global .minecraft',
    description: 'All profiles use the same .minecraft folder in home directory',
    icon: HardDrive,
    note: 'Mods, worlds, and settings are shared across profiles',
  },
  {
    id: 'per-profile',
    label: 'Per-Profile',
    description: 'Each profile has its own isolated game directory',
    icon: FolderOpen,
    note: 'Prevents conflicts between different mod setups',
  },
  {
    id: 'per-family',
    label: 'Per-Family (Modpack)',
    description: 'Profiles in the same family share game directory',
    icon: Users,
    note: 'Great for shared modpack families or multiplayer servers',
  },
]

export function GameDirStrategy({ value, onChange }: GameDirStrategyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm'>Game Directory Strategy</CardTitle>
        <CardDescription>
          Choose where Minecraft saves worlds, mods, and settings
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {STRATEGIES.map((strategy) => {
          const Icon = strategy.icon
          const isSelected = value === strategy.id

          return (
            <button
              key={strategy.id}
              onClick={() => onChange(strategy.id as GameDirStrategy)}
              className={cn(
                'w-full text-left rounded-lg border-2 p-4 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent/30',
              )}
            >
              <div className='flex items-start gap-3'>
                <Icon className='h-5 w-5 shrink-0 mt-0.5 text-muted-foreground' />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm'>{strategy.label}</p>
                    {isSelected && (
                      <span className='h-2 w-2 rounded-full bg-primary' />
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {strategy.description}
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'>
                    💡 {strategy.note}
                  </p>
                </div>
              </div>
            </button>
          )
        })}

        <div className='rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-2.5 mt-4'>
          <p className='text-xs text-blue-600 dark:text-blue-400'>
            <strong>Current strategy:</strong> {value === 'global' ? 'All mods/worlds shared' : value === 'per-profile' ? 'Each profile isolated' : 'Profiles share by family'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
