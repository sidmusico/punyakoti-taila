'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * PLP filter/sort links must refetch the server page after `router.push`.
 * Same pathname + new searchParams can otherwise keep a stale RSC payload in Next.js 16.
 *
 * `scroll={false}` keeps the viewport in place — used by "Load more" so newly
 * appended products show up without jumping back to the top of the page.
 */
export function PlpQueryLink({
  href,
  children,
  onNavigate,
  scroll = true,
  ...props
}: React.ComponentProps<'a'> & {
  href: string
  onNavigate?: () => void
  scroll?: boolean
}) {
  const router = useRouter()

  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault()
        onNavigate?.()
        router.push(href, { scroll })
        router.refresh()
      }}
    >
      {children}
    </a>
  )
}
