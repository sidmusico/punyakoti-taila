'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { cn } from '@/utilities/ui'

/* ── Types ────────────────────────────────────────────────── */
interface NavLink { label: string; href: string; openInNewTab?: boolean }

export interface SiteHeaderProps {
  /** Announcement bar */
  announcementEnabled?: boolean
  announcementText?: string
  announcementHighlight?: string
  announcementLink?: string

  /** Navigation */
  navLinks?: NavLink[]

  /** Logo */
  logoText?: string
  logoTagline?: string
  logoImageUrl?: string | null
}

/* ── Inline SVG icons ────────────────────────────────────── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
)
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
  </svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/>
  </svg>
)
const BagIcon = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>
  </svg>
)
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h10"/>
  </svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
)

/* ── Wordmark ────────────────────────────────────────────── */
function Wordmark({ size = 20, color = 'var(--green-900)', showTagline = true, logoText = 'Punyakoti·', logoTagline = 'T A I L A' }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1, color }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '-0.01em',
      }}>
        {logoText.endsWith('·')
          ? <>{logoText.slice(0, -1)}<span style={{ color: 'var(--mustard-500)' }}>·</span></>
          : logoText}
      </span>
      {showTagline && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: size * 0.32,
          letterSpacing: '0.32em',
          marginTop: size * 0.18,
          color: color === 'var(--cream-100)' ? 'rgba(251,247,236,0.55)' : 'var(--wood-600)',
        }}>
          {logoTagline}
        </span>
      )}
    </div>
  )
}

/* ── Default nav ─────────────────────────────────────────── */
const DEFAULT_NAV: NavLink[] = [
  { label: 'Oils',      href: '/shop' },
  { label: 'Wellness',  href: '/shop?category=wellness' },
  { label: 'Gift sets', href: '/shop?category=gift-sets' },
  { label: 'Our story', href: '/about' },
  { label: 'Journal',   href: '/journal' },
]

/* ── Component ───────────────────────────────────────────── */
export function SiteHeader({
  announcementEnabled = true,
  announcementText    = 'Free shipping on orders over ₹999 · Single-origin · Pressed weekly',
  announcementHighlight = '₹999',
  announcementLink,
  navLinks,
  logoText    = 'Punyakoti·',
  logoTagline = 'T A I L A',
  logoImageUrl,
}: SiteHeaderProps) {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const { items } = useCartStore()
  const cartCount = items.reduce((a, i) => a + i.quantity, 0)

  const links = navLinks && navLinks.length > 0 ? navLinks : DEFAULT_NAV

  /* scroll listener */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* focus search input when opened */
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* announcement text with highlight */
  function renderAnnouncement() {
    if (!announcementHighlight || !announcementText.includes(announcementHighlight)) {
      return <>{announcementText}</>
    }
    const [before, after] = announcementText.split(announcementHighlight)
    return (
      <>
        {before}
        <span style={{ color: 'var(--mustard-400)', fontWeight: 600 }}>{announcementHighlight}</span>
        {after}
      </>
    )
  }

  return (
    <>
      {/* ── Announcement bar ──────────────────────────────── */}
      {announcementEnabled && (
        <div
          style={{
            background: 'var(--green-950)',
            color: 'var(--cream-100)',
            fontSize: 12,
            letterSpacing: '0.08em',
            textAlign: 'center',
            padding: '9px 16px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
          }}
        >
          {announcementLink
            ? <Link href={announcementLink} className="hover:underline">{renderAnnouncement()}</Link>
            : renderAnnouncement()}
        </div>
      )}

      {/* ── Main header ───────────────────────────────────── */}
      <header
        className={cn('sticky top-0 z-50 transition-all duration-200', scrolled ? 'pt-header-blur shadow-sm' : '')}
        style={{
          background: scrolled ? undefined : 'var(--cream-200)',
          borderBottom: '1px solid var(--cream-400)',
        }}
      >
        {/* Search bar overlay */}
        {searchOpen && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'var(--cream-200)',
              display: 'flex', alignItems: 'center',
              padding: '0 48px', gap: 16,
            }}
          >
            <SearchIcon />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search oils, recipes, journal..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 16,
                color: 'var(--ink-900)',
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              style={{ color: 'var(--ink-500)', cursor: 'pointer', padding: 8 }}
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* ── Desktop nav ─────────────────────────────────── */}
        <div
          className="hidden md:flex items-center justify-between"
          style={{ padding: '18px 48px', maxWidth: 'var(--container-wide)', margin: '0 auto' }}
        >
          {/* Left: Logo + nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <Link href="/" aria-label="Punyakoti Taila home">
              {logoImageUrl ? (
                <Image src={logoImageUrl} alt={logoText} width={120} height={40} style={{ height: 40, width: 'auto' }} />
              ) : (
                <Wordmark size={20} showTagline={false} logoText={logoText} logoTagline={logoTagline} />
              )}
            </Link>

            <nav
              style={{
                display: 'flex',
                gap: 28,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '-0.005em',
                fontFamily: 'var(--font-body)',
              }}
            >
              {links.map(({ label, href, openInNewTab }) => (
                <Link
                  key={href}
                  href={href}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                  style={{ color: 'var(--green-900)' }}
                  className="hover:opacity-60 transition-opacity"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: icons */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 22, color: 'var(--green-900)' }}
          >
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <Link href="/account" className="hover:opacity-60 transition-opacity" aria-label="Account">
              <UserIcon />
            </Link>

            <Link href="/account?tab=wishlist" className="hover:opacity-60 transition-opacity" aria-label="Wishlist">
              <HeartIcon />
            </Link>

            {/* Cart with badge */}
            <Link
              href="/cart"
              className="hover:opacity-60 transition-opacity"
              aria-label={`Cart (${cartCount} items)`}
              style={{ position: 'relative' }}
            >
              <BagIcon />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute', top: -6, right: -8,
                    background: 'var(--mustard-500)',
                    color: 'var(--green-900)',
                    fontSize: 10, fontWeight: 700,
                    width: 16, height: 16,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Mobile nav bar ──────────────────────────────── */}
        <div
          className="flex md:hidden items-center justify-between"
          style={{ padding: '16px 20px' }}
        >
          <Link href="/" aria-label="Home">
            {logoImageUrl ? (
              <Image src={logoImageUrl} alt={logoText} width={100} height={32} style={{ height: 32, width: 'auto' }} />
            ) : (
              <Wordmark size={18} showTagline={false} logoText={logoText} logoTagline={logoTagline} />
            )}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--green-900)' }}>
            <Link href="/cart" style={{ position: 'relative' }} aria-label="Cart">
              <BagIcon />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -7,
                  background: 'var(--mustard-500)', color: 'var(--green-900)',
                  fontSize: 9, fontWeight: 700,
                  width: 14, height: 14, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(15,26,14,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full z-50 md:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{
          width: 'min(340px, 90vw)',
          background: 'var(--cream-100)',
          boxShadow: 'var(--sh-xl)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid var(--cream-400)',
        }}>
          <Wordmark size={18} showTagline={false} logoText={logoText} logoTagline={logoTagline} />
          <button
            onClick={() => setMobileOpen(false)}
            style={{ color: 'var(--ink-500)', padding: 4 }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {links.map(({ label, href, openInNewTab }) => (
            <Link
              key={href}
              href={href}
              target={openInNewTab ? '_blank' : undefined}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px',
                fontFamily: 'var(--font-body)',
                fontSize: 16, fontWeight: 500,
                color: 'var(--green-900)',
                borderBottom: '1px solid var(--cream-300)',
              }}
            >
              {label}
              <ArrowRightIcon />
            </Link>
          ))}
        </nav>

        {/* Drawer footer CTAs */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--cream-400)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '13px 18px',
              background: 'var(--green-800)', color: 'var(--cream-100)',
              borderRadius: 12,
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              textAlign: 'center', justifyContent: 'center',
            }}
          >
            <UserIcon /> My account
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '13px 18px',
              background: 'transparent', color: 'var(--green-900)',
              border: '1px solid var(--cream-400)',
              borderRadius: 12,
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              textAlign: 'center', justifyContent: 'center',
            }}
          >
            <BagIcon /> Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
        </div>
      </div>
    </>
  )
}
