import React from 'react'

export function PtStars({ value = 5, size = 13 }: { value?: number; size?: number }) {
  return (
    <div className="pt-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={`star-${i}`}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={i < value ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="m12 3 2.7 5.7L21 9.5l-4.5 4.3L18 21l-6-3.2L6 21l1.5-7.2L3 9.5l6.3-.8L12 3Z" />
        </svg>
      ))}
    </div>
  )
}
