# Site frame (centered max-width)

The storefront is capped at a maximum width and **centered with side gutters** on wide screens. Below the cap the layout fills the viewport — no visible change vs. the legacy behaviour. This doc explains the knobs, what they affect, and how to opt out per-page when you need a full-bleed exception.

> Scope: every route under `src/app/(frontend)/`. The Payload admin (`src/app/(payload)/`) has its own layout and is **not** affected.

---

## 1. The three CSS variables

Declared in [src/app/(frontend)/globals.css](../src/app/(frontend)/globals.css) on `:root`:

| Variable | Default | What it does |
|----------|---------|--------------|
| `--site-max-width`   | `1600px`   | Hard cap on the `<body>` width. Above this, the site is centered. Below it, no effect. |
| `--site-gutter-bg`   | `#ece3d0`  | Background colour shown either side of the centered site (set on `<html>`). |
| `--site-side-gutter` | `max(0px, calc((100vw - var(--site-max-width)) / 2))` | Computed width of one gutter at the current viewport. **Use this on `position: fixed` overlays** so they stay aligned to the centered frame. |

There's a separate **inner-content** cap (`--container-wide: 1440px`) that several home sections use via `.hp-container` / `.hp-max-1240`. That's untouched. The two work together: inner content caps at 1440 inside a 1600 frame, leaving ~80 px of natural padding on each side.

---

## 2. What you see

| Viewport width | Behaviour |
|---|---|
| ≤ 1600 px (most laptops, tablets, phones) | **No visible change.** Site fills the screen edge-to-edge as before. |
| > 1600 px (27" monitors, ultrawides, browser zoomed out) | Site is centered. Each side shows a gutter of `(viewport − 1600) / 2`. A subtle warm shadow separates the centered card from the gutter. |

Full-bleed sections (the dark green `BottleRowSection`, the `HomeHeroCinematic` 100vh hero) still span 100% — of the **constrained body**, not the viewport. Backgrounds end cleanly at the gutter, which is the desired "boxed site" look.

---

## 3. How fixed / sticky positioning behaves

This is the part most likely to trip up future work, so worth being explicit:

### Sticky (relative to body)

`SiteHeader` uses `sticky top-0`. Sticky elements are positioned within their containing block (`body`), so the header **sticks to the top of the viewport but only spans body width**. On wide screens it appears centered with gutters on each side — matching the rest of the site. ✓ Correct.

### Fixed (relative to viewport)

`position: fixed` elements **ignore body width** by default. On a 2000 px monitor with the site capped at 1600 px, a fixed element with `right: 0` would slide in from the far edge of the viewport — 200 px outside the centered site frame. That looks broken.

**Fix:** use `var(--site-side-gutter)` for the relevant edge. Pattern:

```tsx
// Cart drawer — flush with the right edge of the centered site:
<div
  className="fixed inset-y-0 z-50 ..."
  style={{ right: 'var(--site-side-gutter, 0px)' }}
/>

// Hypothetical left-side drawer:
<div
  className="fixed inset-y-0 z-50 ..."
  style={{ left: 'var(--site-side-gutter, 0px)' }}
/>
```

The fallback `0px` keeps the rule sane if the variable is ever unset.

Already applied in [src/components/shop/CartDrawer.tsx](../src/components/shop/CartDrawer.tsx).

**Exception:** backdrops / modal overlays that *should* cover the entire screen (dim everything including the gutters) keep `inset-0` — see the cart-drawer backdrop a few lines above the drawer itself.

---

## 4. Tweaking

All knobs live at the top of [src/app/(frontend)/globals.css](../src/app/(frontend)/globals.css):

```css
:root {
  --site-max-width: 1920px;    /* less aggressive — only ultrawides see the gutter */
  --site-max-width: 1440px;    /* more aggressive — laptops see the gutter too     */
  --site-gutter-bg: #2a2418;   /* dark gutter for a dramatic look                  */
  --site-gutter-bg: var(--cream-200);  /* match body bg = invisible gutter         */
}
```

To remove the soft shadow around the centered body:

```css
body { box-shadow: none; }
```

---

## 5. Per-page opt-out (full-bleed exceptions)

Want one route (a landing page, a marketing splash) to ignore the cap? Two patterns:

### A) Class on `<html>` from the page

```tsx
// src/app/(frontend)/landing/page.tsx
export default function LandingPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html:
        `document.documentElement.classList.add('site--unbounded')` }} />
      …
    </>
  )
}
```

```css
/* globals.css */
.site--unbounded body {
  max-width: none;
  box-shadow: none;
}
.site--unbounded {
  background: var(--bg);  /* gutter blends into body */
}
```

### B) Bleed a single section out of the frame

Add a wrapper that uses negative margins keyed to the gutter:

```tsx
<section
  style={{
    marginInline: 'calc(-1 * var(--site-side-gutter, 0px))',
    width: '100vw',
  }}
>
  …full-bleed content…
</section>
```

Use sparingly — the boxed look is the design goal.

---

## 6. Browser support

The cap relies on standard CSS — `max-width`, `margin-inline`, `calc()`, `max()`, `var()`. All supported in every browser shipped since 2021. No JavaScript involved. The change adds zero runtime cost.

---

## 7. Files touched

| Path | Change |
|------|--------|
| [src/app/(frontend)/globals.css](../src/app/(frontend)/globals.css) | Added `--site-max-width`, `--site-gutter-bg`, `--site-side-gutter` on `:root`. Added `max-width` + `margin-inline: auto` + soft shadow on `body`. Added gutter background on `html`. |
| [src/components/shop/CartDrawer.tsx](../src/components/shop/CartDrawer.tsx) | Drawer aligns to centered frame on wide screens via `right: var(--site-side-gutter)`. |

If you later add new `position: fixed` overlays (cookie banner, toast container, side panel, …), wire them through `--site-side-gutter` the same way.
