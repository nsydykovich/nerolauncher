'use client'

import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import type { MinecraftLoader } from '../model/types'

interface LoaderCardProps {
  loader: MinecraftLoader
  isSelected: boolean
  onSelect: (id: string) => void
}

export function LoaderCard({ loader, isSelected, onSelect }: LoaderCardProps) {
  return (
    <button
      onClick={() => onSelect(loader.id)}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/60',
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-border hover:bg-muted/30',
      )}
    >
      {/* Color Circle with Two Letters */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-md',
          `bg-gradient-to-br ${loader.color}`,
        )}
      >
        {loader.twoLetters}
      </div>

      {/* Loader Name */}
      <span className='text-sm font-medium text-foreground'>{loader.displayName}</span>
    </button>
  )
}
