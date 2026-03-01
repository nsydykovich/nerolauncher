'use client'

import Link from 'next/link'
import { WindowTitleDemo } from '@/shared/ui/window-title'

export function TestView() {
	return (
		<div className='min-h-screen bg-white dark:bg-slate-950'>
			<div className='container mx-auto p-8'>
				<div className='mb-6'>
					<Link
						href='/'
						className='text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline'
					>
						← Return back
					</Link>
				</div>
				<WindowTitleDemo />
			</div>
		</div>
	)
}
