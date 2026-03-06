'use client'

import * as React from 'react'
import { useAppTheme } from '@/shared/ui/theme-provider'
import { useTranslation } from '@/shared/lib/i18n'
import { BUILTIN_PRESETS, ACCENT_COLORS, BUILTIN_PRESETS as BP } from '@/shared/config/themes'
import type { CustomTheme, BuiltinPresetId } from '@/shared/config/themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'
import { MoreHorizontal, Plus, Upload, Download, Trash2, Check } from 'lucide-react'

// ── Theme Card ─────────────────────────────────────────────────────────────────

function ThemeCard({
    label, isActive, isCustom, onSelect, onExport, onDelete, exportLabel, deleteLabel,
}: {
    label: string
    isActive: boolean
    isCustom?: boolean
    onSelect: () => void
    onExport?: () => void
    onDelete?: () => void
    exportLabel: string
    deleteLabel: string
}) {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!menuOpen) return
        const h = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [menuOpen])

    return (
        <div
            onClick={onSelect}
            className={cn(
                'relative rounded-xl border-2 p-4 cursor-pointer transition-all select-none',
                isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40 hover:bg-accent/30',
            )}
        >
            {/* Mini preview */}
            <div className='mb-3 h-14 rounded-lg overflow-hidden flex'>
                <div className='flex-1 bg-background border-r border-border flex flex-col gap-1 p-1.5'>
                    <div className='h-1.5 w-8 rounded-full bg-muted-foreground/20' />
                    <div className='h-1.5 w-12 rounded-full bg-primary/40' />
                    <div className='h-1.5 w-6 rounded-full bg-muted-foreground/20' />
                </div>
                <div className='flex-[2] bg-background p-1.5 flex flex-col gap-1'>
                    <div className='h-1.5 w-16 rounded-full bg-muted-foreground/20' />
                    <div className='h-1.5 w-10 rounded-full bg-muted-foreground/10' />
                </div>
            </div>

            <div className='flex items-center justify-between gap-1'>
                <span className='text-sm font-medium truncate'>{label}</span>
                <div className='flex items-center gap-1 shrink-0'>
                    {isActive && <Check className='h-4 w-4 text-primary' />}
                    {isCustom && (
                        <div ref={menuRef} className='relative'>
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }}
                                className='rounded p-0.5 hover:bg-accent transition-colors'
                            >
                                <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
                            </button>
                            {menuOpen && (
                                <div className='absolute right-0 top-full mt-1 z-50 w-36 rounded-lg border border-border bg-popover shadow-lg py-1'>
                                    {onExport && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onExport() }}
                                            className='flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors'
                                        >
                                            <Download className='h-3.5 w-3.5' /> {exportLabel}
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete() }}
                                            className='flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors'
                                        >
                                            <Trash2 className='h-3.5 w-3.5' /> {deleteLabel}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Save Dialog ────────────────────────────────────────────────────────────────

function SaveDialog({
    onSave, onCancel, checkExists,
    titleLabel, placeholderLabel, cancelLabel, saveLabel, replaceMsg,
}: {
    onSave: (name: string) => Promise<void>
    onCancel: () => void
    checkExists: (name: string) => Promise<boolean>
    titleLabel: string
    placeholderLabel: string
    cancelLabel: string
    saveLabel: string
    replaceMsg: (name: string) => string
}) {
    const [name, setName] = React.useState('')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSave = async () => {
        const trimmed = name.trim()
        if (!trimmed) { setError('Required'); return }
        setLoading(true)
        const exists = await checkExists(trimmed)
        if (exists && !confirm(replaceMsg(trimmed))) { setLoading(false); return }
        await onSave(trimmed)
        setLoading(false)
    }

    return (
        <div className='fixed inset-0 z-[9998] flex items-center justify-center bg-black/50'>
            <div className='w-80 rounded-xl border border-border bg-card p-6 shadow-2xl'>
                <h3 className='text-base font-semibold mb-4'>{titleLabel}</h3>
                <input
                    autoFocus
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError('') }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                    placeholder={placeholderLabel}
                    className='w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring mb-1'
                />
                {error && <p className='text-xs text-destructive mb-2'>{error}</p>}
                <div className='flex justify-end gap-2 mt-4'>
                    <Button variant='ghost' size='sm' onClick={onCancel}>{cancelLabel}</Button>
                    <Button size='sm' loading={loading} onClick={handleSave}>{saveLabel}</Button>
                </div>
            </div>
        </div>
    )
}

// ── Main ThemeTab ──────────────────────────────────────────────────────────────

export function ThemeTab() {
    const { t } = useTranslation()
    const {
        themeSelection, setThemeSelection,
        accentColor, setAccentColor,
        customThemes, saveCustomTheme, deleteCustomTheme, checkNameExists,
    } = useAppTheme()

    const [mounted, setMounted] = React.useState(false)
    const [showSaveDialog, setShowSaveDialog] = React.useState(false)
    const [customSplitLight, setCustomSplitLight] = React.useState('default')
    const [customSplitDark, setCustomSplitDark] = React.useState('midnight')

    React.useEffect(() => {
        setMounted(true)
        if (themeSelection.mode === 'custom-split') {
            setCustomSplitLight(themeSelection.lightVariant ?? 'default')
            setCustomSplitDark(themeSelection.darkVariant ?? 'midnight')
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const isBuiltinActive = (id: BuiltinPresetId) =>
        mounted && themeSelection.mode === 'builtin' && themeSelection.builtinId === id
    const isCustomSplitActive = mounted && themeSelection.mode === 'custom-split'

    const handleExport = (theme: CustomTheme) => {
        const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `${theme.name}.theme.json`
        a.click(); URL.revokeObjectURL(url)
    }

    const handleImport = () => {
        const input = document.createElement('input')
        input.type = 'file'; input.accept = '.json'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return
            try {
                const theme = JSON.parse(await file.text()) as CustomTheme
                if (!theme.name || !theme.lightVariant || !theme.darkVariant) throw new Error()
                const exists = await checkNameExists(theme.name)
                const msg = t('appearance.theme.replaceConfirm').replace('{name}', theme.name)
                if (exists && !confirm(msg)) return
                await saveCustomTheme({ ...theme, isCustom: true })
            } catch {
                alert(t('appearance.theme.importError'))
            }
        }
        input.click()
    }

    const handleSave = async (name: string) => {
        const light = themeSelection.mode === 'builtin'
            ? (BUILTIN_PRESETS.find(p => p.id === themeSelection.builtinId)?.lightVariant ?? 'default')
            : (themeSelection.lightVariant ?? 'default')
        const dark = themeSelection.mode === 'builtin'
            ? (BUILTIN_PRESETS.find(p => p.id === themeSelection.builtinId)?.darkVariant ?? 'default')
            : (themeSelection.darkVariant ?? 'default')
        await saveCustomTheme({
            id: crypto.randomUUID(), name, lightVariant: light, darkVariant: dark,
            isCustom: true, createdAt: Date.now(), data: JSON.stringify({ lightVariant: light, darkVariant: dark }),
        })
        setShowSaveDialog(false)
    }

    const allVariants = [
        { id: 'default', label: 'Default' },
        ...BP.flatMap(p => [
            { id: p.lightVariant, label: `${p.label} Light` },
            p.darkVariant !== p.lightVariant ? { id: p.darkVariant, label: `${p.label} Dark` } : null,
        ]).filter(Boolean) as { id: string; label: string }[],
    ].filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i)

    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-base font-semibold'>{t('appearance.theme.title')}</h3>
                    <p className='text-sm text-muted-foreground'>{t('appearance.theme.description')}</p>
                </div>
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={handleImport}>
                        <Upload className='h-3.5 w-3.5 mr-1.5' />
                        {t('appearance.theme.import')}
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => setShowSaveDialog(true)}>
                        <Plus className='h-3.5 w-3.5 mr-1.5' />
                        {t('appearance.theme.saveCurrent')}
                    </Button>
                </div>
            </div>

            {/* Built-in presets */}
            <div>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                    {t('appearance.theme.builtin')}
                </p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {BUILTIN_PRESETS.map((preset) => (
                        <ThemeCard
                            key={preset.id}
                            label={preset.label}
                            isActive={isBuiltinActive(preset.id)}
                            onSelect={() => setThemeSelection({ mode: 'builtin', builtinId: preset.id })}
                            exportLabel={t('appearance.theme.export')}
                            deleteLabel={t('appearance.theme.delete')}
                        />
                    ))}
                    <ThemeCard
                        label={t('appearance.theme.customSplit')}
                        isActive={isCustomSplitActive}
                        onSelect={() => setThemeSelection({
                            mode: 'custom-split',
                            lightVariant: customSplitLight,
                            darkVariant: customSplitDark,
                        })}
                        exportLabel={t('appearance.theme.export')}
                        deleteLabel={t('appearance.theme.delete')}
                    />
                </div>
            </div>

            {/* Custom split selector */}
            {isCustomSplitActive && (
                <Card variant='outline'>
                    <CardHeader>
                        <CardTitle className='text-sm'>{t('appearance.theme.customSplitTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-3'>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className='text-xs text-muted-foreground mb-1 block'>
                                    {t('appearance.theme.lightMode')}
                                </label>
                                <select
                                    value={customSplitLight}
                                    onChange={(e) => setCustomSplitLight(e.target.value)}
                                    className='w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm'
                                >
                                    {allVariants.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className='flex-1'>
                                <label className='text-xs text-muted-foreground mb-1 block'>
                                    {t('appearance.theme.darkMode')}
                                </label>
                                <select
                                    value={customSplitDark}
                                    onChange={(e) => setCustomSplitDark(e.target.value)}
                                    className='w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm'
                                >
                                    {allVariants.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <Button size='sm' className='self-start' onClick={() =>
                            setThemeSelection({ mode: 'custom-split', lightVariant: customSplitLight, darkVariant: customSplitDark })
                        }>
                            {t('appearance.theme.apply')}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* User themes */}
            {customThemes.length > 0 && (
                <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                        {t('appearance.theme.yourThemes')}
                    </p>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                        {customThemes.map((theme) => (
                            <ThemeCard
                                key={theme.id}
                                label={theme.name}
                                isActive={mounted && themeSelection.mode === 'custom-split' &&
                                    themeSelection.lightVariant === theme.lightVariant &&
                                    themeSelection.darkVariant === theme.darkVariant}
                                isCustom
                                onSelect={() => setThemeSelection({
                                    mode: 'custom-split',
                                    lightVariant: theme.lightVariant,
                                    darkVariant: theme.darkVariant,
                                })}
                                onExport={() => handleExport(theme)}
                                onDelete={async () => {
                                    const msg = t('appearance.theme.deleteConfirm').replace('{name}', theme.name)
                                    if (confirm(msg)) await deleteCustomTheme(theme.id)
                                }}
                                exportLabel={t('appearance.theme.export')}
                                deleteLabel={t('appearance.theme.delete')}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Accent color */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-sm'>{t('appearance.theme.accentColor')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-wrap gap-2'>
                        {ACCENT_COLORS.map((accent) => (
                            <button
                                key={accent.id}
                                onClick={() => setAccentColor(accent.id)}
                                title={accent.id === 'default' ? t('appearance.theme.accentDefault') : accent.label}
                                className={cn(
                                    'flex h-8 items-center gap-2 rounded-full border-2 px-3 text-xs font-medium transition-all',
                                    mounted && accentColor === accent.id
                                        ? 'border-foreground scale-105 shadow-sm'
                                        : 'border-transparent hover:border-muted-foreground/40',
                                )}
                            >
                                {accent.color ? (
                                    <span className='block h-3.5 w-3.5 rounded-full shrink-0' style={{ backgroundColor: accent.color }} />
                                ) : (
                                    <span className='block h-3.5 w-3.5 rounded-full shrink-0 bg-gradient-to-br from-primary to-primary/50' />
                                )}
                                {accent.id === 'default' ? t('appearance.theme.accentDefault') : accent.label}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {showSaveDialog && (
                <SaveDialog
                    onSave={handleSave}
                    onCancel={() => setShowSaveDialog(false)}
                    checkExists={checkNameExists}
                    titleLabel={t('appearance.theme.saveTheme')}
                    placeholderLabel={t('appearance.theme.themeName')}
                    cancelLabel={t('appearance.theme.cancel')}
                    saveLabel={t('appearance.theme.save')}
                    replaceMsg={(name) => t('appearance.theme.replaceConfirm').replace('{name}', name)}
                />
            )}
        </div>
    )
}
