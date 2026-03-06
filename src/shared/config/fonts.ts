import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

export const Lexend = localFont({
	src: '../assets/fonts/lexend/lexend.woff2',
	variable: '--font-lexend',
	preload: true,
	display: 'swap',
})

export const GeistSans = localFont({
	src: '../assets/fonts/geist/geist-sans.woff2',
	variable: '--font-geist-sans',
	preload: true,
	display: 'swap',
})

export const GeistMono = localFont({
	src: '../assets/fonts/geist/geist-mono.woff2',
	variable: '--font-geist-mono',
	preload: true,
	display: 'swap',
})

// Inter — currently loaded from Google Fonts (requires internet).
// To switch to local: place inter.woff2 in src/shared/assets/fonts/inter/
// and replace with localFont({ src: '../assets/fonts/inter/inter.woff2', ... })
export const InterFont = Inter({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-inter',
	display: 'swap',
})
