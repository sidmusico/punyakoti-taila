import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { Wordmark } from '@/components/ui/pt/Wordmark'

/* ── Cache ───────────────────────────────────────────────────── */
const _fetchFooter = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'footer', depth: 0 })
  },
  ['footer-global'],
  { tags: ['global_footer'], revalidate: 3600 },
)

/** Never throws — returns null if the footer table doesn't exist yet (pre-migration). */
async function getFooterSettings() {
  try {
    return await _fetchFooter()
  } catch (err) {
    console.warn('[SiteFooter] Could not load footer global (run pnpm cms:sync):', err)
    return null
  }
}

/* ── Inline social SVGs ──────────────────────────────────────── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

/* ── Contact inline icons ────────────────────────────────────── */
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>
  </svg>
)
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M5 4h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 5a2 2 0 0 1 2-1Z"/>
  </svg>
)
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>
  </svg>
)

/* ── Eyebrow label ────────────────────────────────────────────── */
function FooterEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--mustard-400)',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--mustard-500)', flexShrink: 0 }} />
      {children}
    </div>
  )
}

/* ── Link list ────────────────────────────────────────────────── */
function FooterLinkList({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className="footer-link">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ── Component ───────────────────────────────────────────────── */
export async function SiteFooter() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const footer = (await getFooterSettings()) as any

  /* Brand */
  const tagline   = footer?.tagline   ?? 'Wood-pressed oils, one batch at a time.'
  const locations = footer?.locations ?? 'Bangalore · Erode · Kollam.'
  /* Contact — fallback defaults when CMS has no data */
  const rawContact = footer?.contact as { email?: string; phone?: string; address?: string } | undefined
  const contact = {
    email:   rawContact?.email   ?? 'hello@punyakotitaila.com',
    phone:   rawContact?.phone   ?? '+91 98765 43210',
    address: rawContact?.address ?? 'Bangalore, Karnataka',
  }
  const social    = footer?.social  as { instagram?: string; youtube?: string; facebook?: string; twitter?: string; whatsapp?: string } | undefined

  /* Social — always show defaults if CMS has none configured */
  const resolvedSocial = {
    instagram: social?.instagram ?? 'https://www.instagram.com/punyakoitaila',
    youtube:   social?.youtube   ?? 'https://www.youtube.com/@punyakotitaila',
    facebook:  social?.facebook  ?? 'https://www.facebook.com/punyakotitaila',
    twitter:   social?.twitter   ?? 'https://x.com/punyakotitaila',
    whatsapp:  social?.whatsapp  ?? 'https://wa.me/919876543210',
  }

  /* Link columns */
  const shopHeading  = footer?.shopColumnHeading  ?? 'Shop'
  const learnHeading = footer?.learnColumnHeading ?? 'Learn'
  const helpHeading  = footer?.helpColumnHeading  ?? 'Help'
  const legalHeading = footer?.legalColumnHeading ?? 'Legal'

  const shopLinks  = (footer?.shopLinks  ?? []) as Array<{ label: string; href: string }>
  const learnLinks = (footer?.learnLinks ?? []) as Array<{ label: string; href: string }>
  const helpLinks  = (footer?.helpLinks  ?? []) as Array<{ label: string; href: string }>
  const legalLinks = (footer?.legalLinks ?? []) as Array<{ label: string; href: string }>

  /* Bottom bar */
  const legalEntityName = footer?.legalEntityName ?? 'Punyakoti Foods Pvt. Ltd.'
  const gstin           = footer?.gstin           ?? ''
  const footerNote      = footer?.footerNote      ?? 'Made slowly in Bangalore'
  const versionBadge    = footer?.versionBadge    ?? ''

  /* Default links if CMS is empty */
  const resolvedShopLinks  = shopLinks.length  > 0 ? shopLinks  : [
    { label: 'All oils',   href: '/shop' },
    { label: 'Sesame',     href: '/shop/sesame-oil' },
    { label: 'Coconut',    href: '/shop/coconut-oil' },
    { label: 'Groundnut',  href: '/shop/groundnut-oil' },
    { label: 'Mustard',    href: '/shop/mustard-oil' },
    { label: 'Wellness',   href: '/shop?category=wellness' },
    { label: 'Gift sets',  href: '/shop?category=gift-sets' },
  ]
  const resolvedLearnLinks = learnLinks.length > 0 ? learnLinks : [
    { label: 'Our story',   href: '/about' },
    { label: 'The press',   href: '/about#press' },
    { label: 'Journal',     href: '/journal' },
    { label: 'Recipes',     href: '/journal?tag=recipes' },
    { label: 'Lab reports', href: '/lab-reports' },
  ]
  const resolvedHelpLinks  = helpLinks.length  > 0 ? helpLinks  : [
    { label: 'Contact',        href: '/contact' },
    { label: 'Shipping',       href: '/shipping' },
    { label: 'Returns',        href: '/returns' },
    { label: 'FAQ',            href: '/support' },
    { label: 'Order tracking', href: '/account?tab=orders' },
  ]
  const resolvedLegalLinks = legalLinks.length > 0 ? legalLinks : [
    { label: 'Privacy',       href: '/privacy' },
    { label: 'Terms',         href: '/terms' },
    { label: 'Refund policy', href: '/returns' },
    { label: 'B2B / bulk',    href: '/wholesale' },
  ]

  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--wood-900)',
        color: 'var(--cream-100)',
      }}
    >
      {/* ── Main grid ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          padding: '80px 80px 48px',
        }}
        className="footer-grid-outer"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
            gap: 48,
          }}
          className="footer-grid"
        >
          {/* ── Brand column ──────────────────────────────────── */}
          <div>
            <Wordmark size={26} color="var(--cream-100)" showTagline />

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                lineHeight: 1.7,
                color: 'rgba(251,247,236,0.55)',
                marginTop: 20,
                maxWidth: 220,
              }}
            >
              {tagline}
            </p>

            {locations && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  color: 'rgba(251,247,236,0.35)',
                  marginTop: 10,
                }}
              >
                {locations}
              </p>
            )}

            {/* Contact */}
            <ul
              style={{
                marginTop: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontSize: 13,
                color: 'rgba(251,247,236,0.55)',
                fontFamily: 'var(--font-body)',
              }}
            >
                {contact.email && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MailIcon />
                    <a href={`mailto:${contact.email}`} style={{ color: 'inherit' }}
                      className="footer-contact-link">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PhoneIcon />
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}
                      className="footer-contact-link">
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <PinIcon />
                    <span>{contact.address}</span>
                  </li>
                )}
              </ul>

            {/* Social icons — always rendered with fallback defaults */}
            <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { key: 'instagram' as const, label: 'Instagram', Icon: InstagramIcon },
                { key: 'youtube'   as const, label: 'YouTube',   Icon: YouTubeIcon },
                { key: 'facebook'  as const, label: 'Facebook',  Icon: FacebookIcon },
                { key: 'twitter'   as const, label: 'X/Twitter', Icon: TwitterIcon },
                { key: 'whatsapp'  as const, label: 'WhatsApp',  Icon: WhatsAppIcon },
              ].map(({ key, label, Icon }) => {
                const url = resolvedSocial[key]
                if (!url) return null
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="footer-social-icon"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          {/* ── Shop column ───────────────────────────────────── */}
          <div>
            <FooterEyebrow>{shopHeading}</FooterEyebrow>
            <FooterLinkList links={resolvedShopLinks} />
          </div>

          {/* ── Learn column ──────────────────────────────────── */}
          <div>
            <FooterEyebrow>{learnHeading}</FooterEyebrow>
            <FooterLinkList links={resolvedLearnLinks} />
          </div>

          {/* ── Help column ───────────────────────────────────── */}
          <div>
            <FooterEyebrow>{helpHeading}</FooterEyebrow>
            <FooterLinkList links={resolvedHelpLinks} />
          </div>

          {/* ── Legal column ──────────────────────────────────── */}
          <div>
            <FooterEyebrow>{legalHeading}</FooterEyebrow>
            <FooterLinkList links={resolvedLegalLinks} />
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div
          style={{
            marginTop: 72,
            paddingTop: 24,
            borderTop: '1px solid rgba(245,239,224,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'rgba(251,247,236,0.35)',
            }}
          >
            © {year} {legalEntityName}
            {gstin && <> · GSTIN {gstin}</>}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 12,
              color: 'rgba(251,247,236,0.35)',
            }}
          >
            {footerNote && (
              <span style={{ fontFamily: 'var(--font-body)' }}>{footerNote}</span>
            )}
            {versionBadge && (
              <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                {versionBadge}
              </span>
            )}
          </div>
        </div>
      </div>

    </footer>
  )
}
