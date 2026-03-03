'use client'

import * as React from 'react'
import { Card, CardHeader, CardContent } from '@/shared/ui/card'
import { Input, Label } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { Badge } from '@/shared/ui/badge'
import type { JavaVersionNumber } from '../model/types'

interface JavaVersionCardProps {
  version: JavaVersionNumber
  path: string
  isActive: boolean
  onPathChange: (version: JavaVersionNumber, path: string) => void
  onActivate: (version: JavaVersionNumber) => void
  onBrowse: (version: JavaVersionNumber) => void
  pathPlaceholder: string
  activeLabel: string
  browseLabel: string
  pathLabel: string
}

export function JavaVersionCard({
  version,
  path,
  isActive,
  onPathChange,
  onActivate,
  onBrowse,
  pathPlaceholder,
  activeLabel,
  browseLabel,
  pathLabel,
}: JavaVersionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-base font-semibold'>Java {version}</h3>
          </div>
          <div className='flex items-center gap-3'>
            {isActive && <Badge variant='default'>{activeLabel}</Badge>}
            <Switch checked={isActive} onCheckedChange={() => onActivate(version)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div>
            <Label className='text-sm'>{pathLabel}</Label>
            <div className='mt-2 flex gap-2'>
              <Input
                type='text'
                placeholder={pathPlaceholder}
                value={path}
                onChange={(e) => onPathChange(version, e.target.value)}
                className='flex-1'
              />
              <Button variant='outline' size='sm' onClick={() => onBrowse(version)}>
                {browseLabel}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
