import React from 'react'
import { cn } from '@/utilities/ui'

const tones = ['green', 'mustard', 'dark', 'terra'] as const
export type PtPillTone = (typeof tones)[number]

export function PtPill({
  children,
  tone = 'green',
  className,
}: {
  children: React.ReactNode
  tone?: PtPillTone
  className?: string
}) {
  return <span className={cn('pt-pill', `pt-pill--${tone}`, className)}>{children}</span>
}
