'use client'

import * as React from 'react'
import { Clock, Zap, FileText } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import type { Profile } from '../model/types'

interface ProfileCardProps {
  profile: Profile
  isSelected?: boolean
  onClick?: () => void
  onDelete?: () => void
}

const LOADER_COLORS: Record<Profile['modLoader'], string> = {
  vanilla: 'bg-stone-500',
  forge: 'bg-orange-600',
  fabric: 'bg-blue-600',
  neoforge: 'bg-amber-600',
  quilt: 'bg-pink-600',
  optifine: 'bg-purple-600',
  'forge-optifine': 'bg-red-600',
}

const LOADER_LABELS: Record<Profile['modLoader'], string> = {
  vanilla: 'Vanilla',
  forge: 'Forge',
  fabric: 'Fabric',
  neoforge: 'NeoForge',
  quilt: 'Quilt',
  optifine: 'OptiFine',
  'forge-optifine': 'Forge+OF',
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`

  return date.toLocaleDateString()
}

export function ProfileCard({
  profile,
  isSelected = false,
  onClick,
  onDelete,
}: ProfileCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-primary/50',
        isSelected && 'border-primary bg-primary/5',
      )}
      onClick={onClick}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-base font-semibold truncate'>{profile.name}</h3>
            <p className='text-sm text-muted-foreground mt-0.5'>
              {profile.gameVersion}
            </p>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            <Badge className={cn(LOADER_COLORS[profile.modLoader])}>
              {LOADER_LABELS[profile.modLoader]}
            </Badge>
            <Badge variant='outline'>Java {profile.javaVersion}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-2 text-sm'>
        {/* Stats row */}
        <div className='flex items-center gap-4 text-muted-foreground'>
          <div className='flex items-center gap-1.5'>
            <Clock className='h-4 w-4 opacity-60' />
            <span>{formatTime(profile.playtime)}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Zap className='h-4 w-4 opacity-60' />
            <span>{formatDate(profile.lastPlayed)}</span>
          </div>
        </div>

        {/* Notes preview */}
        {profile.notes && (
          <div className='flex items-start gap-2 text-xs'>
            <FileText className='h-4 w-4 opacity-60 shrink-0 mt-0.5' />
            <p className='text-muted-foreground line-clamp-2'>{profile.notes}</p>
          </div>
        )}

        {/* Actions */}
        {onDelete && (
          <div className='pt-2'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className='text-xs text-destructive hover:underline'
            >
              Delete
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
