'use client'

import React from 'react'

import { PlpQueryLink } from '@/components/shop/PlpQueryLink'
import { buildHref, type PlpFilters } from '@/lib/plp/filters'
import type { Category } from '@/payload-types'
import { cn } from '@/utilities/ui'

export function PlpCategoryChips({
  filters,
  chipCategories,
}: {
  filters: PlpFilters
  chipCategories: Category[]
}) {
  return (
    <div className="plp-chips pt-page-container pt-noscroll">
      <PlpQueryLink
        href={buildHref(filters, { cat: '', page: 1 })}
        className={cn('pt-chip', !filters.cat && 'pt-chip--active')}
      >
        All
      </PlpQueryLink>
      {chipCategories.map((c) => (
        <PlpQueryLink
          key={c.id}
          href={buildHref(filters, { cat: c.slug ?? '', page: 1 })}
          className={cn('pt-chip', filters.cat === c.slug && 'pt-chip--active')}
        >
          {c.title}
        </PlpQueryLink>
      ))}
    </div>
  )
}
