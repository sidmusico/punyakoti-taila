import React from 'react'
import { Icons } from '@/components/ui/pt/Icons'
import { PlpQueryLink } from '@/components/shop/PlpQueryLink'
import { cn } from '@/utilities/ui'
import {
  buildHref,
  toggleInList,
  type PlpFilters,
} from '@/lib/plp/filters'
import { PlpPriceSlider } from '@/components/shop/PlpPriceSlider'

export interface PlpFacetItem {
  value: string
  label: string
  count: number
}

export interface PlpFacets {
  sizes: PlpFacetItem[]
  uses: PlpFacetItem[]
  priceMin: number
  priceMax: number
}

interface SidebarProps {
  filters: PlpFilters
  facets: PlpFacets
}

interface GroupProps {
  title: string
  items: PlpFacetItem[]
  selected: string[]
  filters: PlpFilters
  /** Key on PlpFilters this group writes to. */
  paramKey: 'sizes' | 'uses'
}

function FilterGroup({ title, items, selected, filters, paramKey }: GroupProps) {
  return (
    <div className="plp-filter-group">
      <div className="plp-filter-group__head">
        <div className="plp-filter-group__title">{title}</div>
        <button className="plp-filter-group__toggle" aria-label={`Collapse ${title}`} type="button">
          <Icons.minus size={14} />
        </button>
      </div>
      <div className="plp-filter-list">
        {items.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>No matches</div>
        )}
        {items.map((it) => {
          const on = selected.includes(it.value)
          const nextSelection = toggleInList(selected, it.value)
          const href = buildHref(filters, { [paramKey]: nextSelection, page: 1 })
          return (
            <PlpQueryLink key={it.value} href={href} className={cn('plp-check', on && 'plp-check--on')}>
              <span className="plp-check__box">{on ? <Icons.check size={12} /> : null}</span>
              <span className="plp-check__label">
                {it.label}
                {it.count != null ? <span className="plp-check__count"> ({it.count})</span> : null}
              </span>
            </PlpQueryLink>
          )
        })}
      </div>
    </div>
  )
}

export function PlpFilterSidebar({ filters, facets }: SidebarProps) {
  return (
    <aside className="plp-rail">
      <div className="plp-rail__sticky">
        <FilterGroup
          title="Size"
          items={facets.sizes}
          selected={filters.sizes}
          filters={filters}
          paramKey="sizes"
        />
        <FilterGroup
          title="Use"
          items={facets.uses}
          selected={filters.uses}
          filters={filters}
          paramKey="uses"
        />

        <PlpPriceSlider
          min={facets.priceMin}
          max={facets.priceMax}
          filters={filters}
        />

        {(filters.cat ||
          filters.sizes.length ||
          filters.uses.length ||
          filters.priceMin != null ||
          filters.priceMax != null) && (
          <div style={{ marginTop: 4 }}>
            <PlpQueryLink href="/shop" className="plp-clear-link">
              Clear all filters
            </PlpQueryLink>
          </div>
        )}
      </div>
    </aside>
  )
}
