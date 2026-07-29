import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { notifyOrderEmails } from './hooks/notifyOrderEmails'
import { syncFulfillmentStatusFromFields } from './hooks/syncFulfillmentStatus'

export const Orders: CollectionConfig = {
  slug: 'orders',
  hooks: {
    beforeChange: [syncFulfillmentStatusFromFields],
    afterChange: [notifyOrderEmails],
  },
  access: {
    // Only admins can CRUD orders via admin panel
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: ['orderId', 'customerName', 'status', 'total', 'createdAt'],
    description: 'Customer orders. Created programmatically via checkout API.',
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order ID',
      admin: {
        position: 'sidebar',
        description: 'e.g. PT-20240601-0001',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Packed', value: 'packed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Out for delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Returned', value: 'returned' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Order details',
          fields: [
            {
              name: 'customer',
              type: 'relationship',
              relationTo: 'customers',
              label: 'Customer (registered)',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'customerName',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'customerEmail',
                  type: 'email',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'customerPhone',
              type: 'text',
              label: 'Customer phone',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'trackingNumber',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description:
                      'Saving a tracking number (or courier) on a Confirmed/Packed order moves status to Shipped and emails the customer.',
                  },
                },
                {
                  name: 'courierPartner',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'e.g. Delhivery, Shiprocket',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'estimatedDelivery',
                  type: 'date',
                  admin: { width: '50%' },
                },
                {
                  name: 'deliveredAt',
                  type: 'date',
                  admin: {
                    width: '50%',
                    description: 'Setting this date moves status to Delivered and sends the delivery email.',
                  },
                },
              ],
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Admin notes',
            },
          ],
        },
        {
          label: 'Shipping method',
          fields: [
            {
              name: 'deliveryMethod',
              type: 'text',
              label: 'Delivery method (legacy)',
              admin: {
                condition: (data) => !data?.deliveryDetails?.methodId,
                description: 'Older orders only stored the method name.',
              },
            },
            {
              name: 'deliveryDetails',
              type: 'group',
              label: 'Delivery snapshot',
              admin: {
                description: 'Captured at checkout from Cart → Delivery methods. Fee charged is in Payment details.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'methodId',
                      type: 'text',
                      label: 'Method ID',
                      admin: { width: '33%', readOnly: true },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      admin: { width: '34%', readOnly: true },
                    },
                    {
                      name: 'badge',
                      type: 'text',
                      label: 'Badge',
                      admin: { width: '33%', readOnly: true },
                    },
                  ],
                },
                {
                  name: 'etaLabel',
                  type: 'text',
                  label: 'Estimated delivery',
                  admin: { readOnly: true },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'etaMinDays',
                      type: 'number',
                      label: 'ETA min (days)',
                      admin: { width: '33%', readOnly: true },
                    },
                    {
                      name: 'etaMaxDays',
                      type: 'number',
                      label: 'ETA max (days)',
                      admin: { width: '33%', readOnly: true },
                    },
                    {
                      name: 'noteSuffix',
                      type: 'text',
                      label: 'Note suffix',
                      admin: { width: '34%', readOnly: true },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'catalogFee',
                      type: 'number',
                      label: 'Catalog fee (₹)',
                      admin: { width: '50%', readOnly: true },
                    },
                    {
                      name: 'freeOverThreshold',
                      type: 'checkbox',
                      label: 'Free over free-shipping threshold',
                      admin: { width: '50%', readOnly: true },
                    },
                  ],
                },
                {
                  name: 'leaveAtDoor',
                  type: 'checkbox',
                  label: 'Leave at door if not home',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },
        {
          label: 'Shipping address',
          fields: [
            {
              name: 'shippingAddress',
              type: 'group',
              label: false,
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'line1', type: 'text', required: true, label: 'Address line 1' },
                { name: 'line2', type: 'text', label: 'Address line 2' },
                { name: 'landmark', type: 'text', label: 'Landmark' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', required: true, admin: { width: '33%' } },
                    { name: 'state', type: 'text', required: true, admin: { width: '33%' } },
                    { name: 'pincode', type: 'text', required: true, admin: { width: '33%' } },
                  ],
                },
                { name: 'phone', type: 'text', label: 'Contact phone' },
              ],
            },
          ],
        },
        {
          label: 'Billing address',
          fields: [
            {
              name: 'billingSameAsShipping',
              type: 'checkbox',
              label: 'Billing address same as shipping',
              defaultValue: true,
            },
            {
              name: 'billingAddress',
              type: 'group',
              label: 'Billing address',
              admin: {
                description: 'Used only when billing differs from shipping.',
                condition: (data) => data?.billingSameAsShipping === false,
              },
              fields: [
                { name: 'name', type: 'text', label: 'Name' },
                { name: 'line1', type: 'text', label: 'Address line 1' },
                { name: 'line2', type: 'text', label: 'Address line 2' },
                { name: 'landmark', type: 'text', label: 'Landmark' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', admin: { width: '33%' } },
                    { name: 'state', type: 'text', admin: { width: '33%' } },
                    { name: 'pincode', type: 'text', admin: { width: '33%' } },
                  ],
                },
                { name: 'phone', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Line items',
          fields: [
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              label: 'Products',
              admin: {
                initCollapsed: false,
                description: 'Snapshot at checkout.',
                components: {
                  RowLabel: '@/components/payload/OrderLineItemRowLabel#OrderLineItemRowLabel',
                },
              },
              fields: [
                {
                  name: 'imageUrl',
                  type: 'text',
                  label: 'Product image',
                  admin: {
                    description: 'Thumbnail snapshot at checkout.',
                    components: {
                      Field: '@/components/payload/OrderLineItemImageField#OrderLineItemImageField',
                    },
                  },
                },
                {
                  name: 'product',
                  type: 'relationship',
                  relationTo: 'products',
                  required: false,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'productName',
                      type: 'text',
                      required: true,
                      label: 'Product',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'variantSize',
                      type: 'text',
                      required: true,
                      label: 'Variant',
                      admin: { width: '25%' },
                    },
                    { name: 'sku', type: 'text', label: 'SKU', admin: { width: '25%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'quantity', type: 'number', required: true, min: 1, admin: { width: '25%' } },
                    {
                      name: 'unitPrice',
                      type: 'number',
                      required: true,
                      min: 0,
                      label: 'Unit (INR)',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'lineTotal',
                      type: 'number',
                      required: true,
                      min: 0,
                      label: 'Line total (INR)',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'isSubscription',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '25%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Payment details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'razorpayOrderId',
                  type: 'text',
                  label: 'Razorpay order ID',
                  admin: { width: '50%' },
                },
                {
                  name: 'razorpayPaymentId',
                  type: 'text',
                  label: 'Razorpay payment ID',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'paymentMethod',
                  type: 'select',
                  options: [
                    { label: 'UPI', value: 'upi' },
                    { label: 'Card', value: 'card' },
                    { label: 'Net Banking', value: 'netbanking' },
                    { label: 'Pay Later', value: 'paylater' },
                    { label: 'Cash on Delivery', value: 'cod' },
                  ],
                  admin: { width: '100%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', required: true, min: 0, admin: { width: '25%' } },
                { name: 'shippingFee', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%' } },
                { name: 'discount', type: 'number', defaultValue: 0, min: 0, admin: { width: '25%' } },
                { name: 'couponCode', type: 'text', admin: { width: '25%' } },
              ],
            },
            {
              name: 'total',
              type: 'number',
              required: true,
              min: 0,
              label: 'Grand total (INR)',
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
