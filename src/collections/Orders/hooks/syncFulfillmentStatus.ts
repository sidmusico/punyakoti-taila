import type { CollectionBeforeChangeHook } from 'payload'

import type { Order } from '@/payload-types'

const STATUSES_BEFORE_SHIP = new Set<NonNullable<Order['status']>>(['confirmed', 'packed'])
const TERMINAL_STATUSES = new Set<NonNullable<Order['status']>>(['cancelled', 'refunded', 'returned'])

/**
 * When admins add tracking/courier or a delivery date, move status forward so
 * notifyOrderEmails sends the shipped / delivered templates (status-change hook).
 */
export const syncFulfillmentStatusFromFields: CollectionBeforeChangeHook<Order> = ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  const prevStatus = (originalDoc?.status ?? data.status ?? 'pending') as NonNullable<Order['status']>
  let status = (data.status ?? prevStatus) as NonNullable<Order['status']>

  const prevTracking = originalDoc?.trackingNumber?.trim() ?? ''
  const prevCourier = originalDoc?.courierPartner?.trim() ?? ''
  const nextTracking = data.trackingNumber?.trim() ?? prevTracking
  const nextCourier = data.courierPartner?.trim() ?? prevCourier

  const hadShipmentInfo = Boolean(prevTracking || prevCourier)
  const hasShipmentInfo = Boolean(nextTracking || nextCourier)

  if (
    hasShipmentInfo &&
    !hadShipmentInfo &&
    STATUSES_BEFORE_SHIP.has(status) &&
    !TERMINAL_STATUSES.has(status)
  ) {
    status = 'shipped'
  }

  const prevDeliveredAt = originalDoc?.deliveredAt ?? null
  const nextDeliveredAt = data.deliveredAt !== undefined ? data.deliveredAt : prevDeliveredAt

  if (
    nextDeliveredAt &&
    !prevDeliveredAt &&
    status !== 'delivered' &&
    !TERMINAL_STATUSES.has(status)
  ) {
    status = 'delivered'
  }

  data.status = status
  return data
}
