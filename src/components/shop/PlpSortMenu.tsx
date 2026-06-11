'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PlpQueryLink } from '@/components/shop/PlpQueryLink'
import { Icons } from '@/components/ui/pt/Icons'
import { SORT_OPTIONS, buildHref, type PlpFilters, type SortValue } from '@/lib/plp/filters'
import { cn } from '@/utilities/ui'

interface Props {
  filters: PlpFilters
  variant?: 'inline' | 'button'
}

export function PlpSortMenu({ filters, variant = 'inline' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentLabel = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? 'Featured'

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <div className="plp-sort" ref={ref}>
      <button
        type="button"
        className={cn(
          variant === 'inline' ? 'plp-toolbar__sort-btn' : 'plp-mobile-bar__btn',
          'plp-sort__btn',
        )}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {variant === 'button' ? <span>Sort · {currentLabel}</span> : <>{currentLabel}</>}
        <Icons.chevDown size={14} />
      </button>
      {open && (
        <div className="plp-sort__menu" role="menu">
          {SORT_OPTIONS.map((o) => {
            const isActive = o.value === filters.sort
            return (
              <PlpQueryLink
                key={o.value}
                href={buildHref(filters, { sort: o.value as SortValue, page: 1 })}
                className={cn('plp-sort__item', isActive && 'plp-sort__item--active')}
                role="menuitem"
                onNavigate={() => setOpen(false)}
              >
                {o.label}
                {isActive ? <Icons.check size={14} /> : null}
              </PlpQueryLink>
            )
          })}
        </div>
      )}
    </div>
  )
}
