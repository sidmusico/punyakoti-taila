import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
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
    // ── Identifiers ─────────────────────────────────────────────
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order ID',
      admin: { description: 'e.g. PT-20240601-0001' },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      label: 'Razorpay Order ID',
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      label: 'Razorpay Payment ID',
    },

    // ── Customer ────────────────────────────────────────────────
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Customer (registered)',
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
    },

    // ── Address ─────────────────────────────────────────────────
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'name',     type: 'text', required: true },
        { name: 'line1',    type: 'text', required: true, label: 'Address line 1' },
        { name: 'line2',    type: 'text', label: 'Address line 2' },
        { name: 'city',     type: 'text', required: true },
        { name: 'state',    type: 'text', required: true },
        { name: 'pincode',  type: 'text', required: true },
        { name: 'phone',    type: 'text' },
      ],
    },

    // ── Items ───────────────────────────────────────────────────
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        { name: 'productName', type: 'text', required: true },
        { name: 'variantSize', type: 'text', required: true },
        { name: 'sku',         type: 'text' },
        { name: 'quantity',    type: 'number', required: true, min: 1 },
        { name: 'unitPrice',   type: 'number', required: true, min: 0 },
        { name: 'lineTotal',   type: 'number', required: true, min: 0 },
        {
          name: 'isSubscription',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    // ── Pricing ─────────────────────────────────────────────────
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingFee',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'couponCode',
      type: 'text',
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      label: 'Grand total (INR)',
    },

    // ── Payment ─────────────────────────────────────────────────
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'UPI',           value: 'upi'         },
        { label: 'Card',          value: 'card'        },
        { label: 'Net Banking',   value: 'netbanking'  },
        { label: 'Pay Later',     value: 'paylater'    },
        { label: 'Cash on Delivery', value: 'cod'      },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending',   value: 'pending'   },
        { label: 'Paid',      value: 'paid'      },
        { label: 'Failed',    value: 'failed'    },
        { label: 'Refunded',  value: 'refunded'  },
      ],
    },

    // ── Fulfillment ─────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending',     value: 'pending'     },
        { label: 'Confirmed',   value: 'confirmed'   },
        { label: 'Packed',      value: 'packed'      },
        { label: 'Shipped',     value: 'shipped'     },
        { label: 'Delivered',   value: 'delivered'   },
        { label: 'Cancelled',   value: 'cancelled'   },
        { label: 'Returned',    value: 'returned'    },
      ],
    },
    {
      name: 'trackingNumber',
      type: 'text',
    },
    {
      name: 'courierPartner',
      type: 'text',
      admin: { description: 'e.g. Delhivery, Shiprocket' },
    },
    {
      name: 'estimatedDelivery',
      type: 'date',
    },
    {
      name: 'deliveredAt',
      type: 'date',
    },

    // ── Notes ───────────────────────────────────────────────────
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin notes',
    },
  ],
  timestamps: true,
}
