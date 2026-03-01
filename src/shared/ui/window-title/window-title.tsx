'use client'

import React, { forwardRef } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'
import {
	windowTitleVariants,
	windowTitleTextVariants
} from '@/shared/config/window-title'
import { useWindowContext } from './context'

interface WindowTitleProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
		VariantProps<typeof windowTitleVariants> {
	title?: React.ReactNode
	subtitle?: React.ReactNode
	draggable?: boolean
	onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
	onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
	textVariant?: VariantProps<typeof windowTitleTextVariants>['size']
	textWeight?: VariantProps<typeof windowTitleTextVariants>['weight']
}

export const WindowTitle = forwardRef<HTMLDivElement, WindowTitleProps>(
	(
		{
			title,
			subtitle,
			className,
			variant,
			size,
			padding,
			draggable = true,
			onDragStart,
			onDragEnd,
			textVariant,
			textWeight,
			...props
		},
		ref
	) => {
		const { isFocused, isDragging } = useWindowContext()

		const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
			if (draggable) {
				onDragStart?.(e)
			}
		}

		const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
			onDragEnd?.(e)
		}

		return (
			<div
				ref={ref}
				draggable={draggable}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				className={cn(
					windowTitleVariants({ variant, size, padding }),
					isDragging && 'opacity-90',
					!isFocused && 'opacity-60 dark:opacity-50',
					className
				)}
				{...props}
			>
				<div className='flex flex-col gap-0'>
					{title && (
						<div
							className={cn(
								windowTitleTextVariants({
									size: textVariant || (size as any),
									weight: textWeight
								})
							)}
						>
							{title}
						</div>
					)}
					{subtitle && (
						<div className='text-xs opacity-70 dark:opacity-60 truncate pointer-events-none'>
							{subtitle}
						</div>
					)}
				</div>
			</div>
		)
	}
)

WindowTitle.displayName = 'WindowTitle'
