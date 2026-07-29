import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'
import { buildEmailTemplateFields } from '@/globals/EmailTemplates/fields'
import { invalidateEmailTemplatesCache } from '@/globals/EmailTemplates/hooks/invalidateCache'
import { emailTemplatesSeedDefaults } from '@/seed/emailTemplatesSeedDefaults'

const SLUG = 'email-templates'

export const EmailTemplates: GlobalConfig = {
  slug: SLUG,
  label: 'Email templates',
  admin: {
    group: 'Storefront',
    description:
      'Transactional emails (orders, welcome, OTP). Order emails send when status changes in Orders; welcome on new customer; auth emails via Supabase hook.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateGlobalSlug(SLUG), invalidateEmailTemplatesCache],
  },
  fields: buildEmailTemplateFields(emailTemplatesSeedDefaults),
}
