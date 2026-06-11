'use client'

import React from 'react'

import { PlpQueryLink } from '@/components/shop/PlpQueryLink'
import { Icons } from '@/components/ui/pt/Icons'

export function PlpLoadMore({ href }: { href: string }) {
  return (
    <div className="plp-load-more">
      <PlpQueryLink href={href} className="pt-btn pt-btn--ghost pt-btn--lg pt-btn-inline-icon">
        Load more <Icons.chevDown size={14} />
      </PlpQueryLink>
    </div>
  )
}
