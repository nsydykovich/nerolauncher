'use client'

import * as React from 'react'
import { AppThemeContext } from './context'
import type {
    AccentColorId,
    ColorSchemeSettings,
    CustomTheme,
    ThemeSelection,
} from '@/shared/config/themes'
import { BUILTIN_PRESETS, DEFAULT_COLOR_SCHEME } from '@/shared/config/themes'

// ── Tauri helpers ─────────────────────────────────────────────────────────────

async function tauriInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
    try {
        const { invoke } = await import('@tauri-apps/api/core')
        return await invoke<T>(cmd, args)
    } catch {
        return null
    }
}

async function loadAllSettings(): Promise<Record<string, string>> {
    return (await tauriInvoke<Record<string, string>>('get_all_settings')) ?? {}
}

async function saveSetting(key: string, value: string) {
    await tauriInvoke('set_setting', { key, value })
}

// ── CSS application ────────────────────────────────────────────────────────────

let applying = false

function applyThemeClasses(
    selection: ThemeSelection,
    accentColor: AccentColorId,
    isDark: boolean,
) {
    applying = true
    const root = document.documentElement

    // Remove all theme/accent/density/scale classes
    const remove: string[] = []
    root.classList.forEach((cls) => {
        if (
            cls.startsWith('preset-') ||
            cls.startsWith('accent-') ||
            cls.startsWith('density-') ||
            cls.startsWith('scale-')
        ) remove.push(cls)
    })
    remove.forEach((c) => root.classList.remove(c))

    // Resolve variant
    let variant: string
    if (selection.mode === 'builtin' && selection.builtinId) {
        const preset = BUILTIN_PRESETS.find((p) => p.id === selection.builtinId)
        variant = preset ? (isDark ? preset.darkVariant : preset.lightVariant) : 'default'
    } else if (selection.mode === 'custom-split') {
        variant = isDark ? (selection.darkVariant ?? 'default') : (selection.lightVariant ?? 'default')
    } else {
        variant = 'default'
    }
    if (variant !== 'default') root.classList.add(`preset-${variant}`)

    // Accent
    if (accentColor !== 'default') root.classList.add(`accent-${accentColor}`)

    queueMicrotask(() => { applying = false })
}

// Maps fontId → CSS font-family value using Next.js CSS variables loaded in layout
const FONT_FAMILY_MAP: Record<string, string> = {
    geist:  'var(--font-geist-sans), sans-serif',
    lexend: 'var(--font-lexend), sans-serif',
    inter:  'var(--font-inter), sans-serif',
    mono:   'var(--font-geist-mono), monospace',
}

function applyColorScheme(cs: ColorSchemeSettings) {
    const root = document.documentElement
    // Density
    root.classList.remove('density-compact', 'density-normal', 'density-comfortable')
    root.classList.add(`density-${cs.density}`)
    // Scale
    root.style.setProperty('--ui-scale', String(cs.scale / 10))
    // Font size base
    root.style.setProperty('--font-size-base', `${cs.fontSize / 10}rem`)
    // Blur
    root.style.setProperty('--ui-blur', cs.blur ? '12px' : '0px')
    // Font family — set --active-font which @theme inline --font-sans points to
    const fontFamily = FONT_FAMILY_MAP[cs.fontId] ?? FONT_FAMILY_MAP.geist
    root.style.setProperty('--active-font', fontFamily)
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeSelection, setThemeSelectionState] = React.useState<ThemeSelection>({
        mode: 'builtin',
        builtinId: 'default',
    })
    const [accentColor, setAccentColorState] = React.useState<AccentColorId>('default')
    const [customThemes, setCustomThemes] = React.useState<CustomTheme[]>([])
    const [colorScheme, setColorSchemeState] = React.useState<ColorSchemeSettings>(DEFAULT_COLOR_SCHEME)
    const [minimizeToTray, setMinimizeToTrayState] = React.useState(false)

    const stateRef = React.useRef({ themeSelection, accentColor })
    stateRef.current = { themeSelection, accentColor }

    // Load on mount
    React.useEffect(() => {
        const init = async () => {
            const settings = await loadAllSettings()

            const sel: ThemeSelection = settings['theme_selection']
                ? JSON.parse(settings['theme_selection'])
                : { mode: 'builtin', builtinId: 'default' }

            const accent = (settings['accent_color'] as AccentColorId) || 'default'
            const cs: ColorSchemeSettings = settings['color_scheme']
                ? JSON.parse(settings['color_scheme'])
                : DEFAULT_COLOR_SCHEME
            const mtt = settings['minimize_to_tray'] === 'true'

            setThemeSelectionState(sel)
            setAccentColorState(accent)
            setColorSchemeState(cs)
            setMinimizeToTrayState(mtt)

            const isDark = document.documentElement.classList.contains('dark')
            applyThemeClasses(sel, accent, isDark)
            applyColorScheme(cs)

            // Load custom themes
            const themes = await tauriInvoke<CustomTheme[]>('list_custom_themes')
            if (themes) setCustomThemes(themes)
        }
        init()
    }, [])

    // Observe dark/light toggle
    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            if (applying) return
            const isDark = document.documentElement.classList.contains('dark')
            applyThemeClasses(stateRef.current.themeSelection, stateRef.current.accentColor, isDark)
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])

    // ── Actions ───────────────────────────────────────────────────────────────

    const setThemeSelection = (sel: ThemeSelection) => {
        setThemeSelectionState(sel)
        saveSetting('theme_selection', JSON.stringify(sel))
        const isDark = document.documentElement.classList.contains('dark')
        applyThemeClasses(sel, stateRef.current.accentColor, isDark)
    }

    const setAccentColor = (color: AccentColorId) => {
        setAccentColorState(color)
        saveSetting('accent_color', color)
        const isDark = document.documentElement.classList.contains('dark')
        applyThemeClasses(stateRef.current.themeSelection, color, isDark)
    }

    const setColorScheme = (partial: Partial<ColorSchemeSettings>) => {
        setColorSchemeState((prev) => {
            const next = { ...prev, ...partial }
            saveSetting('color_scheme', JSON.stringify(next))
            applyColorScheme(next)
            return next
        })
    }

    const setMinimizeToTray = (v: boolean) => {
        setMinimizeToTrayState(v)
        saveSetting('minimize_to_tray', String(v))
    }

    const reloadCustomThemes = async () => {
        const themes = await tauriInvoke<CustomTheme[]>('list_custom_themes')
        if (themes) setCustomThemes(themes)
    }

    const saveCustomTheme = async (theme: CustomTheme) => {
        await tauriInvoke('save_custom_theme', { theme })
        await reloadCustomThemes()
    }

    const deleteCustomTheme = async (id: string) => {
        await tauriInvoke('delete_custom_theme', { id })
        await reloadCustomThemes()
    }

    const renameCustomTheme = async (id: string, newName: string) => {
        await tauriInvoke('rename_custom_theme', { id, newName })
        await reloadCustomThemes()
    }

    const checkNameExists = async (name: string, excludeId?: string): Promise<boolean> => {
        return (await tauriInvoke<boolean>('theme_name_exists', { name, excludeId })) ?? false
    }

    return (
        <AppThemeContext.Provider
            value={{
                themeSelection, setThemeSelection,
                accentColor, setAccentColor,
                customThemes, saveCustomTheme, deleteCustomTheme, renameCustomTheme,
                checkNameExists, reloadCustomThemes,
                colorScheme, setColorScheme,
                minimizeToTray, setMinimizeToTray,
            }}
        >
            {children}
        </AppThemeContext.Provider>
    )
}
