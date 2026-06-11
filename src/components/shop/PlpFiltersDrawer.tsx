'use client'

import React, { useEffect, useState } from 'react'
import { Icons } from '@/components/ui/pt/Icons'
import { countActiveFilters, type PlpFilters } from '@/lib/plp/filters'

interface Props {
  filters: PlpFilters
  children: React.ReactNode
}

export function PlpFiltersDrawer({ filters, children }: Props) {
  const [open, setOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button className="plp-mobile-bar__btn" type="button" onClick={() => setOpen(true)}>
        <span className="plp-mobile-bar__btn-label">
          <Icons.filter size={14} /> Filters
        </span>
        {activeCount > 0 ? (
          <span className="pt-pill pt-pill--green">{activeCount}</span>
        ) : null}
      </button>

      {open && (
        <div className="plp-drawer" role="dialog" aria-modal="true">
          <div className="plp-drawer__backdrop" onClick={() => setOpen(false)} />
          <div className="plp-drawer__sheet">
            <div className="plp-drawer__head">
              <div className="plp-drawer__title">Filters</div>
              <button
                className="plp-drawer__close"
                aria-label="Close filters"
                onClick={() => setOpen(false)}
              >
                <Icons.close size={20} />
              </button>
            </div>
            <div className="plp-drawer__body">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}
