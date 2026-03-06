'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { CatalogView } from '@/views/catalog'

export default function CatalogPage() {
  const { t } = useTranslation()
  return <CatalogView />
}
