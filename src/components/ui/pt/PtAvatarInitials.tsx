import React from 'react'
import { cn } from '@/utilities/ui'

export type PtAvatarTone = 'warm' | 'deep' | 'sun' | 'field'

export function PtAvatarInitials({
  initials,
  tone = 'warm',
  size = 44,
  className,
}: {
  initials: string
  tone?: PtAvatarTone
  size?: number
  className?: string
}) {
  const h = Math.round(size * 1.2)
  return (
    <span
      className={cn('pt-avatar-initials', className)}
      data-tone={tone}
      style={{ width: size, height: h, fontSize: size * 0.42 }}
    >
      {initials}
    </span>
  )
}
