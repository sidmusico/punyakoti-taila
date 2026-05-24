import React from 'react'
import { cn } from '@/utilities/ui'

interface WordmarkProps {
  size?: number
  color?: string
  showTagline?: boolean
  logoText?: string
  logoTagline?: string
  className?: string
}

export function Wordmark({
  size = 22,
  color = 'var(--green-900)',
  showTagline = true,
  logoText = 'Punyakoti·',
  logoTagline = 'T A I L A',
  className,
}: WordmarkProps) {
  const taglineColor =
    color === 'var(--cream-100)' ? 'rgba(251,247,236,0.55)' : 'var(--wood-600)'

  return (
    <div
      className={cn('inline-flex flex-col leading-none', className)}
      style={{ color }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: size,
          letterSpacing: '-0.01em',
        }}
      >
        {logoText.endsWith('·') ? (
          <>
            {logoText.slice(0, -1)}
            <span style={{ color: 'var(--mustard-500)' }}>·</span>
          </>
        ) : (
          logoText
        )}
      </span>
      {showTagline && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: size * 0.32,
            letterSpacing: '0.32em',
            marginTop: size * 0.18,
            color: taglineColor,
          }}
        >
          {logoTagline}
        </span>
      )}
    </div>
  )
}
