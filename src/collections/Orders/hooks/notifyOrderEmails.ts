import type { CollectionAfterChangeHook } from 'payload'

import {
  sendOrderPaymentRefundedEmail,
  sendOrderStatusEmail,
} from '@/lib/email/sendOrderEmails'
import type { OrderEmailTemplateKey } from '@/seed/emailTemplatesSeedDefaults'
import type { Order } from '@/payload-types'

const TERMINAL_STATUSES = new Set<NonNullable<Order['status']>>(['cancelled', 'refunded', 'returned'])

async function trySendStatusEmail(
  doc: Order,
  status: OrderEmailTemplateKey,
  trigger: string,
  payload: Parameters<CollectionAfterChangeHook<Order>>[0]['req']['payload'],
) {
  const result = await sendOrderStatusEmail(doc, status, payload)
  if (result.sent) {
    payload.logger.info(`[email] status ${status} sent for ${doc.orderId} (${trigger})`)
  } else if (result.skipped) {
    payload.logger.warn(
      `[email] status ${status} skipped for ${doc.orderId} (${trigger}): ${result.skipReason ?? 'unknown'}`,
    )
  } else {
    payload.logger.error(
      `[email] status ${status} failed for ${doc.orderId} (${trigger}): ${result.error}`,
    )
  }
  return result
}

/** Send transactional emails when admins (or checkout) change order / payment status. */
export const notifyOrderEmails: CollectionAfterChangeHook<Order> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (req.context.skipOrderEmails) return doc
  if (operation === 'create') return doc

  const prevStatus = previousDoc?.status ?? 'pending'
  const nextStatus = doc.status ?? 'pending'
  const prevPay = previousDoc?.paymentStatus ?? 'pending'
  const nextPay = doc.paymentStatus ?? 'pending'

  const paymentJustPaid = prevPay !== 'paid' && nextPay === 'paid'
  const statusBecameConfirmed = prevStatus !== 'confirmed' && nextStatus === 'confirmed'
  const statusChanged = prevStatus !== nextStatus && nextStatus !== 'pending'

  const sentThisSave = new Set<OrderEmailTemplateKey>()

  if (statusChanged) {
    const skipConfirmedDuplicate = statusBecameConfirmed && paymentJustPaid
    if (!skipConfirmedDuplicate) {
      try {
        const key = nextStatus as OrderEmailTemplateKey
        const result = await trySendStatusEmail(doc, key, 'status_change', req.payload)
        if (result.sent) sentThisSave.add(key)
      } catch (err) {
        req.payload.logger.error(`[email] status hook error for ${doc.orderId}: ${err}`)
      }
    }
  }

  // Tracking/courier added without a status change (e.g. status left on Packed).
  const prevTracking = previousDoc?.trackingNumber?.trim() ?? ''
  const prevCourier = previousDoc?.courierPartner?.trim() ?? ''
  const nextTracking = doc.trackingNumber?.trim() ?? ''
  const nextCourier = doc.courierPartner?.trim() ?? ''
  const shipmentInfoNewlySet =
    (Boolean(nextTracking) && nextTracking !== prevTracking) ||
    (Boolean(nextCourier) && nextCourier !== prevCourier)

  if (
    !sentThisSave.has('shipped') &&
    shipmentInfoNewlySet &&
    !TERMINAL_STATUSES.has(nextStatus) &&
    nextStatus !== 'pending'
  ) {
    try {
      await trySendStatusEmail(doc, 'shipped', 'tracking_or_courier', req.payload)
    } catch (err) {
      req.payload.logger.error(`[email] shipped (tracking) hook error for ${doc.orderId}: ${err}`)
    }
  }

  const prevDeliveredAt = previousDoc?.deliveredAt ?? null
  const nextDeliveredAt = doc.deliveredAt ?? null
  const deliveredAtNewlySet = Boolean(nextDeliveredAt) && nextDeliveredAt !== prevDeliveredAt

  if (
    !sentThisSave.has('delivered') &&
    deliveredAtNewlySet &&
    !TERMINAL_STATUSES.has(nextStatus)
  ) {
    try {
      await trySendStatusEmail(doc, 'delivered', 'delivered_at', req.payload)
    } catch (err) {
      req.payload.logger.error(`[email] delivered (date) hook error for ${doc.orderId}: ${err}`)
    }
  }

  if (prevPay !== nextPay && nextPay === 'refunded' && nextStatus !== 'refunded') {
    try {
      await sendOrderPaymentRefundedEmail(doc, req.payload)
    } catch (err) {
      req.payload.logger.error(`[email] refund notice failed for ${doc.orderId}: ${err}`)
    }
  }

  return doc
}
