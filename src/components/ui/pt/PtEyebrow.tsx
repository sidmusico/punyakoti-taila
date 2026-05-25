import React from 'react'
import { cn } from '@/utilities/ui'

export type PtEyebrowVariant = 'default' | 'light' | 'onDark'

export function PtEyebrow({
  children,
  variant = 'default',
  center = false,
  className,
}: {
  children: React.ReactNode
  variant?: PtEyebrowVariant
  center?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'pt-eyebrow',
        variant === 'light' && 'pt-eyebrow--light',
        variant === 'onDark' && 'pt-eyebrow--on-dark',
        center && 'pt-eyebrow--center',
        className,
      )}
    >
      {children}
    </div>
  )
}
