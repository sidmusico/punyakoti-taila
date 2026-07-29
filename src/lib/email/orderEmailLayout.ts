/** Punyakoti storefront theme — inline styles for email clients. */
export const EMAIL_THEME = {
  pageBg: '#efe9db',
  cardBg: '#fdfaf2',
  cardBorder: '#e7e0cf',
  ink: '#2b2b2b',
  inkMuted: '#6b665a',
  inkSoft: '#8a8578',
  green: '#1c3a1c',
  greenDeep: '#244023',
  cream: '#fdfaf2',
  mustard: '#c4a035',
  radius: '16px',
  radiusSm: '10px',
} as const

/** Same asset as storefront header / Supabase auth emails (absolute URL for email clients). */
export const EMAIL_LOGO_URL =
  'https://ik.imagekit.io/zx7l7bhei/punyakoti-taila/brand/punyakoti-logo-no-bg.png?tr=w-280,f-auto,q-90'

export type OrderEmailShellOptions = {
  preheader?: string
  /** Storefront origin; use `{{shopUrl}}` if merged later. */
  shopUrl?: string
  /** Primary CTA button (welcome email). */
  shopCta?: boolean
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export const rupee = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

function shopLinkHref(shopUrl?: string): string {
  return shopUrl?.trim() ? esc(shopUrl.replace(/\/$/, '')) : '{{shopUrl}}'
}

export function emailShopCtaBlock(shopUrl: string, label = 'Shop oils'): string {
  const t = EMAIL_THEME
  const href = esc(`${shopUrl.replace(/\/$/, '')}/shop`)
  return `<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:28px auto 8px;">
    <tr>
      <td align="center" style="border-radius:12px;background-color:${t.greenDeep};">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:${t.cream};text-decoration:none;border-radius:12px;">
          ${esc(label)}
        </a>
      </td>
    </tr>
  </table>`
}

export function orderEmailShell(bodyHtml: string, opts?: OrderEmailShellOptions | string): string {
  const options: OrderEmailShellOptions =
    typeof opts === 'string' ? { preheader: opts } : (opts ?? {})
  const t = EMAIL_THEME
  const homeHref = shopLinkHref(options.shopUrl)
  const shopHref = options.shopUrl
    ? esc(`${options.shopUrl.replace(/\/$/, '')}/shop`)
    : '{{shopUrl}}/shop'
  const pre = options.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(options.preheader)}</div>`
    : ''
  const cta = options.shopCta && options.shopUrl ? emailShopCtaBlock(options.shopUrl) : ''
  return `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:${t.pageBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
${pre}
  <div style="max-width:600px;margin:0 auto;padding:36px 20px;">
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${homeHref}" style="text-decoration:none;">
        <img
          src="${EMAIL_LOGO_URL}"
          width="200"
          height="auto"
          alt="Punyakoti Taila"
          style="display:inline-block;border:0;max-width:200px;height:auto;"
        />
      </a>
    </div>
    <div style="background:${t.cardBg};border:1px solid ${t.cardBorder};border-radius:${t.radius};padding:32px 28px;box-shadow:0 12px 40px rgba(36,64,35,0.06);">
      ${bodyHtml}
      ${cta}
    </div>
    <p style="text-align:center;color:${t.inkSoft};font-size:12px;margin-top:24px;line-height:1.5;">
      Wood-pressed oils, one batch at a time · Bangalore<br/>
      <a href="${shopHref}" style="color:${t.greenDeep};text-decoration:none;font-weight:600;">Visit the shop</a>
    </p>
  </div>
</body></html>`
}
