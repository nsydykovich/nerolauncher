'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'

interface SplashScreenProps {
  onComplete?: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = React.useState(0)
  const [fadeOut, setFadeOut] = React.useState(false)

  React.useEffect(() => {
    // Animate progress bar
    const steps = [
      { to: 30,  delay: 80  },
      { to: 60,  delay: 150 },
      { to: 80,  delay: 200 },
      { to: 95,  delay: 120 },
      { to: 100, delay: 200 },
    ]

    let current = 0
    let total = 0

    const run = (i: number) => {
      if (i >= steps.length) {
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => onComplete?.(), 400)
        }, 300)
        return
      }
      const { to, delay } = steps[i]
      const diff = to - current
      const interval = delay / diff

      let t = current
      const timer = setInterval(() => {
        t += 1
        setProgress(t)
        if (t >= to) {
          clearInterval(timer)
          current = to
          run(i + 1)
        }
      }, interval)
    }

    run(0)
  }, [onComplete])

  return (
    <div
      className={cn(
        'fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-400',
        'bg-gradient-to-br from-background via-background to-primary/10',
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
    >
      {/* Blurred glow behind icon */}
      <div className='relative flex items-center justify-center mb-8'>
        <div className='absolute h-32 w-32 rounded-full bg-primary/20 blur-3xl' />
        <div className='relative h-24 w-24 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10'>
          <Image
            src='/icon.png'
            alt='Nero Launcher'
            fill
            className='object-cover'
            priority
          />
        </div>
      </div>

      {/* App name */}
      <p className='text-xl font-semibold tracking-tight mb-8 text-foreground/90'>
        Nero Launcher
      </p>

      {/* Progress bar */}
      <div className='w-48 h-1 rounded-full bg-muted overflow-hidden'>
        <div
          className='h-full rounded-full bg-primary transition-all duration-150 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
