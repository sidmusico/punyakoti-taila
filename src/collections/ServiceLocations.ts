import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/**
 * Service locations / dealers — cities where Punyakoti products are available.
 *
 * Used by:
 *  - Homepage scrolling marquee ("Now available in <city>")
 *  - (Future) shipping address comparison: match a customer's PIN code / city
 *    against this collection to confirm the order can be delivered.
 *
 * Admins maintain the list from the CMS. Reads are public so the storefront
 * (and the marquee) can fetch without a session.
 */
export const ServiceLocations: CollectionConfig = {
  slug: 'service-locations',
  labels: {
    singular: 'Service location',
    plural: 'Service locations',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'cityName',
    defaultColumns: ['cityName', 'dealerName', 'pinCode', 'phoneNumber', 'enabled'],
    description:
      'Cities / dealers where products are currently available. Drives the homepage scrolling marquee and (future) shipping-address checks.',
  },
  fields: [
    {
      name: 'cityName',
      type: 'text',
      required: true,
      label: 'City name',
      admin: { description: 'Shown in the homepage marquee — e.g. Bengaluru, Mysuru.' },
    },
    {
      name: 'addressDetails',
      type: 'textarea',
      label: 'Address details',
      admin: { description: 'Street / area / landmark for the dealer or pickup point.' },
    },
    {
      name: 'dealerName',
      type: 'text',
      label: 'Dealer name',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone number',
      admin: { description: 'Contact number for the dealer / outlet.' },
    },
    {
      name: 'pinCode',
      type: 'text',
      label: 'PIN code',
      admin: { description: 'Indian 6-digit postal code. Used later for delivery checks.' },
      validate: (value: unknown) => {
        if (value == null || value === '') return true
        return /^\d{6}$/.test(String(value)) || 'PIN code must be 6 digits.'
      },
    },
    {
      name: 'state',
      type: 'text',
      defaultValue: 'Karnataka',
      label: 'State',
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show in marquee',
      admin: {
        description:
          'Uncheck to hide this location from the homepage marquee without deleting the record.',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: { description: 'Lower numbers appear first in the marquee.' },
    },
  ],
}

export default ServiceLocations
