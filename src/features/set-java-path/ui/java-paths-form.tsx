'use client'

import { useTranslation } from '@/shared/lib/i18n'
import { JavaVersionCard } from '@/entities/java-version'
import { useJavaPaths } from '../model/use-java-paths'

export function JavaPathsForm() {
  const { t } = useTranslation()
  const { versions, setPath, setSourceType, setArgsPreset, setCustomArgs, setExtraArgs, browse, isLoading } = useJavaPaths()

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-32 animate-pulse rounded-lg border border-border bg-muted/30' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {versions.map((v) => (
        <JavaVersionCard
          key={v.javaVersion}
          version={v.javaVersion}
          path={v.javaPath}
          sourceType={v.sourceType}
          argsPreset={v.argsPreset}
          customArgs={v.customArgs}
          extraArgs={v.extraArgs}
          onPathChange={setPath}
          onSourceChange={setSourceType}
          onArgsPresetChange={setArgsPreset}
          onCustomArgsChange={setCustomArgs}
          onExtraArgsChange={setExtraArgs}
          onBrowse={browse}
          pathPlaceholder={t('java.pathPlaceholder')}
          browseLabel={t('java.browse')}
          pathLabel={t('java.pathLabel')}
          mojangLabel={t('java.mojangLabel')}
          customLabel={t('java.customLabel')}
          mojangDesc={t('java.mojangDesc')}
          argsLabel={t('java.argsLabel')}
          argsPlaceholder={t('java.argsPlaceholder')}
          extraArgsLabel={t('java.extraArgsLabel')}
          customWarning={t('java.customWarning')}
        />
      ))}
    </div>
  )
}
