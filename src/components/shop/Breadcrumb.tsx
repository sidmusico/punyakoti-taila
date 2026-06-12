import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

export type BreadcrumbItem = {
  label: string
  /** Omit for the current (last) crumb. */
  href?: string
}

/**
 * Shared storefront breadcrumb — identical typography, colors, and spacing on
 * every page. Always render as the first element inside `.pt-page-container`.
 */
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('pt-3 mb-4 text-xs', className)} style={{ color: 'var(--ink-500)' }}>
      {items.map((item, i) => (
        <React.Fragment key={`${item.label}-${i}`}>
          {i > 0 && (
            <span className="mx-1.5 opacity-40" aria-hidden>
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href} className="transition-opacity hover:opacity-75" style={{ color: 'var(--green-700)' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--green-900)' }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
