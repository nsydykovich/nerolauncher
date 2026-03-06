'use client'

import * as React from 'react'
import { SplashScreen } from './splash-screen'

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false)

  return (
    <>
      {!ready && <SplashScreen onComplete={() => setReady(true)} />}
      <div className={ready ? 'contents' : 'invisible'}>
        {children}
      </div>
    </>
  )
}
