'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * PLP filter/sort links must refetch the server page after `router.push`.
 * Same pathname + new searchParams can otherwise keep a stale RSC payload in Next.js 16.
 */
export function PlpQueryLink({
  href,
  children,
  onNavigate,
  ...props
}: React.ComponentProps<'a'> & {
  href: string
  onNavigate?: () => void
}) {
  const router = useRouter()

  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault()
        onNavigate?.()
        router.push(href)
        router.refresh()
      }}
    >
      {children}
    </a>
  )
}
