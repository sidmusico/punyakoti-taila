import React from 'react'

export function CowMark({
  size = 80,
  color = 'currentColor',
  opacity = 1,
  className,
}: {
  size?: number
  color?: string
  opacity?: number
  className?: string
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 0.625}
      viewBox="0 0 160 100"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity }}
      aria-hidden="true"
    >
      <path d="M28 64 C28 50 38 44 50 44 L96 44 C108 44 116 38 122 30 C126 24 130 22 134 24 C138 26 138 32 134 38 L128 46 C132 50 134 56 134 62 L134 72" />
      <path d="M28 64 L28 78 M40 64 L40 80 M104 64 L104 80 M116 64 L116 80" />
      <path d="M58 44 C60 36 66 32 72 36" />
      <path d="M124 26 C120 18 116 16 112 18 M132 24 C136 16 140 14 144 16" />
      <path d="M28 64 C22 64 18 66 18 72 C18 76 20 78 22 78" />
      <circle cx="124" cy="34" r="1.1" fill={color} stroke="none" />
    </svg>
  )
}
