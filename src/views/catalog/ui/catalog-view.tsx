'use client'

import * as React from 'react'

export function CatalogView() {
  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Header */}
      <div className='flex-shrink-0 border-b border-border px-6 py-4'>
        <h1 className='text-2xl font-bold'>Catalog</h1>
        <p className='text-sm text-muted-foreground mt-1'>Browse and install mods, shaders, and resource packs</p>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto px-6 py-6 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Coming soon...</p>
        </div>
      </div>
    </div>
  )
}
