'use client'

import { useContext } from 'react'
import { I18nContext } from './provider'

export function useTranslation() {
    return useContext(I18nContext)
}
