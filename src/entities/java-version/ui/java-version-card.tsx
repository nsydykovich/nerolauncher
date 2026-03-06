'use client'

import * as React from 'react'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/shared/ui/card'
import { Input, Label } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/lib/utils'
import { GC_PRESETS, getPresetArgs, type JavaVersionNumber, type JavaSourceType, type JavaArgsPresetId } from '../model/types'

interface JavaVersionCardProps {
  version: JavaVersionNumber
  path: string
  sourceType: JavaSourceType
  argsPreset: JavaArgsPresetId
  customArgs: string
  extraArgs: string
  onPathChange: (version: JavaVersionNumber, path: string) => void
  onBrowse: (version: JavaVersionNumber) => void
  onSourceChange: (version: JavaVersionNumber, source: JavaSourceType) => void
  onArgsPresetChange: (version: JavaVersionNumber, preset: JavaArgsPresetId) => void
  onCustomArgsChange: (version: JavaVersionNumber, args: string) => void
  onExtraArgsChange: (version: JavaVersionNumber, args: string) => void
  pathPlaceholder: string
  browseLabel: string
  pathLabel: string
  mojangLabel: string
  customLabel: string
  mojangDesc: string
  argsLabel: string
  argsPlaceholder: string
  extraArgsLabel: string
  customWarning: string
}

export function JavaVersionCard({
  version,
  path,
  sourceType,
  argsPreset,
  customArgs,
  extraArgs,
  onPathChange,
  onBrowse,
  onSourceChange,
  onArgsPresetChange,
  onCustomArgsChange,
  onExtraArgsChange,
  pathPlaceholder,
  browseLabel,
  pathLabel,
  mojangLabel,
  customLabel,
  mojangDesc,
  argsLabel,
  argsPlaceholder,
  extraArgsLabel,
  customWarning,
}: JavaVersionCardProps) {
  const isMojang = sourceType === 'mojang'
  const isCustomArgs = argsPreset === 'custom'

  // Render the final args that would be used
  const finalArgs = isCustomArgs ? customArgs : getPresetArgs(argsPreset, version)

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <h3 className='text-base font-semibold'>Java {version}</h3>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {isMojang ? mojangLabel : customLabel}
            </span>
            <Switch
              checked={isMojang}
              onCheckedChange={(checked) => onSourceChange(version, checked ? 'mojang' : 'custom')}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          {/* Source description / custom path */}
          {isMojang ? (
            <p className='text-sm text-muted-foreground'>{mojangDesc}</p>
          ) : (
            <div>
              <Label className='text-sm'>{pathLabel}</Label>
              <div className='mt-2 flex gap-2'>
                <Input
                  type='text'
                  placeholder={pathPlaceholder}
                  value={path}
                  onChange={(e) => onPathChange(version, e.target.value)}
                  className='flex-1'
                />
                <Button variant='outline' size='sm' onClick={() => onBrowse(version)}>
                  {browseLabel}
                </Button>
              </div>
            </div>
          )}

          {/* JVM arguments selector + inputs */}
          <div className='space-y-2'>
            <Label className='text-sm'>{argsLabel}</Label>

            {/* Preset Select */}
            <select
              value={argsPreset}
              onChange={(e) => onArgsPresetChange(version, e.target.value as JavaArgsPresetId)}
              className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <option value='custom'>Кастомные аргументы</option>
              {GC_PRESETS.map((preset) => {
                const isAvailable = !!preset.argsPerVersion[version]
                return (
                  <option key={preset.id} value={preset.id} disabled={!isAvailable}>
                    {preset.label}
                    {!isAvailable && ' (недоступен для Java ' + version + ')'}
                  </option>
                )
              })}
            </select>

            {/* Final args display (readonly) */}
            {finalArgs && (
              <div>
                <p className='text-xs text-muted-foreground mb-1.5'>Итоговые аргументы:</p>
                <Input
                  type='text'
                  value={finalArgs}
                  readOnly
                  className='font-mono text-xs bg-muted text-muted-foreground cursor-not-allowed'
                />
              </div>
            )}

            {/* Custom args input — visible only if custom selected */}
            {isCustomArgs && (
              <div>
                <p className='text-xs text-muted-foreground mb-1.5'>Введите аргументы:</p>
                <Input
                  type='text'
                  placeholder={argsPlaceholder}
                  value={customArgs}
                  onChange={(e) => onCustomArgsChange(version, e.target.value)}
                  className='font-mono text-xs'
                />
                <div className='flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 mt-2'>
                  <AlertTriangle className='h-4 w-4 text-amber-500 shrink-0 mt-0.5' />
                  <p className='text-xs text-amber-600 dark:text-amber-400'>{customWarning}</p>
                </div>
              </div>
            )}

            {/* Extra args — disabled if custom args selected */}
            <div>
              <Label className='text-sm'>{extraArgsLabel}</Label>
              <Input
                type='text'
                placeholder='-Dproperty=value'
                value={extraArgs}
                onChange={(e) => onExtraArgsChange(version, e.target.value)}
                disabled={isCustomArgs}
                className='font-mono text-xs'
              />
              {isCustomArgs && (
                <p className='text-xs text-muted-foreground mt-1.5'>
                  Доп. аргументы недоступны при использовании кастомных аргументов
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
