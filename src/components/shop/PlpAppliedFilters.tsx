import React from 'react'
import { Icons } from '@/components/ui/pt/Icons'
import { PlpQueryLink } from '@/components/shop/PlpQueryLink'
import {
  buildHref,
  countActiveFilters,
  toggleInList,
  type PlpFilters,
} from '@/lib/plp/filters'

interface Props {
  filters: PlpFilters
  categoryLabel?: string
  /** Display labels keyed by filter value. */
  sizeLabels: Record<string, string>
  useLabels: Record<string, string>
}

/**
 * Horizontal strip of pill-shaped chips for every active filter.
 * Each chip is a `<Link>` that *removes* its own value. A "Clear all" link
 * resets everything (route to `/shop`).
 */
export function PlpAppliedFilters({ filters, categoryLabel, sizeLabels, useLabels }: Props) {
  const count = countActiveFilters(filters)
  if (count === 0) return null

  type Chip = { key: string; label: string; href: string }
  const chips: Chip[] = []

  if (filters.cat && categoryLabel) {
    chips.push({
      key: `cat`,
      label: categoryLabel,
      href: buildHref(filters, { cat: '', page: 1 }),
    })
  }

  for (const v of filters.sizes) {
    chips.push({
      key: `size-${v}`,
      label: sizeLabels[v] ?? v,
      href: buildHref(filters, { sizes: toggleInList(filters.sizes, v), page: 1 }),
    })
  }

  for (const v of filters.uses) {
    chips.push({
      key: `use-${v}`,
      label: useLabels[v] ?? v,
      href: buildHref(filters, { uses: toggleInList(filters.uses, v), page: 1 }),
    })
  }

  if (filters.priceMin != null || filters.priceMax != null) {
    const lo = filters.priceMin != null ? `₹${filters.priceMin}` : 'min'
    const hi = filters.priceMax != null ? `₹${filters.priceMax}` : 'max'
    chips.push({
      key: 'price',
      label: `${lo} – ${hi}`,
      href: buildHref(filters, { priceMin: null, priceMax: null, page: 1 }),
    })
  }

  return (
    <div className="plp-applied">
      <span className="plp-applied__label">Applied:</span>
      <ul className="plp-applied__list">
        {chips.map((c) => (
          <li key={c.key}>
            <PlpQueryLink href={c.href} className="plp-applied__chip" aria-label={`Remove filter ${c.label}`}>
              <span>{c.label}</span>
              <Icons.close size={12} />
            </PlpQueryLink>
          </li>
        ))}
      </ul>
      <PlpQueryLink href="/shop" className="plp-applied__reset">
        Reset all
      </PlpQueryLink>
    </div>
  )
}
