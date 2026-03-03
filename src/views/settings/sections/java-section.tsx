'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { JavaPathsForm } from '@/features/set-java-path'

export function JavaSection() {
  const { t } = useTranslation()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold'>{t('java.title')}</h2>
        <p className='mt-1 text-sm text-muted-foreground'>{t('java.description')}</p>
      </div>

      <JavaPathsForm />
    </div>
  )
}
