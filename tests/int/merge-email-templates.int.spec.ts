import { describe, it, expect } from 'vitest'

import {
  mergeEmailTemplateBlock,
  mergeEmailTemplatesFromGlobal,
  getOrderTemplateBlock,
} from '@/lib/email/mergeEmailTemplates'
import { emailTemplatesSeedDefaults } from '@/seed/emailTemplatesSeedDefaults'

describe('mergeEmailTemplates', () => {
  it('fills missing packed/shipped copy from seed when CMS group is partial', () => {
    const merged = mergeEmailTemplatesFromGlobal({
      ...emailTemplatesSeedDefaults,
      orderPacked: { enabled: true, subject: 'Order {{orderId}} packed — Punyakoti Taila' },
      orderShipped: { enabled: true, subject: '' },
    } as never)

    const packed = getOrderTemplateBlock(merged, 'packed')
    expect(packed?.body).toContain('carefully packed')

    const shipped = getOrderTemplateBlock(merged, 'shipped')
    expect(shipped?.subject).toContain('shipped')
    expect(shipped?.headline).toContain('on the way')
  })

  it('respects explicit enabled: false', () => {
    const block = mergeEmailTemplateBlock(emailTemplatesSeedDefaults.orderPacked, {
      enabled: false,
      subject: emailTemplatesSeedDefaults.orderPacked.subject,
    })
    expect(block.enabled).toBe(false)
  })

  it('maps returned status to orderReturned template', () => {
    const merged = mergeEmailTemplatesFromGlobal(emailTemplatesSeedDefaults)
    const block = getOrderTemplateBlock(merged, 'returned')
    expect(block?.headline).toMatch(/return/i)
  })
})
