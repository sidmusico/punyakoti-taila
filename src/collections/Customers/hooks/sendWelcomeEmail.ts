import type { CollectionAfterChangeHook } from 'payload'

import { sendWelcomeEmail } from '@/lib/email/sendOrderEmails'
import type { Customer } from '@/payload-types'

export const sendWelcomeOnCreate: CollectionAfterChangeHook<Customer> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc
  if (req.context.skipWelcomeEmail) return doc
  const email = doc.email?.trim()
  if (!email) return doc

  try {
    const result = await sendWelcomeEmail({
      customerName: doc.name ?? 'there',
      customerEmail: email,
      payload: req.payload,
    })
    if (result.sent) {
      req.payload.logger.info(`[email] welcome sent for customer ${doc.id}`)
    }
  } catch (err) {
    req.payload.logger.error(`[email] welcome failed: ${err}`)
  }
  return doc
}
