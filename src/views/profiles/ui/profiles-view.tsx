'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { MinecraftAdvancedSection } from '@/views/settings/ui/sections/minecraft-advanced-section'

export function ProfilesView() {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Header */}
      <div className='flex-shrink-0 border-b border-border px-6 py-4'>
        <h1 className='text-2xl font-bold'>Profiles</h1>
        <p className='text-sm text-muted-foreground mt-1'>Manage your game profiles and Minecraft versions</p>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto px-6 py-6'>
        {/* Version Manager Section */}
        <div className='max-w-4xl'>
          <MinecraftAdvancedSection />
        </div>
      </div>
    </div>
  )
}
