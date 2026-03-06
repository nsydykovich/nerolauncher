'use client'

import * as React from 'react'
import { Info, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card'
import { Switch } from '@/shared/ui/switch'
import { Label } from '@/shared/ui/input'
import { CodeBlock } from '@/shared/ui/code-block'
import { GC_PRESETS } from '@/entities/java-version'
import { useJvmGlobal } from '../model/use-jvm-global'

// ── Memory slider ──────────────────────────────────────────────────────────────

function MemorySlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label className='text-sm'>{label}</Label>
        <span className='text-sm font-mono tabular-nums text-muted-foreground'>
          {value >= 1024 ? `${(value / 1024).toFixed(value % 1024 === 0 ? 0 : 1)} GB` : `${value} MB`}
        </span>
      </div>
      <div className='relative h-2 w-full rounded-full bg-muted'>
        <div
          className='absolute left-0 top-0 h-2 rounded-full bg-primary transition-all'
          style={{ width: `${pct}%` }}
        />
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className='absolute inset-0 w-full cursor-pointer opacity-0'
        />
      </div>
      <div className='flex justify-between text-xs text-muted-foreground'>
        <span>{min} MB</span>
        <span>{max >= 1024 ? `${max / 1024} GB` : `${max} MB`}</span>
      </div>
    </div>
  )
}

// ── LargePages warning popover ─────────────────────────────────────────────────

function LargePagesWarning({ onClose }: { onClose: () => void }) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-[420px] rounded-xl border border-border bg-card shadow-2xl p-6 space-y-4'>
        <div className='flex items-start gap-3'>
          <AlertTriangle className='h-5 w-5 text-amber-500 shrink-0 mt-0.5' />
          <div>
            <h3 className='text-base font-semibold'>Требуются права администратора</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              Функция Large Pages требует запуска лаунчера с правами администратора.
            </p>
          </div>
        </div>
        <div className='space-y-2 text-sm text-muted-foreground'>
          <p>Для корректной работы рекомендуется:</p>
          <ol className='list-decimal list-inside space-y-1 ml-1'>
            <li>Найти ярлык лаунчера на рабочем столе</li>
            <li>ПКМ → Свойства → Дополнительно</li>
            <li>Включить «Запускать от имени администратора»</li>
            <li>Применить и перезапустить лаунчер</li>
          </ol>
          <p className='text-xs mt-2'>
            Без прав администратора JVM проигнорирует флаг <code className='rounded bg-muted px-1'>-XX:+UseLargePages</code> и запустится в обычном режиме.
          </p>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors'
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function JvmGlobalSettings() {
  const { settings, update, isLoading } = useJvmGlobal()
  const [showLargePagesWarning, setShowLargePagesWarning] = React.useState(false)

  const handleLargePages = (checked: boolean) => {
    update({ largePages: checked })
    if (checked) setShowLargePagesWarning(true)
  }

  if (isLoading) {
    return <div className='h-48 animate-pulse rounded-lg border border-border bg-muted/30' />
  }

  return (
    <>
      {showLargePagesWarning && (
        <LargePagesWarning onClose={() => setShowLargePagesWarning(false)} />
      )}

      <div className='space-y-4'>
        {/* Memory */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Память JVM</CardTitle>
            <CardDescription>
              Применяется ко всем профилям, если в профиле не задано своё значение
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <MemorySlider
              label='Xms — начальная память'
              value={settings.xms}
              min={256}
              max={settings.xmx}
              step={256}
              onChange={(v) => update({ xms: v })}
            />
            <MemorySlider
              label='Xmx — максимальная память'
              value={settings.xmx}
              min={settings.xms}
              max={16384}
              step={256}
              onChange={(v) => update({ xmx: v })}
            />
          </CardContent>
        </Card>

        {/* Large Pages */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-sm'>Large Pages (-XX:+UseLargePages)</CardTitle>
                <CardDescription>
                  Использовать большие страницы памяти (2 MB вместо 4 KB). Снижает нагрузку на TLB и
                  улучшает производительность на больших кучах.
                </CardDescription>
              </div>
              <Switch checked={settings.largePages} onCheckedChange={handleLargePages} />
            </div>
          </CardHeader>
          {settings.largePages && (
            <CardContent>
              <div className='flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2.5'>
                <AlertTriangle className='h-4 w-4 text-amber-500 shrink-0 mt-0.5' />
                <p className='text-xs text-amber-600 dark:text-amber-400'>
                  Требуются права администратора. Без них JVM проигнорирует этот флаг.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* GC Presets — readonly */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Пресеты аргументов GC</CardTitle>
            <CardDescription>
              Справочные пресеты. Скопируйте нужный в поле аргументов конкретной версии Java выше.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {GC_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className='rounded-lg border border-border bg-muted/20 overflow-hidden'
              >
                <div className='flex items-start justify-between gap-3 px-3 pt-3 pb-2'>
                  <div>
                    <p className='text-sm font-medium'>{preset.label}</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>{preset.description}</p>
                  </div>
                  <span className='shrink-0 text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5'>
                    {Object.keys(preset.argsPerVersion).map(v => `Java ${v}`).join(', ')}
                  </span>
                </div>
                <div className='space-y-1.5 px-3 pb-3'>
                  {Object.entries(preset.argsPerVersion).map(([version, args]) => (
                    <div key={version}>
                      <p className='text-xs text-muted-foreground mb-1'>Java {version}:</p>
                      <CodeBlock code={args} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className='flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2.5'>
              <Info className='h-4 w-4 text-blue-500 shrink-0 mt-0.5' />
              <p className='text-xs text-blue-600 dark:text-blue-400'>
                Не добавляйте <code className='rounded bg-muted px-1'>-Xms</code> / <code className='rounded bg-muted px-1'>-Xmx</code> в пресеты — они задаются через слайдеры памяти выше.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}