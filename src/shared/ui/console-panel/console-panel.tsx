'use client'

import * as React from 'react'
import { X, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

export interface ConsoleMessage {
  id: string
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
}

interface ConsolePanelProps {
  isOpen: boolean
  onClose: () => void
  messages: ConsoleMessage[]
  onClear: () => void
  autoScroll?: boolean
}

export const ConsolePanel = React.forwardRef<HTMLDivElement, ConsolePanelProps>(
  ({ isOpen, onClose, messages, onClear, autoScroll = true }, ref) => {
    const bottomRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (autoScroll && bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, [messages, autoScroll])

    if (!isOpen) return null

    const handleCopyAll = () => {
      const text = messages
        .map((m) => `[${m.timestamp.toLocaleTimeString()}] ${m.message}`)
        .join('\n')
      navigator.clipboard.writeText(text)
    }

    return (
      <div
        ref={ref}
        className='fixed bottom-0 left-0 right-0 h-64 bg-background border-t border-border/50 flex flex-col z-50 shadow-xl'
      >
        {/* Header */}
        <div className='flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30'>
          <h3 className='text-sm font-semibold'>Launch Console</h3>
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={handleCopyAll}
              title='Copy all'
            >
              <Copy className='h-3 w-3' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={onClear}
              title='Clear'
            >
              <Trash2 className='h-3 w-3' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={onClose}
              title='Close'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto px-4 py-2 font-mono text-xs bg-black/50'>
          {messages.length === 0 ? (
            <p className='text-muted-foreground'>Console ready. Launch Minecraft to see logs...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'py-0.5',
                  msg.level === 'error' && 'text-red-400',
                  msg.level === 'warn' && 'text-yellow-400',
                  msg.level === 'success' && 'text-green-400',
                  msg.level === 'info' && 'text-gray-300',
                )}
              >
                <span className='text-gray-500'>[{msg.timestamp.toLocaleTimeString()}]</span>{' '}
                {msg.message}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    )
  },
)

ConsolePanel.displayName = 'ConsolePanel'
