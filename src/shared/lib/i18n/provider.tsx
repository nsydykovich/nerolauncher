'use client'

import * as React from 'react'
import en from '../../../../lang/en.json'
import ru from '../../../../lang/ru.json'

type Locale = 'en' | 'ru'
type Translations = typeof en

const LOCALES: Record<Locale, Translations> = { en, ru }

interface I18nContextValue {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

export const I18nContext = React.createContext<I18nContextValue>({
    locale: 'en',
    setLocale: () => {},
    t: (key) => key,
})

function getNestedValue(obj: Record<string, unknown>, key: string): string {
    const parts = key.split('.')
    let current: unknown = obj
    for (const part of parts) {
        if (typeof current !== 'object' || current === null) return key
        current = (current as Record<string, unknown>)[part]
    }
    return typeof current === 'string' ? current : key
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = React.useState<Locale>('en')

    React.useEffect(() => {
        const tryLoad = async () => {
            try {
                const { invoke } = await import('@tauri-apps/api/core')
                const saved = await invoke<string | null>('get_setting', { key: 'locale' })
                if (saved === 'en' || saved === 'ru') setLocaleState(saved)
            } catch {
                // not in tauri
            }
        }
        tryLoad()
    }, [])

    const setLocale = async (newLocale: Locale) => {
        setLocaleState(newLocale)
        try {
            const { invoke } = await import('@tauri-apps/api/core')
            await invoke('set_setting', { key: 'locale', value: newLocale })
        } catch {
            // not in tauri
        }
    }

    const t = (key: string) =>
        getNestedValue(LOCALES[locale] as unknown as Record<string, unknown>, key)

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}
