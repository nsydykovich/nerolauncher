import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cardVariants } from '@/shared/config/ui'
import { cn } from '@/shared/lib/utils'

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
    return <div className={cn(cardVariants({ variant }), className)} {...props} />
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex flex-col gap-1.5 p-[var(--card-header-p,1.5rem)]', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn('text-lg font-semibold leading-none', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('px-[var(--card-p,1.5rem)] pb-[var(--card-p,1.5rem)] pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex items-center px-[var(--card-p,1.5rem)] pb-[var(--card-p,1.5rem)] pt-0', className)} {...props} />
}
