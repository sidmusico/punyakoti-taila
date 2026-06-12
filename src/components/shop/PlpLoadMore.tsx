'use client'

import React from 'react'

import { PlpQueryLink } from '@/components/shop/PlpQueryLink'
import { Icons } from '@/components/ui/pt/Icons'

export function PlpLoadMore({
  href,
  shown,
  total,
}: {
  href: string
  shown?: number
  total?: number
}) {
  const showProgress = typeof shown === 'number' && typeof total === 'number' && total > 0

  return (
    <div className="plp-load-more flex flex-col items-center gap-3.5">
      {showProgress && (
        <div className="flex flex-col items-center gap-2" aria-hidden>
          <span className="text-[13px] tracking-wide" style={{ color: 'var(--ink-400)' }}>
            Showing {Math.min(shown!, total!)} of {total} oils
          </span>
          <span
            className="block h-[3px] w-40 overflow-hidden rounded-full"
            style={{ background: 'var(--cream-400)' }}
          >
            <span
              className="block h-full rounded-full transition-all duration-300"
              style={{
                background: 'var(--green-700)',
                width: `${Math.min(100, Math.round((shown! / total!) * 100))}%`,
              }}
            />
          </span>
        </div>
      )}
      {/* scroll={false}: append products without jumping back to the top */}
      <PlpQueryLink href={href} scroll={false} className="pt-btn pt-btn--ghost pt-btn--lg pt-btn-inline-icon">
        Load more <Icons.chevDown size={14} />
      </PlpQueryLink>
    </div>
  )
}
