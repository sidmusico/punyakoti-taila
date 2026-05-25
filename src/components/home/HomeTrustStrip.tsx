import React from 'react'

import { Icons } from '@/components/ui/pt/Icons'

type TrustIcon = 'leaf' | 'drop' | 'truck' | 'shield' | 'star' | 'check' | 'refresh'

const DEFAULT_ITEMS: { icon: TrustIcon; label: string; sub: string }[] = [
  { icon: 'leaf', label: 'Wood-pressed', sub: 'Zero heat, zero solvents' },
  { icon: 'shield', label: 'Lab tested', sub: 'Every batch, published' },
  { icon: 'truck', label: 'Free over ₹999', sub: 'Ships in 2–5 days' },
  { icon: 'refresh', label: '30-day return', sub: 'No questions asked' },
]

function trustIconNode(icon: TrustIcon) {
  switch (icon) {
    case 'leaf':
      return <Icons.leaf size={20} />
    case 'drop':
      return <Icons.drop size={20} />
    case 'truck':
      return <Icons.truck size={20} />
    case 'shield':
      return <Icons.shield size={20} />
    case 'star':
      return <Icons.star size={20} />
    case 'check':
      return <Icons.check size={20} />
    case 'refresh':
      return <Icons.refresh size={20} />
    default:
      return <Icons.leaf size={20} />
  }
}

export function HomeTrustStrip({
  items,
}: {
  items?: { icon: TrustIcon; label: string; sub?: string | null; id?: string | null }[] | null
}) {
  const list = items?.length
    ? items.map((i) => ({ icon: i.icon, label: i.label, sub: i.sub ?? '' }))
    : DEFAULT_ITEMS

  return (
    <div className="hp-trust-shell">
      <div className="hp-trust-inner trust-grid">
        {list.map(({ icon, label, sub }, idx) => (
          <div key={`${label}-${idx}`} className="trust-item hp-trust-item">
            <div className="hp-trust-icon">{trustIconNode(icon)}</div>
            <div>
              <div className="hp-trust-label">{label}</div>
              <div className="hp-trust-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
