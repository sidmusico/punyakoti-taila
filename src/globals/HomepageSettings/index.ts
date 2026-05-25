import type { GlobalConfig } from 'payload'

import { homepageTabsField } from './tabFields'
import { revalidateHomepage } from './hooks/revalidateHomepage'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage',
  admin: {
    description:
      'Each tab controls one homepage band. Uncheck “Show this section” to hide it on the storefront.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomepage] },
  fields: [homepageTabsField],
}
