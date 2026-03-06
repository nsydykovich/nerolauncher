'use client'

import * as React from 'react'
import { Play, Download, Settings, Zap, Clock, Package } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Profile } from '@/entities/profile'
import Link from 'next/link'

interface InstanceShowcaseProps {
  instance: Profile | null
  isLaunching: boolean
  onPlay: () => void
}

export function InstanceShowcase({ instance, isLaunching, onPlay }: InstanceShowcaseProps) {
  if (!instance) {
    return (
      <Card className='p-12 text-center'>
        <Package className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
        <h3 className='text-xl font-semibold mb-2'>No Instance Selected</h3>
        <p className='text-sm text-muted-foreground mb-6'>
          Create or select an instance to get started
        </p>
        <Link href='/instances'>
          <Button>View All Instances</Button>
        </Link>
      </Card>
    )
  }

  const playtimeHours = Math.floor((instance.playtime || 0) / 3600)
  const lastPlayedDate = instance.lastPlayed
    ? new Date((instance.lastPlayed || 0) * 1000).toLocaleDateString()
    : 'Never'

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Main Instance Card */}
      <div className='lg:col-span-2'>
        <Card className='overflow-hidden border-2 border-primary/20'>
          {/* Header with gradient */}
          <div className='bg-gradient-to-r from-primary/10 to-primary/5 p-8 border-b'>
            <div className='flex items-start justify-between mb-6'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='text-5xl'>🎮</div>
                  <div>
                    <h2 className='text-3xl font-bold'>{instance.name}</h2>
                    <p className='text-sm text-muted-foreground'>Game Instance</p>
                  </div>
                </div>
              </div>
              <Link href={`/instances/${instance.id}`}>
                <Button variant='outline' size='sm'>
                  <Settings className='h-4 w-4 mr-2' />
                  Edit
                </Button>
              </Link>
            </div>

            {/* Badges */}
            <div className='flex flex-wrap gap-2'>
              <Badge variant='secondary'>
                <Zap className='h-3 w-3 mr-1' />
                {instance.gameVersion}
              </Badge>
              <Badge variant='secondary'>{instance.modLoader}</Badge>
              <Badge variant='secondary'>Java {instance.javaVersion}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className='p-8'>
            <div className='grid grid-cols-2 gap-6 mb-8'>
              {/* Playtime */}
              <div className='p-4 rounded-lg bg-muted/50'>
                <div className='flex items-center gap-2 mb-2'>
                  <Clock className='h-4 w-4 text-primary' />
                  <span className='text-sm font-medium text-muted-foreground'>Playtime</span>
                </div>
                <p className='text-2xl font-bold'>{playtimeHours}h</p>
              </div>

              {/* Last Played */}
              <div className='p-4 rounded-lg bg-muted/50'>
                <div className='flex items-center gap-2 mb-2'>
                  <Zap className='h-4 w-4 text-primary' />
                  <span className='text-sm font-medium text-muted-foreground'>Last Played</span>
                </div>
                <p className='text-lg font-semibold'>{lastPlayedDate}</p>
              </div>
            </div>

            {/* Play Button */}
            <Button
              size='lg'
              className='w-full h-12 text-lg font-semibold'
              onClick={onPlay}
              disabled={isLaunching}
            >
              <Play className='h-5 w-5 mr-2' fill='currentColor' />
              {isLaunching ? 'Launching...' : 'Play Now'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats Panel */}
      <div className='space-y-4'>
        <Card className='p-6'>
          <h3 className='font-semibold mb-4 flex items-center gap-2'>
            <Package className='h-4 w-4' />
            Instance Info
          </h3>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Version</span>
              <span className='font-medium'>{instance.gameVersion}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Mod Loader</span>
              <span className='font-medium'>{instance.modLoader}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Java Version</span>
              <span className='font-medium'>Java {instance.javaVersion}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Game Dir</span>
              <span className='font-medium truncate text-right'>{instance.gameDir}</span>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='font-semibold mb-4'>Quick Actions</h3>
          <div className='space-y-2'>
            <Link href={`/instances/${instance.id}`} className='block'>
              <Button variant='outline' className='w-full justify-start'>
                <Settings className='h-4 w-4 mr-2' />
                Settings
              </Button>
            </Link>
            <Button variant='outline' className='w-full justify-start'>
              <Download className='h-4 w-4 mr-2' />
              Download Resources
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
