'use client'

import * as React from 'react'
import { MOD_LOADERS, LoaderCard } from '@/entities/minecraft-loader'
import { useMinecraftLoader } from '../model/use-minecraft-loader'

export function MinecraftLoaderSelector() {
  const { selectedLoader, setSelectedLoader, isLoading } = useMinecraftLoader()

  if (isLoading) {
    return (
      <div className='grid grid-cols-4 gap-3'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='h-24 animate-pulse rounded-lg border-2 border-border bg-muted/30'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-4 gap-3'>
      {MOD_LOADERS.map((loader) => (
        <LoaderCard
          key={loader.id}
          loader={loader}
          isSelected={selectedLoader === loader.id}
          onSelect={(id) => setSelectedLoader(id as any)}
        />
      ))}
    </div>
  )
}
