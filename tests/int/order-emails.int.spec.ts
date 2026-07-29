import { describe, it, expect } from 'vitest'

import {
  renderOrderConfirmationHtml,
  renderOrderStatusHtml,
  renderWelcomeEmailHtml,
} from '@/lib/email/sendOrderEmails'
import { EMAIL_LOGO_URL } from '@/lib/email/orderEmailLayout'

describe('order transactional emails', () => {
  const base = {
    orderId: 'PT-1',
    customerName: 'Priya',
    customerEmail: 'priya@example.com',
    items: [{ productName: 'Groundnut Oil', variantSize: '500ml', quantity: 1, lineTotal: 500 }],
    subtotal: 500,
    total: 599,
    shippingFee: 99,
  }

  it('renders confirmation HTML', () => {
    const html = renderOrderConfirmationHtml(base)
    expect(html).toContain('PT-1')
    expect(html).toContain('Groundnut Oil')
  })

  it('renders packed and returned status templates', () => {
    const html = renderOrderStatusHtml(base, 'packed')
    expect(html).toContain('packed')
    const returned = renderOrderStatusHtml(base, 'returned')
    expect(returned).toContain('Return')
  })

  it('renders shipped status with tracking and thumbnail', () => {
    const html = renderOrderStatusHtml(
      {
        ...base,
        trackingNumber: 'TRK123',
        courierPartner: 'Delhivery',
        items: [{ ...base.items[0]!, imageUrl: 'https://example.com/oil.jpg' }],
      },
      'shipped',
    )
    expect(html).toContain('on the way')
    expect(html).toContain('TRK123')
    expect(html).toContain('oil.jpg')
  })

  it('renders welcome email with logo, shop CTA, and env-specific shop URL', () => {
    const html = renderWelcomeEmailHtml('Priya', 'priya@example.com', undefined, 'http://localhost:3000')
    expect(html).toContain(EMAIL_LOGO_URL)
    expect(html).toContain('Shop oils')
    expect(html).toContain('href="http://localhost:3000/shop"')
    expect(html).toContain('Visit the shop')
    expect(html).toContain('Welcome, Priya')
  })
})
