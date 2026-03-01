'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface WindowContextType {
	isMaximized: boolean
	isFocused: boolean
	isDragging: boolean
	setIsMaximized: (value: boolean) => void
	setIsFocused: (value: boolean) => void
	setIsDragging: (value: boolean) => void
}

const WindowContext = createContext<WindowContextType | undefined>(undefined)

export function WindowProvider({ children }: { children: React.ReactNode }) {
	const [isMaximized, setIsMaximized] = useState(false)
	const [isFocused, setIsFocused] = useState(true)
	const [isDragging, setIsDragging] = useState(false)

	const value: WindowContextType = {
		isMaximized,
		isFocused,
		isDragging,
		setIsMaximized,
		setIsFocused,
		setIsDragging
	}

	return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}

export function useWindowContext() {
	const context = useContext(WindowContext)
	if (!context) {
		throw new Error('useWindowContext must be used within WindowProvider')
	}
	return context
}
