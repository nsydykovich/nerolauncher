import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { badgeVariants } from '@/shared/config/ui'
import { cn } from '@/shared/lib/utils'

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
    )
}
