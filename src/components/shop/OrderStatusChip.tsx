import type { Order } from '@/payload-types'

const LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  packed: 'Packed',
  returned: 'Returned',
}

export function StatusChip({ status }: { status?: Order['status'] }) {
  const key = status ?? 'pending'
  const label = LABELS[key] ?? key.replace(/_/g, ' ')
  const tone =
    status === 'delivered'
      ? { background: 'var(--green-100)', color: 'var(--green-800)' }
      : status === 'cancelled' || status === 'returned' || status === 'refunded'
        ? { background: 'var(--terra-100)', color: 'var(--terra-700)' }
        : { background: 'var(--mustard-100)', color: 'var(--mustard-700)' }
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={tone}>
      {label}
    </span>
  )
}
