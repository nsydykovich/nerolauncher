'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { JavaVersionCard } from '@/entities/java-version'
import { useJavaPaths } from '../model/use-java-paths'

export function JavaPathsForm() {
  const { t } = useTranslation()
  const { versions, setPath, setActive, browse, isLoading } = useJavaPaths()

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='h-32 animate-pulse rounded-lg border border-border bg-muted/30'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {versions.map((version) => (
        <JavaVersionCard
          key={version.javaVersion}
          version={version.javaVersion}
          path={version.javaPath}
          isActive={version.isActive}
          onPathChange={setPath}
          onActivate={setActive}
          onBrowse={browse}
          pathPlaceholder={t('java.pathPlaceholder')}
          activeLabel={t('java.active')}
          browseLabel={t('java.browse')}
          pathLabel={t('java.pathLabel')}
        />
      ))}
    </div>
  )
}
