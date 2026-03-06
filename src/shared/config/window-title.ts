import { cva } from 'class-variance-authority'

export const windowTitleVariants = cva(
	'flex items-center justify-between px-4 py-3 select-none transition-colors border-b',
	{
		variants: {
			variant: {
				default: 'bg-sidebar text-sidebar-foreground border-sidebar-border',
				primary: 'bg-primary text-primary-foreground border-primary/80',
				secondary: 'bg-secondary text-secondary-foreground border-border',
				glass: 'bg-sidebar/60 backdrop-blur-md text-sidebar-foreground border-sidebar-border/50'
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
					'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent focus:ring-sidebar-ring',
				danger:
					'text-sidebar-foreground/70 hover:text-white hover:bg-destructive focus:ring-destructive',
				minimize:
					'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent focus:ring-sidebar-ring',
				maximize:
					'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent focus:ring-sidebar-ring'
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
