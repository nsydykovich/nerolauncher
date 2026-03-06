'use client'

import * as React from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string
  showCopy?: boolean
}

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ code, showCopy = true, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {}
    }

    return (
      <div className='relative'>
        <pre
          ref={ref}
          className={cn(
            'text-xs font-mono text-muted-foreground bg-muted rounded-md px-3 py-2 overflow-x-auto whitespace-pre-wrap break-all select-text',
            className,
          )}
          {...props}
        >
          {code}
        </pre>
        {showCopy && (
          <button
            onClick={handleCopy}
            title={copied ? 'Скопировано' : 'Копировать'}
            className='absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors opacity-60 hover:opacity-100'
          >
            {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
          </button>
        )}
      </div>
    )
  },
)
CodeBlock.displayName = 'CodeBlock'
