import { cva } from 'class-variance-authority'

export const windowTitleVariants = cva(
	'flex items-center justify-between px-4 py-3 select-none transition-colors border-b',
	{
		variants: {
			variant: {
				default: 'bg-background text-foreground border-border/50 dark:bg-slate-900 dark:border-slate-700',
				primary: 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700',
				secondary: 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
				glass: 'bg-background/40 backdrop-blur-md text-foreground border-border/30 dark:bg-slate-900/40 dark:border-slate-700/30'
			},
			size: {
				sm: 'min-h-8',
				md: 'min-h-10',
				lg: 'min-h-12'
			},
			padding: {
				compact: 'px-2 py-1',
				normal: 'px-4 py-3',
				loose: 'px-6 py-4'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			padding: 'normal'
		}
	}
)

export const windowTitleButtonVariants = cva(
	'flex items-center justify-center rounded transition-all duration-150 cursor-pointer hover:opacity-80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-0',
	{
		variants: {
			variant: {
				default:
					'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
				danger:
					'text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/20 focus:ring-red-500',
				minimize:
					'text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 dark:hover:bg-amber-500/20 focus:ring-amber-500',
				maximize:
					'text-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-500/20 focus:ring-green-500'
			},
			size: {
				sm: 'w-6 h-6 text-xs',
				md: 'w-8 h-8 text-sm',
				lg: 'w-10 h-10 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
)

export const windowTitleTextVariants = cva('truncate font-medium pointer-events-none', {
	variants: {
		size: {
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base'
		},
		weight: {
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold'
		}
	},
	defaultVariants: {
		size: 'md',
		weight: 'medium'
	}
})

export const windowControlsContainerVariants = cva('flex items-center gap-1', {
	variants: {
		gap: {
			tight: 'gap-0',
			normal: 'gap-1',
			loose: 'gap-2'
		}
	},
	defaultVariants: {
		gap: 'normal'
	}
})
