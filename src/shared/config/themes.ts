// ── Built-in preset definitions ───────────────────────────────────────────────

export const BUILTIN_PRESETS = [
    {
        id: 'default',
        label: 'Default',
        lightVariant: 'default',
        darkVariant: 'default',
    },
    {
        id: 'nord',
        label: 'Nord',
        lightVariant: 'nord-light',
        darkVariant: 'nord-dark',
    },
    {
        id: 'catppuccin',
        label: 'Catppuccin',
        lightVariant: 'catppuccin-latte',
        darkVariant: 'catppuccin-mocha',
    },
    {
        id: 'midnight',
        label: 'Midnight',
        lightVariant: 'default',
        darkVariant: 'midnight',
    },
] as const

export type BuiltinPresetId = typeof BUILTIN_PRESETS[number]['id']

// ── Accent colors ─────────────────────────────────────────────────────────────

export const ACCENT_COLORS = [
    { id: 'default', label: 'Default', color: null },
    { id: 'blue',   label: 'Blue',   color: 'oklch(0.55 0.22 250)' },
    { id: 'purple', label: 'Purple', color: 'oklch(0.55 0.25 295)' },
    { id: 'green',  label: 'Green',  color: 'oklch(0.58 0.20 145)' },
    { id: 'rose',   label: 'Rose',   color: 'oklch(0.58 0.22 10)'  },
    { id: 'orange', label: 'Orange', color: 'oklch(0.65 0.20 55)'  },
] as const

export type AccentColorId = typeof ACCENT_COLORS[number]['id']

// ── UI Density ────────────────────────────────────────────────────────────────

export const DENSITY_OPTIONS = [
    { id: 'compact',     label: 'Compact'     },
    { id: 'normal',      label: 'Normal'      },
    { id: 'comfortable', label: 'Comfortable' },
] as const

export type DensityId = typeof DENSITY_OPTIONS[number]['id']

// ── Available fonts ───────────────────────────────────────────────────────────

export const FONT_OPTIONS = [
    { id: 'geist',   label: 'Geist Sans'  },
    { id: 'lexend',  label: 'Lexend'      },
    { id: 'inter',   label: 'Inter'       },
    { id: 'mono',    label: 'Geist Mono'  },
] as const

export type FontId = typeof FONT_OPTIONS[number]['id']

// ── Custom theme shape ────────────────────────────────────────────────────────

export interface CustomTheme {
    id: string           // uuid
    name: string
    lightVariant: string // CSS class suffix, e.g. "nord-light"
    darkVariant: string
    isCustom: true
    createdAt: number    // timestamp
    data?: string        // JSON blob for export (optional)
}

// ── Active theme selection ────────────────────────────────────────────────────

export interface ThemeSelection {
    /** 'builtin:<id>' | 'custom:<uuid>' | 'custom-split' */
    mode: 'builtin' | 'custom-split'
    builtinId?: BuiltinPresetId
    /** Used when mode === 'custom-split' */
    lightVariant?: string
    darkVariant?: string
}

// ── Color scheme settings ─────────────────────────────────────────────────────

export interface ColorSchemeSettings {
    blur: boolean
    density: DensityId
    fontId: FontId
    fontSize: number    // rem multiplier ×10, e.g. 10 = 1.0rem
    scale: number       // ×10, e.g. 10 = 100%
}

export const DEFAULT_COLOR_SCHEME: ColorSchemeSettings = {
    blur: false,
    density: 'normal',
    fontId: 'geist',
    fontSize: 10,
    scale: 10,
}
