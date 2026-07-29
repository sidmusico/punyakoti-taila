import type { Payload } from 'payload'
import configPromise from '@payload-config'

import {
  getOrderTemplateBlock,
  mergeEmailTemplatesFromGlobal,
  type EmailTemplatesGlobal,
} from '@/lib/email/mergeEmailTemplates'

export type { EmailTemplatesGlobal } from '@/lib/email/mergeEmailTemplates'
export {
  getOrderTemplateBlock,
  isEmailTemplateEnabled,
  mergeEmailTemplateBlock,
  mergeEmailTemplatesFromGlobal,
} from '@/lib/email/mergeEmailTemplates'

let cached: { at: number; data: EmailTemplatesGlobal } | null = null
const TTL_MS = 60_000

export async function loadEmailTemplates(payload?: Payload): Promise<EmailTemplatesGlobal> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data

  const { getPayload } = await import('payload')
  const p = payload ?? (await getPayload({ config: configPromise }))
  const doc = (await p.findGlobal({ slug: 'email-templates', depth: 0 })) as unknown as EmailTemplatesGlobal | null

  const merged = mergeEmailTemplatesFromGlobal(doc)
  cached = { at: Date.now(), data: merged }
  return merged
}

export function invalidateEmailTemplateCache() {
  cached = null
}
