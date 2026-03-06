import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-base,0.5rem)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                primary: 'bg-[var(--accent-color,theme(colors.blue.600))] text-white hover:opacity-90',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                destructive: 'bg-destructive text-white hover:bg-destructive/90',
                outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                sm: 'h-[var(--btn-h-sm,2rem)] px-[var(--btn-px-sm,0.75rem)] text-xs',
                md: 'h-[var(--btn-h,2.25rem)] px-[var(--btn-px,1rem)]',
                lg: 'h-[var(--btn-h-lg,2.5rem)] px-[var(--btn-px-lg,1.5rem)] text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
)

export const badgeVariants = cva(
    'inline-flex items-center rounded-full font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground',
                primary: 'bg-[var(--accent-color,theme(colors.blue.600))] text-white',
                secondary: 'bg-secondary text-secondary-foreground',
                destructive: 'bg-destructive text-white',
                outline: 'border border-border text-foreground',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-1 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'sm',
        },
    },
)

export const cardVariants = cva(
    'rounded-lg',
    {
        variants: {
            variant: {
                default: 'bg-card text-card-foreground shadow-sm',
                outline: 'border border-border bg-transparent',
                ghost: 'bg-transparent',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)
