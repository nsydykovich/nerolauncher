'use client'

import * as React from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { ProfilesView } from '@/views/profiles'

export default function ProfilesPage() {
  const { t } = useTranslation()
  return <ProfilesView />
}
