import * as React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider, AppThemeProvider } from '@/shared/ui/theme-provider'
import { AppTitlebar } from '@/shared/ui/app-titlebar'
import { I18nProvider } from '@/shared/lib/i18n'
import { CloseHandler } from '@/shared/ui/close-handler'
import { SplashWrapper } from '@/shared/ui/splash-screen'
import { Lexend, GeistSans, GeistMono, InterFont } from '@/shared/config/fonts'
import '@/shared/styles/globals.css'

export const metadata: Metadata = {
	title: 'Nero Launcher',
	description: 'Unofficial Minecraft Launcher built with NextJS and Tauri'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={`${Lexend.variable} ${GeistSans.variable} ${GeistMono.variable} ${InterFont.variable}`}
			suppressHydrationWarning
		>
			<body className='bg-background text-foreground'>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<AppThemeProvider>
						<I18nProvider>
							<SplashWrapper>
								<CloseHandler />
								<AppTitlebar />
								<div className='pt-9 h-screen overflow-hidden'>
									{children}
								</div>
							</SplashWrapper>
						</I18nProvider>
					</AppThemeProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
