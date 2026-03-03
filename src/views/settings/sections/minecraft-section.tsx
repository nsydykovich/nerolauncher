'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { MinecraftLoaderSelector } from '@/features/select-minecraft-loader'

export function MinecraftSection() {
  const { t } = useTranslation()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold'>{t('minecraft.title')}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>{t('minecraft.description')}</p>
      </div>

      <div>
        <label className='text-sm font-medium text-foreground'>{t('minecraft.loaderLabel')}</label>
        <div className='mt-4'>
          <MinecraftLoaderSelector />
        </div>
      </div>
    </div>
  )
}
