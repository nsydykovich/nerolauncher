'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Settings, Home, LayoutGrid } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'

async function getWindow() {
    try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window')
        return getCurrentWindow()
    } catch {
        return null
    }
}

// ── Window control icons ───────────────────────────────────────────────────────

function IconMinimize() {
    return (
        <svg width='10' height='1' viewBox='0 0 10 1' fill='currentColor'>
            <rect width='10' height='1' />
        </svg>
    )
}

function IconMaximize() {
    return (
        <svg width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='currentColor' strokeWidth='1.2'>
            <rect x='0.6' y='0.6' width='8.8' height='8.8' rx='0.5' />
        </svg>
    )
}

function IconRestore() {
    return (
        <svg width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='currentColor' strokeWidth='1.2'>
            <rect x='2.5' y='0.5' width='7' height='7' rx='0.5' />
            <path d='M0.5 3v6.5h6.5' />
        </svg>
    )
}

function IconClose() {
    return (
        <svg width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round'>
            <line x1='1' y1='1' x2='9' y2='9' />
            <line x1='9' y1='1' x2='1' y2='9' />
        </svg>
    )
}

// ── AppTitlebar ────────────────────────────────────────────────────────────────

export function AppTitlebar() {
    const pathname = usePathname()
    const { t } = useTranslation()
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [isMaximized, setIsMaximized] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)
    const winRef = React.useRef<Awaited<ReturnType<typeof getWindow>> | null>(null)

    const NAV_ITEMS = [
        { href: '/',          label: t('nav.home'),       icon: Home       },
        { href: '/settings',  label: t('nav.settings'),   icon: Settings   },
        { href: '/test',      label: t('nav.components'), icon: LayoutGrid },
    ]

    React.useEffect(() => {
        if (!menuOpen) return
        const h = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [menuOpen])

    React.useEffect(() => {
        let unlisten: (() => void) | undefined
        getWindow().then(async (win) => {
            winRef.current = win
            if (!win) return
            setIsMaximized(await win.isMaximized())
            unlisten = await win.onResized(async () => setIsMaximized(await win.isMaximized()))
        })
        return () => { unlisten?.() }
    }, [])

    const handleMinimize = React.useCallback(async () => winRef.current?.minimize(), [])
    const handleToggleMax = React.useCallback(async () => winRef.current?.toggleMaximize(), [])
    const handleClose = React.useCallback(async () => winRef.current?.close(), [])

    return (
        <header
            className='fixed top-0 left-0 right-0 z-[9999] h-9 flex items-stretch
                       bg-sidebar border-b border-border select-none'
            style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
            {/* ── Hamburger ── */}
            <div
                ref={menuRef}
                className='relative flex items-stretch'
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
                <button
                    onClick={() => setMenuOpen(v => !v)}
                    aria-label='Menu'
                    className='flex w-9 items-center justify-center text-sidebar-foreground/70
                               hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors'
                >
                    {menuOpen
                        ? <X className='h-[15px] w-[15px]' />
                        : <Menu className='h-[15px] w-[15px]' />
                    }
                </button>

                {menuOpen && (
                    <div className='absolute top-full left-0 w-52 rounded-b-xl border border-sidebar-border
                                    bg-sidebar shadow-xl py-1 z-[9999]'>
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                                    pathname === href
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                )}
                            >
                                <Icon className='h-4 w-4 opacity-60 shrink-0' />
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Drag region + title ── */}
            <div
                className='flex flex-1 items-center px-2 min-w-0'
                data-tauri-drag-region
            >
                <span className='text-sm font-medium text-sidebar-foreground/60 truncate pointer-events-none'>
                    Nero Launcher
                </span>
            </div>

            {/* ── Window controls ── */}
            <div
                className='flex items-stretch'
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
                {/* Minimize */}
                <button
                    onClick={handleMinimize}
                    aria-label='Minimize'
                    className='flex w-11 items-center justify-center text-sidebar-foreground/60
                               hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors'
                >
                    <IconMinimize />
                </button>

                {/* Maximize / Restore */}
                <button
                    onClick={handleToggleMax}
                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                    className='flex w-11 items-center justify-center text-sidebar-foreground/60
                               hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors'
                >
                    {isMaximized ? <IconRestore /> : <IconMaximize />}
                </button>

                {/* Close */}
                <button
                    onClick={handleClose}
                    aria-label='Close'
                    className='flex w-11 items-center justify-center text-sidebar-foreground/60
                               hover:text-white hover:bg-destructive transition-colors rounded-none'
                >
                    <IconClose />
                </button>
            </div>
        </header>
    )
}
