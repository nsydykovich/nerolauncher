'use client'

import { useEffect } from 'react'

/**
 * Listens for the Tauri 'close-requested' event.
 * If minimize_to_tray is enabled — hides the window instead of closing.
 * Otherwise — closes for real.
 */
export function useWindowClose(minimizeToTray: boolean) {
    useEffect(() => {
        let unlisten: (() => void) | undefined

        const setup = async () => {
            try {
                const { listen } = await import('@tauri-apps/api/event')
                const { getCurrentWindow } = await import('@tauri-apps/api/window')
                const win = getCurrentWindow()

                unlisten = await listen('close-requested', async () => {
                    if (minimizeToTray) {
                        await win.hide()
                    } else {
                        await win.close()
                    }
                })
            } catch {
                // not in tauri
            }
        }

        setup()
        return () => { unlisten?.() }
    }, [minimizeToTray])
}
