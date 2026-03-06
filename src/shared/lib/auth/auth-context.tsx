'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface Account {
  id: string
  username: string
  uuid: string
  accessToken: string
  accountType: 'microsoft' | 'offline'
  expiresAt?: number
}

interface AuthContextType {
  activeAccount: Account | null
  accounts: Account[]
  setActiveAccount: (account: Account | null) => void
  addAccount: (account: Account) => void
  removeAccount: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default/stub account for testing (Offline mode)
const DEFAULT_ACCOUNT: Account = {
  id: 'offline-steve',
  username: 'Steve',
  uuid: 'ffffffffffffffffffffffffffffffff', // Offline mode UUID (all F's)
  accessToken: '', // Offline mode doesn't use tokens
  accountType: 'offline',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<Account | null>(DEFAULT_ACCOUNT)
  const [accounts, setAccounts] = useState<Account[]>([DEFAULT_ACCOUNT])

  const addAccount = useCallback((account: Account) => {
    setAccounts((prev) => {
      // Avoid duplicates
      if (prev.some((a) => a.id === account.id)) {
        return prev
      }
      return [...prev, account]
    })
  }, [])

  const removeAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    // If removed account was active, switch to first available
    if (activeAccount?.id === id) {
      setActiveAccount(accounts[0] || null)
    }
  }, [activeAccount, accounts])

  return (
    <AuthContext.Provider
      value={{
        activeAccount,
        accounts,
        setActiveAccount,
        addAccount,
        removeAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
