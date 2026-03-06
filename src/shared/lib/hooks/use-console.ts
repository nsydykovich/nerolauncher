'use client'

import * as React from 'react'
import type { ConsoleMessage } from '@/shared/ui/console-panel'

interface UseConsoleReturn {
  messages: ConsoleMessage[]
  isOpen: boolean
  openConsole: () => void
  closeConsole: () => void
  toggleConsole: () => void
  addMessage: (message: string, level?: ConsoleMessage['level']) => void
  clear: () => void
}

export function useConsole(): UseConsoleReturn {
  const [messages, setMessages] = React.useState<ConsoleMessage[]>([])
  const [isOpen, setIsOpen] = React.useState(false)

  const addMessage = React.useCallback((message: string, level: ConsoleMessage['level'] = 'info') => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        level,
        message,
      },
    ])
  }, [])

  const clear = React.useCallback(() => {
    setMessages([])
  }, [])

  const openConsole = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeConsole = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleConsole = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    messages,
    isOpen,
    openConsole,
    closeConsole,
    toggleConsole,
    addMessage,
    clear,
  }
}
