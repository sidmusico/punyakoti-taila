import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'
import { accountFields } from '@/globals/storefrontFieldGroups/fields'

const SLUG = 'account'

export const AccountSettings: GlobalConfig = {
  slug: SLUG,
  label: 'Account',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalSlug(SLUG)] },
  fields: accountFields,
}
