'use client'

import React from 'react'
import { WindowTitle } from './window-title'
import { WindowControls } from './window-controls'
import { WindowProvider } from './context'

export function WindowTitleDemo() {
	return (
		<WindowProvider>
			<div className='w-full space-y-6 bg-slate-50 dark:bg-slate-950 p-8 rounded-lg'>
				<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-8'>
					Window Title Components
				</h2>

				{/* Variant Examples */}
				<div className='space-y-4'>
					<h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase'>
						Variants
					</h3>

					{/* Default */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Default Window'
								subtitle='This is a default window title'
								variant='default'
							/>
							<WindowControls
								onMinimize={() => console.log('Minimized')}
								onMaximize={() => console.log('Maximized')}
								onClose={() => console.log('Closed')}
								size='md'
							/>
						</div>
					</div>

					{/* Primary */}
					<div className='rounded border border-blue-300 dark:border-blue-700 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Primary Window'
								subtitle='This is a primary window title'
								variant='primary'
							/>
							<WindowControls
								onMinimize={() => console.log('Minimized')}
								onMaximize={() => console.log('Maximized')}
								onClose={() => console.log('Closed')}
								size='md'
							/>
						</div>
					</div>

					{/* Secondary */}
					<div className='rounded border border-slate-300 dark:border-slate-600 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Secondary Window'
								subtitle='This is a secondary window title'
								variant='secondary'
							/>
							<WindowControls
								onMinimize={() => console.log('Minimized')}
								onMaximize={() => console.log('Maximized')}
								onClose={() => console.log('Closed')}
								size='md'
							/>
						</div>
					</div>

					{/* Glass */}
					<div className='rounded border border-slate-200/30 dark:border-slate-700/30 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Glass Effect Window'
								subtitle='This window has a glass effect'
								variant='glass'
							/>
							<WindowControls
								onMinimize={() => console.log('Minimized')}
								onMaximize={() => console.log('Maximized')}
								onClose={() => console.log('Closed')}
								size='md'
							/>
						</div>
					</div>
				</div>

				{/* Size Examples */}
				<div className='space-y-4'>
					<h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase'>
						Sizes
					</h3>

					{/* Small */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Small Window'
								size='sm'
								variant='default'
							/>
							<WindowControls size='sm' />
						</div>
					</div>

					{/* Medium (Default) */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Medium Window (Default)'
								size='md'
								variant='default'
							/>
							<WindowControls size='md' />
						</div>
					</div>

					{/* Large */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Large Window'
								size='lg'
								variant='default'
							/>
							<WindowControls size='lg' />
						</div>
					</div>
				</div>

				{/* Padding Examples */}
				<div className='space-y-4'>
					<h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase'>
						Padding Options
					</h3>

					{/* Compact */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Compact Padding'
								padding='compact'
								variant='default'
							/>
							<WindowControls gap='tight' />
						</div>
					</div>

					{/* Normal */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Normal Padding'
								padding='normal'
								variant='default'
							/>
							<WindowControls gap='normal' />
						</div>
					</div>

					{/* Loose */}
					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Loose Padding'
								padding='loose'
								variant='default'
							/>
							<WindowControls gap='loose' />
						</div>
					</div>
				</div>

				{/* Complete Window Example */}
				<div className='space-y-4'>
					<h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase'>
						Complete Example
					</h3>

					<div className='rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg'>
						<div className='flex items-center justify-between'>
							<WindowTitle
								title='Nero Launcher'
								subtitle='Minecraft Launcher'
								variant='primary'
								size='md'
							/>
							<WindowControls
								size='md'
								onMinimize={() => alert('Minimize clicked')}
								onMaximize={() => alert('Maximize clicked')}
								onClose={() => alert('Close clicked')}
							/>
						</div>
						<div className='p-4 bg-white dark:bg-slate-900'>
							<p className='text-sm text-slate-600 dark:text-slate-400'>
								This is the content area of the window
							</p>
						</div>
					</div>
				</div>

				{/* Button Variants */}
				<div className='space-y-4'>
					<h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase'>
						Control Buttons
					</h3>

					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle title='All Controls Visible' variant='default' />
							<WindowControls
								showMinimize={true}
								showMaximize={true}
								showClose={true}
								size='md'
							/>
						</div>
					</div>

					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle title='Only Minimize and Close' variant='default' />
							<WindowControls
								showMinimize={true}
								showMaximize={false}
								showClose={true}
								size='md'
							/>
						</div>
					</div>

					<div className='rounded border border-slate-200 dark:border-slate-800 overflow-hidden'>
						<div className='flex items-center justify-between'>
							<WindowTitle title='Only Close Button' variant='default' />
							<WindowControls
								showMinimize={false}
								showMaximize={false}
								showClose={true}
								size='md'
							/>
						</div>
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}
