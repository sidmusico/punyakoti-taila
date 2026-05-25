import Link from 'next/link'
import React from 'react'
import { cn } from '@/utilities/ui'

export type PtTextLinkVariant = 'green' | 'mustard' | 'mustardMuted'

export function PtTextLink({
  href,
  children,
  variant = 'green',
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: PtTextLinkVariant
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn('pt-text-link', variant === 'green' && 'pt-text-link--green', variant === 'mustard' && 'pt-text-link--mustard', variant === 'mustardMuted' && 'pt-text-link--mustard-muted', className)}
    >
      {children}
    </Link>
  )
}
