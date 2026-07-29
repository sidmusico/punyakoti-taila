import type { GlobalAfterChangeHook } from 'payload'

import { invalidateEmailTemplateCache } from '@/lib/email/loadEmailTemplates'

export const invalidateEmailTemplatesCache: GlobalAfterChangeHook = () => {
  invalidateEmailTemplateCache()
}
