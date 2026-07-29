import type { EmailTemplateBlock } from '@/seed/emailTemplatesSeedDefaults'

import { applyTemplateStrings, bodyToHtml, type MergeContext } from '@/lib/email/mergeTemplate'
import { EMAIL_THEME, esc, orderEmailShell, rupee } from '@/lib/email/orderEmailLayout'

export type OrderEmailLine = {
  productName: string
  variantSize: string
  quantity: number
  lineTotal: number
  imageUrl?: string | null
}

export type OrderEmailData = {
  orderId: string
  customerName: string
  customerEmail: string
  items: OrderEmailLine[]
  subtotal: number
  discount?: number
  shippingFee?: number
  total: number
  deliveryMethod?: string | null
  trackingNumber?: string | null
  courierPartner?: string | null
  shippingAddress?: {
    name?: string | null
    line1?: string | null
    line2?: string | null
    landmark?: string | null
    city?: string | null
    state?: string | null
    pincode?: string | null
  } | null
}

function orderMergeContext(o: OrderEmailData, shopUrl: string): MergeContext {
  return {
    customerName: o.customerName,
    orderId: o.orderId,
    trackingNumber: o.trackingNumber ?? '',
    courier: o.courierPartner ?? '',
    deliveryMethod: o.deliveryMethod ?? '',
    shopUrl,
  }
}

function lineItemsBlock(items: OrderEmailLine[]): string {
  const t = EMAIL_THEME
  const rows = items
    .map((i) => {
      const src = i.imageUrl?.trim()
      const thumb = src
        ? `<img src="${esc(src)}" alt="" width="56" height="56" style="width:56px;height:56px;border-radius:${t.radiusSm};object-fit:cover;border:1px solid ${t.cardBorder};display:block;" />`
        : `<div style="width:56px;height:56px;border-radius:${t.radiusSm};background:#efe9db;border:1px solid ${t.cardBorder};"></div>`
      return `<tr>
        <td style="padding:12px 12px 12px 0;vertical-align:middle;width:64px;">${thumb}</td>
        <td style="padding:12px 0;border-bottom:1px solid ${t.cardBorder};vertical-align:middle;">
          <div style="font-size:14px;font-weight:600;color:${t.ink};">${esc(i.productName)}</div>
          <div style="font-size:12px;color:${t.inkSoft};margin-top:2px;">${esc(i.variantSize)} · Qty ${i.quantity}</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${t.cardBorder};text-align:right;vertical-align:middle;font-size:14px;font-weight:600;color:${t.green};white-space:nowrap;">
          ${rupee(i.lineTotal)}
        </td>
      </tr>`
    })
    .join('')
  return `<table style="width:100%;border-collapse:collapse;margin:20px 0 8px;">${rows}</table>`
}

function totalsBlock(o: OrderEmailData): string {
  const row = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:6px 0;color:${strong ? EMAIL_THEME.green : EMAIL_THEME.inkMuted};font-size:${strong ? '16px' : '14px'};font-weight:${strong ? 700 : 400};">${esc(label)}</td>
      <td style="padding:6px 0;text-align:right;color:${EMAIL_THEME.green};font-size:${strong ? '16px' : '14px'};font-weight:${strong ? 700 : 400};">${value}</td>
    </tr>`
  return `<table style="width:100%;border-collapse:collapse;margin-top:8px;">
    ${row('Subtotal', rupee(o.subtotal))}
    ${o.discount && o.discount > 0 ? row('Discount', `− ${rupee(o.discount)}`) : ''}
    ${row(
      'Shipping' + (o.deliveryMethod ? ` · ${o.deliveryMethod}` : ''),
      (o.shippingFee ?? 0) === 0 ? 'Free' : rupee(o.shippingFee ?? 0),
    )}
    ${row('Total (incl. GST)', rupee(o.total), true)}
  </table>`
}

function shippingAddressBlock(o: OrderEmailData): string {
  const addr = o.shippingAddress
  if (!addr) return ''
  const lines = [addr.name, addr.line1, addr.line2, addr.landmark, `${addr.city ?? ''} ${addr.state ?? ''} ${addr.pincode ?? ''}`.trim()]
    .filter(Boolean)
    .map((l) => esc(String(l)))
    .join('<br/>')
  return `<div style="margin-top:24px;padding-top:20px;border-top:1px solid ${EMAIL_THEME.cardBorder};">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:${EMAIL_THEME.inkSoft};margin-bottom:8px;">Shipping to</div>
    <div style="font-size:14px;color:${EMAIL_THEME.ink};line-height:1.55;">${lines}</div>
  </div>`
}

function trackingBlock(o: OrderEmailData): string {
  if (!o.trackingNumber && !o.courierPartner) return ''
  return `<div style="margin:16px 0;padding:14px 16px;background:#efe9db;border-radius:${EMAIL_THEME.radiusSm};font-size:14px;color:${EMAIL_THEME.ink};line-height:1.5;">
    ${o.courierPartner ? `<strong style="color:${EMAIL_THEME.greenDeep};">Courier</strong> ${esc(o.courierPartner)}<br/>` : ''}
    ${o.trackingNumber ? `<strong style="color:${EMAIL_THEME.greenDeep};">Tracking</strong> ${esc(o.trackingNumber)}` : ''}
  </div>`
}

export function renderOrderEmailHtml(
  block: EmailTemplateBlock,
  order: OrderEmailData,
  shopUrl: string,
): string {
  const ctx = orderMergeContext(order, shopUrl)
  const { headline, body } = applyTemplateStrings(block, ctx)
  const t = EMAIL_THEME

  let inner = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:${t.greenDeep};letter-spacing:-0.02em;">${esc(headline)}</h1>
    ${bodyToHtml(body)}
    ${trackingBlock(order)}`

  if (block.includeLineItems !== false && order.items.length) {
    inner += lineItemsBlock(order.items)
  }
  if (block.includeTotals) {
    inner += totalsBlock(order)
  }
  if (block.includeShippingAddress !== false) {
    inner += shippingAddressBlock(order)
  }

  const shell = orderEmailShell(inner, { preheader: headline, shopUrl })
  return mergeTagsInShell(shell, shopUrl)
}

export function renderSimpleEmailHtml(
  block: EmailTemplateBlock,
  ctx: MergeContext,
  shopUrl: string,
  options?: { welcome?: boolean },
): string {
  const { headline, body } = applyTemplateStrings(block, { ...ctx, shopUrl })
  const t = EMAIL_THEME
  const inner = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${t.greenDeep};">${esc(headline)}</h1>
    ${bodyToHtml(body)}`
  const shell = orderEmailShell(inner, {
    preheader: headline,
    shopUrl,
    shopCta: options?.welcome === true,
  })
  return mergeTagsInShell(shell, shopUrl)
}

function mergeTagsInShell(html: string, shopUrl: string): string {
  return html.replace(/\{\{shopUrl\}\}/g, esc(shopUrl))
}

function mergeTags(template: string, ctx: MergeContext): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const v = ctx[key]
    return v === undefined || v === null ? '' : esc(String(v))
  })
}

export function renderSubject(block: EmailTemplateBlock, ctx: MergeContext): string {
  return mergeTags(block.subject, ctx)
}
