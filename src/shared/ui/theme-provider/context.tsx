'use client'

import { createContext, useContext } from 'react'
import type {
    AccentColorId,
    BuiltinPresetId,
    ColorSchemeSettings,
    CustomTheme,
    ThemeSelection,
} from '@/shared/config/themes'
import { DEFAULT_COLOR_SCHEME } from '@/shared/config/themes'

export interface AppThemeContextValue {
    // Active theme selection
    themeSelection: ThemeSelection
    setThemeSelection: (sel: ThemeSelection) => void

    // Accent
    accentColor: AccentColorId
    setAccentColor: (color: AccentColorId) => void

    // Custom themes CRUD
    customThemes: CustomTheme[]
    saveCustomTheme: (theme: CustomTheme) => Promise<void>
    deleteCustomTheme: (id: string) => Promise<void>
    renameCustomTheme: (id: string, newName: string) => Promise<void>
    checkNameExists: (name: string, excludeId?: string) => Promise<boolean>
    reloadCustomThemes: () => Promise<void>

    // Color Scheme
    colorScheme: ColorSchemeSettings
    setColorScheme: (cs: Partial<ColorSchemeSettings>) => void

    // Tray / close behaviour
    minimizeToTray: boolean
    setMinimizeToTray: (v: boolean) => void
}

export const AppThemeContext = createContext<AppThemeContextValue>({
    themeSelection: { mode: 'builtin', builtinId: 'default' },
    setThemeSelection: () => {},
    accentColor: 'default',
    setAccentColor: () => {},
    customThemes: [],
    saveCustomTheme: async () => {},
    deleteCustomTheme: async () => {},
    renameCustomTheme: async () => {},
    checkNameExists: async () => false,
    reloadCustomThemes: async () => {},
    colorScheme: DEFAULT_COLOR_SCHEME,
    setColorScheme: () => {},
    minimizeToTray: false,
    setMinimizeToTray: () => {},
})

export const useAppTheme = () => useContext(AppThemeContext)
