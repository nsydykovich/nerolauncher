'use client'

import * as React from 'react'

export function CloseHandler() {
	React.useEffect(() => {
		let unlisten: (() => void) | undefined

		const setupCloseHandler = async () => {
			try {
				const { getCurrentWindow } = await import('@tauri-apps/api/window')
				const window = getCurrentWindow()
				unlisten = await window.listen('close-requested', async () => {
					// Hide window to tray instead of closing
					await window.hide()
				})
			} catch (e) {
				// Silently fail — might not be in Tauri environment
			}
		}

		setupCloseHandler()
		return () => { unlisten?.() }
	}, [])

	return null
}
