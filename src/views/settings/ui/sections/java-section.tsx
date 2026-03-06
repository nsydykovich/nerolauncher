'use client'

import { useTranslation } from '@/shared/lib/i18n'
import { JavaPathsForm, JvmGlobalSettings } from '@/features/set-java-path'

export function JavaSection() {
  const { t } = useTranslation()
  return (
    <div className='space-y-10'>
      {/* Per-version Java settings */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-2xl font-semibold'>{t('java.title')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>{t('java.description')}</p>
        </div>
        <JavaPathsForm />
      </div>

      {/* Global memory & LargePages */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-semibold'>{t('java.globalTitle')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>{t('java.globalDescription')}</p>
        </div>
        <JvmGlobalSettings />
      </div>
    </div>
  )
}
