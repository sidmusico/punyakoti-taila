import React from 'react'

interface IconProps {
  size?: number
  className?: string
  fill?: string
  style?: React.CSSProperties
}

export const Icons = {
  search: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  bag: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>
    </svg>
  ),
  user: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
    </svg>
  ),
  heart: ({ size = 20, fill = 'none', className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/>
    </svg>
  ),
  menu: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} style={style}>
      <path d="M4 7h16M4 12h16M4 17h10"/>
    </svg>
  ),
  close: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} style={style}>
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  ),
  arrowRight: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  arrowLeft: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M19 12H5M11 6l-6 6 6 6"/>
    </svg>
  ),
  arrowUpRight: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M7 17 17 7M9 7h8v8"/>
    </svg>
  ),
  check: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m4 12 5 5L20 6"/>
    </svg>
  ),
  plus: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} style={style}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  minus: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} style={style}>
      <path d="M5 12h14"/>
    </svg>
  ),
  star: ({ size = 20, fill = 'currentColor', className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className={className} style={style}>
      <path d="m12 3 2.7 5.7L21 9.5l-4.5 4.3L18 21l-6-3.2L6 21l1.5-7.2L3 9.5l6.3-.8L12 3Z"/>
    </svg>
  ),
  leaf: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M5 19c0-9 7-15 16-15 0 9-6 15-15 15-1 0-1 0-1 0Z"/><path d="M5 19 16 8"/>
    </svg>
  ),
  drop: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 3c0 0-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/>
    </svg>
  ),
  shield: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  truck: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M2 7h12v10H2zM14 11h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
    </svg>
  ),
  chevDown: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  chevRight: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  ),
  package: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M3 7 12 3l9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>
    </svg>
  ),
  mail: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>
    </svg>
  ),
  phone: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M5 4h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4a2 2 0 0 1-2 2c-9-1-16-8-17-17a2 2 0 0 1 2-1Z"/>
    </svg>
  ),
  pin: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  lock: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
    </svg>
  ),
  clock: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  refresh: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>
    </svg>
  ),
  filter: ({ size = 20, className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/>
    </svg>
  ),
}
