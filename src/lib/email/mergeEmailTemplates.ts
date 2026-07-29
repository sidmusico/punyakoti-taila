import type { EmailTemplateBlock } from '@/seed/emailTemplatesSeedDefaults'
import {
  emailTemplatesSeedDefaults,
  ORDER_STATUS_TO_TEMPLATE,
  type OrderEmailTemplateKey,
} from '@/seed/emailTemplatesSeedDefaults'

export type EmailTemplatesGlobal = typeof emailTemplatesSeedDefaults & Record<string, unknown>

const TEMPLATE_BLOCK_KEYS = [
  'orderConfirmed',
  'orderPacked',
  'orderShipped',
  'orderOutForDelivery',
  'orderDelivered',
  'orderCancelled',
  'orderReturned',
  'orderRefunded',
  'welcome',
  'otpEmail',
  'signupConfirmation',
] as const satisfies readonly (keyof typeof emailTemplatesSeedDefaults)[]

/** CMS groups can override seed with empty strings / missing copy — fall back to repo defaults. */
export function mergeEmailTemplateBlock(
  seed: EmailTemplateBlock,
  fromDoc?: Partial<EmailTemplateBlock> | null,
): EmailTemplateBlock {
  if (!fromDoc) return seed
  const enabled = fromDoc.enabled === false ? false : (fromDoc.enabled ?? seed.enabled ?? true)
  return {
    ...seed,
    ...fromDoc,
    enabled,
    subject: fromDoc.subject?.trim() ? fromDoc.subject : seed.subject,
    headline: fromDoc.headline?.trim() ? fromDoc.headline : seed.headline,
    body: fromDoc.body?.trim() ? fromDoc.body : seed.body,
    includeLineItems: fromDoc.includeLineItems ?? seed.includeLineItems,
    includeTotals: fromDoc.includeTotals ?? seed.includeTotals,
    includeShippingAddress: fromDoc.includeShippingAddress ?? seed.includeShippingAddress,
  }
}

export function isEmailTemplateEnabled(block: EmailTemplateBlock | null | undefined): block is EmailTemplateBlock {
  if (!block) return false
  if (block.enabled === false) return false
  return Boolean(block.subject?.trim())
}

export function mergeEmailTemplatesFromGlobal(
  doc: EmailTemplatesGlobal | null | undefined,
): EmailTemplatesGlobal {
  const merged = {
    ...emailTemplatesSeedDefaults,
    ...(doc ?? {}),
  } as EmailTemplatesGlobal

  for (const key of TEMPLATE_BLOCK_KEYS) {
    const seedVal = emailTemplatesSeedDefaults[key]
    if (!seedVal || typeof seedVal !== 'object' || !('subject' in seedVal)) continue
    const docBlock = doc?.[key] as Partial<EmailTemplateBlock> | undefined
    ;(merged as Record<string, unknown>)[key] = mergeEmailTemplateBlock(
      seedVal as EmailTemplateBlock,
      docBlock,
    )
  }

  return merged
}

export function getOrderTemplateBlock(
  templates: EmailTemplatesGlobal,
  status: OrderEmailTemplateKey,
): EmailTemplateBlock | null {
  const key = ORDER_STATUS_TO_TEMPLATE[status]
  const block = templates[key] as EmailTemplateBlock | undefined
  if (!isEmailTemplateEnabled(block)) return null
  return block ?? null
}
