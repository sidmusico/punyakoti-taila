import type { Payload } from 'payload'
import type { Order } from '@/payload-types'

import {
  getOrderTemplateBlock,
  isEmailTemplateEnabled,
  loadEmailTemplates,
  type EmailTemplatesGlobal,
} from '@/lib/email/loadEmailTemplates'
import {
  type OrderEmailData,
  renderOrderEmailHtml,
  renderSimpleEmailHtml,
  renderSubject,
} from '@/lib/email/renderOrderEmail'
import { sendResendEmail } from '@/lib/email/resendSend'
import {
  emailTemplatesSeedDefaults,
  ORDER_STATUS_TO_TEMPLATE,
  type OrderEmailTemplateKey,
} from '@/seed/emailTemplatesSeedDefaults'
import type { EmailTemplateBlock } from '@/seed/emailTemplatesSeedDefaults'
import { getServerSideURL } from '@/utilities/getURL'

export type { OrderEmailData, OrderEmailLine } from '@/lib/email/renderOrderEmail'

export function orderToEmailData(order: Order): OrderEmailData {
  const addr = order.shippingAddress
  return {
    orderId: order.orderId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    items: (order.items ?? []).map((i) => ({
      productName: i.productName,
      variantSize: i.variantSize,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      imageUrl: i.imageUrl,
    })),
    subtotal: order.subtotal,
    discount: order.discount ?? 0,
    shippingFee: order.shippingFee ?? 0,
    total: order.total,
    deliveryMethod: order.deliveryMethod ?? order.deliveryDetails?.label ?? null,
    trackingNumber: order.trackingNumber ?? null,
    courierPartner: order.courierPartner ?? null,
    shippingAddress: addr
      ? {
          name: addr.name,
          line1: addr.line1,
          line2: addr.line2,
          landmark: (addr as { landmark?: string | null }).landmark ?? null,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
        }
      : null,
  }
}

function shopUrl() {
  return getServerSideURL() || 'https://punyakoti-taila.vercel.app'
}

function defaultsTemplates(): EmailTemplatesGlobal {
  return emailTemplatesSeedDefaults as EmailTemplatesGlobal
}

async function sendOrderTemplate(
  templates: EmailTemplatesGlobal,
  status: OrderEmailTemplateKey,
  order: OrderEmailData,
  to: string,
): Promise<{ sent: boolean; skipped?: boolean; error?: string; skipReason?: string }> {
  const block = getOrderTemplateBlock(templates, status)
  if (!block) {
    const raw = templates[ORDER_STATUS_TO_TEMPLATE[status]] as EmailTemplateBlock | undefined
    const reason = !raw
      ? 'no_template'
      : raw.enabled === false
        ? 'disabled'
        : 'missing_subject'
    return { sent: false, skipped: true, skipReason: reason }
  }
  const ctx = {
    customerName: order.customerName,
    orderId: order.orderId,
    trackingNumber: order.trackingNumber ?? '',
    courier: order.courierPartner ?? '',
    deliveryMethod: order.deliveryMethod ?? '',
    shopUrl: shopUrl(),
  }
  return sendResendEmail({
    to,
    subject: renderSubject(block, ctx),
    html: renderOrderEmailHtml(block, order, shopUrl()),
    entityRef: `order-${order.orderId}-${status}-${Date.now()}`,
  })
}

export function renderOrderConfirmationHtml(
  o: OrderEmailData,
  templates: EmailTemplatesGlobal = defaultsTemplates(),
): string {
  const block = getOrderTemplateBlock(templates, 'confirmed')
  if (!block) return ''
  return renderOrderEmailHtml(block, o, shopUrl())
}

export function renderOrderStatusHtml(
  o: OrderEmailData,
  status: string,
  templates: EmailTemplatesGlobal = defaultsTemplates(),
): string {
  const block = getOrderTemplateBlock(templates, status as OrderEmailTemplateKey)
  if (!block) return ''
  return renderOrderEmailHtml(block, o, shopUrl())
}

export async function sendOrderConfirmationEmail(o: OrderEmailData, payload?: Payload) {
  const templates = await loadEmailTemplates(payload)
  return sendOrderTemplate(templates, 'confirmed', o, o.customerEmail)
}

export async function sendOrderStatusEmail(
  order: Order,
  status: NonNullable<Order['status']>,
  payload?: Payload,
) {
  if (status === 'pending') return { sent: false, skipped: true, skipReason: 'pending_status' }

  const key = status as OrderEmailTemplateKey
  if (!(key in ORDER_STATUS_TO_TEMPLATE)) {
    return { sent: false, skipped: true, skipReason: 'unknown_status' }
  }

  const templates = await loadEmailTemplates(payload)
  if (!getOrderTemplateBlock(templates, key)) {
    return { sent: false, skipped: true, skipReason: 'template_unavailable' }
  }

  const data = orderToEmailData(order)
  if (!data.customerEmail?.trim()) {
    return { sent: false, skipped: true, skipReason: 'no_customer_email' }
  }
  return sendOrderTemplate(templates, key, data, data.customerEmail)
}

export async function sendOrderPaymentRefundedEmail(order: Order, payload?: Payload) {
  const templates = await loadEmailTemplates(payload)
  const data = orderToEmailData(order)
  return sendOrderTemplate(templates, 'refunded', data, data.customerEmail)
}

export async function sendWelcomeEmail(args: {
  customerName: string
  customerEmail: string
  payload?: Payload
}) {
  const templates = await loadEmailTemplates(args.payload)
  const block = templates.welcome as EmailTemplateBlock | undefined
  if (!isEmailTemplateEnabled(block)) return { sent: false, skipped: true, skipReason: 'welcome_disabled' }
  const ctx = { customerName: args.customerName, email: args.customerEmail, shopUrl: shopUrl() }
  const origin = shopUrl()
  return sendResendEmail({
    to: args.customerEmail,
    subject: renderSubject(block, ctx),
    html: renderSimpleEmailHtml(block, ctx, origin, { welcome: true }),
  })
}

export function renderWelcomeEmailHtml(
  customerName: string,
  customerEmail: string,
  templates: EmailTemplatesGlobal = defaultsTemplates(),
  origin?: string,
): string {
  const block = templates.welcome as EmailTemplateBlock | undefined
  if (!block) return ''
  const site = origin ?? shopUrl()
  const ctx = { customerName, email: customerEmail, shopUrl: site }
  return renderSimpleEmailHtml(block, ctx, site, { welcome: true })
}

export async function sendAuthTemplateEmail(args: {
  template: 'otpEmail' | 'signupConfirmation'
  to: string
  ctx: Record<string, string>
  payload?: Payload
}) {
  const templates = await loadEmailTemplates(args.payload)
  const block = templates[args.template] as EmailTemplateBlock | undefined
  if (!isEmailTemplateEnabled(block)) return { sent: false, skipped: true, skipReason: 'auth_template_disabled' }
  const ctx = { ...args.ctx, shopUrl: shopUrl() }
  return sendResendEmail({
    to: args.to,
    subject: renderSubject(block, ctx),
    html: renderSimpleEmailHtml(block, ctx, shopUrl()),
  })
}
