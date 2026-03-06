import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/shared/config/ui'
import { cn } from '@/shared/lib/utils'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <span className='size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                )}
                {children}
            </button>
        )
    },
)
Button.displayName = 'Button'
