'use client'

import React, { forwardRef } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { Minus, Square, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
	windowTitleButtonVariants,
	windowControlsContainerVariants
} from '@/shared/config/window-title'
import { useWindowContext } from './context'

interface WindowControlButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof windowTitleButtonVariants> {
	icon?: React.ReactNode
	tooltip?: string
}

export const WindowControlButton = forwardRef<HTMLButtonElement, WindowControlButtonProps>(
	({ variant, size, icon, tooltip, className, ...props }, ref) => {
		const [showTooltip, setShowTooltip] = React.useState(false)

		return (
			<div className='relative group'>
				<button
					ref={ref}
					className={cn(windowTitleButtonVariants({ variant, size }), className)}
					title={tooltip}
					onMouseEnter={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
					{...props}
				>
					{icon}
				</button>
				{tooltip && showTooltip && (
					<div className='absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white dark:bg-slate-100 dark:text-slate-900 z-50'>
						{tooltip}
					</div>
				)}
			</div>
		)
	}
)

WindowControlButton.displayName = 'WindowControlButton'

interface WindowControlsProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof windowControlsContainerVariants> {
	onMinimize?: () => void
	onMaximize?: () => void
	onClose?: () => void
	isMaximized?: boolean
	size?: VariantProps<typeof windowTitleButtonVariants>['size']
	showMinimize?: boolean
	showMaximize?: boolean
	showClose?: boolean
}

export const WindowControls = forwardRef<HTMLDivElement, WindowControlsProps>(
	(
		{
			onMinimize,
			onMaximize,
			onClose,
			isMaximized = false,
			size = 'md',
			gap,
			showMinimize = true,
			showMaximize = true,
			showClose = true,
			className,
			...props
		},
		ref
	) => {
		const { setIsMaximized } = useWindowContext()

		const handleMaximize = () => {
			const newState = !isMaximized
			setIsMaximized(newState)
			onMaximize?.()
		}

		return (
			<div
				ref={ref}
				className={cn(windowControlsContainerVariants({ gap }), className)}
				{...props}
			>
				{showMinimize && (
					<WindowControlButton
						variant='minimize'
						size={size}
						icon={<Minus className='w-4 h-4' />}
						tooltip='Minimize'
						onClick={onMinimize}
					/>
				)}

				{showMaximize && (
					<WindowControlButton
						variant='maximize'
						size={size}
						icon={<Square className='w-4 h-4' />}
						tooltip={isMaximized ? 'Restore' : 'Maximize'}
						onClick={handleMaximize}
					/>
				)}

				{showClose && (
					<WindowControlButton
						variant='danger'
						size={size}
						icon={<X className='w-4 h-4' />}
						tooltip='Close'
						onClick={onClose}
					/>
				)}
			</div>
		)
	}
)

WindowControls.displayName = 'WindowControls'
