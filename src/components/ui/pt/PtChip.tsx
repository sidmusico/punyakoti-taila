import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

interface PtChipBaseProps {
  active?: boolean
  className?: string
  children: React.ReactNode
}

export function PtChip({
  active,
  className,
  children,
  href,
  onClick,
  type = 'button',
}: PtChipBaseProps & {
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const cls = cn('pt-chip', active && 'pt-chip--active', className)
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
