'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { MinecraftLoaderSelector } from '@/features/select-minecraft-loader'
import { MinecraftAdvancedSection } from './minecraft-advanced-section'

export function MinecraftSection() {
  const { t } = useTranslation()

  return (
    <div className='space-y-10'>
      {/* Quick Settings */}
      <div>
        <h2 className='text-2xl font-semibold'>{t('minecraft.title')}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>{t('minecraft.description')}</p>

        <div className='mt-6 space-y-4'>
          <div>
            <label className='text-sm font-medium text-foreground'>{t('minecraft.loaderLabel')}</label>
            <div className='mt-3'>
              <MinecraftLoaderSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Advanced Settings</h2>
        <MinecraftAdvancedSection />
      </div>
    </div>
  )
}
