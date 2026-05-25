import { test, expect, type Page } from '@playwright/test'

const HOME = 'http://localhost:3000'

/**
 * Storefront home-page suite. Asserts what a real visitor sees:
 *   - The right page loads (title + hero copy)
 *   - Every section we ship in HomePageView is present in the DOM
 *   - The site is centered on big screens and full-width on mobile
 *     (see doc/SITE_FRAME.md — body capped at --site-max-width)
 *   - Mobile viewport doesn't introduce horizontal overflow
 *   - CMS-backed images (ImageKit URLs) actually load
 *   - The page renders with no console errors
 *
 * These tests assume the dev server is up on :3000 (playwright.config.ts
 * webServer block ensures this) and the database has the seeded homepage
 * content. They tolerate sections having a CMS-supplied image OR falling
 * back to the SVG/text-only treatment.
 */
test.describe('Storefront — home page', () => {
  test('loads with the correct title and cinematic hero copy', async ({ page }) => {
    await page.goto(HOME)
    await expect(page).toHaveTitle(/Punyakoti Taila/i)

    const heroH1 = page.locator('h1').first()
    await expect(heroH1).toContainText(/essence of/i)
    await expect(heroH1).toContainText(/purity/i)

    const shopCta = page.getByRole('link', { name: /shop the collection/i }).first()
    await expect(shopCta).toBeVisible()
    await expect(shopCta).toHaveAttribute('href', '/shop')
  })

  test('renders every major home section', async ({ page }) => {
    await page.goto(HOME)

    const sections = [
      '.hp-hero-cinematic',
      '.hp-hero-editorial',
      '.hp-tradition',
      '.hp-process',
      '.hp-process-banner',
      '.hp-poetic',
      '.hp-why-section',
      '.hp-stats',
      '.hp-testimonials',
      '.hp-faq',
    ]

    for (const selector of sections) {
      await expect(page.locator(selector), `Missing section: ${selector}`).toBeVisible()
    }

    // Eyebrows for the four bg-image-bearing sections from the latest task.
    const eyebrows = ['How we press', 'An aside', 'By the numbers', 'Frequently asked']
    for (const text of eyebrows) {
      await expect(
        page.locator('.pt-eyebrow', { hasText: text }),
        `Missing eyebrow: ${text}`,
      ).toBeVisible()
    }
  })

  test('site frame caps body width on wide screens and stays flush below the cap', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 2000, height: 1000 })
    await page.goto(HOME)
    const wideBodyWidth = await page.evaluate(() => document.body.offsetWidth)
    expect(wideBodyWidth, 'body should be capped at --site-max-width (1600)').toBeLessThanOrEqual(
      1600,
    )
    expect(await page.evaluate(() => window.innerWidth)).toBe(2000)

    await page.setViewportSize({ width: 1280, height: 800 })
    const narrowBodyWidth = await page.evaluate(() => document.body.offsetWidth)
    expect(narrowBodyWidth, 'body should fill viewport when <= cap').toBe(1280)
  })

  test('mobile (375px) renders without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(HOME)

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(overflow.scrollWidth, 'no horizontal overflow on mobile').toBeLessThanOrEqual(
      overflow.clientWidth,
    )

    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('CMS-backed images (ImageKit) load successfully', async ({ page }) => {
    await page.goto(HOME)
    await page.waitForLoadState('networkidle')

    const imageStatuses = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLImageElement>('img'))
        .filter((img) => /ik\.imagekit\.io/.test(img.src))
        .map((img) => ({
          src: img.src,
          loaded: img.complete && img.naturalWidth > 0,
        })),
    )

    for (const status of imageStatuses) {
      expect(status.loaded, `ImageKit image failed to load: ${status.src}`).toBe(true)
    }
  })

  test('home page has no console errors during load', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await page.goto(HOME)
    await page.waitForLoadState('networkidle')

    // Third-party / dev noise we don't own. Add patterns as needed.
    const NOISE = [
      /Download the React DevTools/i,
      /Fast Refresh/i,
      /\[Fast Refresh\]/i,
      /favicon/i,
    ]
    const real = (msgs: string[]) => msgs.filter((m) => !NOISE.some((re) => re.test(m)))

    expect(real(consoleErrors), 'unexpected console.error during home load').toEqual([])
    expect(real(pageErrors), 'unexpected page error during home load').toEqual([])
  })

  test('FAQ items expand on click', async ({ page }) => {
    await page.goto(HOME)
    const firstFaq = page.locator('.hp-faq-item').first()
    await firstFaq.scrollIntoViewIfNeeded()
    // <details>/<summary> — the open attribute flips on click.
    await expect(firstFaq).not.toHaveAttribute('open', '')
    await firstFaq.locator('summary').click()
    await expect(firstFaq).toHaveAttribute('open', '')
  })

  test('no orphan section-has-bg-image (every flagged section has an inner image)', async ({
    page,
  }: {
    page: Page
  }) => {
    await page.goto(HOME)
    const orphans = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.section-has-bg-image'))
        .filter((el) => !el.querySelector(':scope > .section-bg-image'))
        .map((el) => el.className),
    )
    expect(orphans, 'section-has-bg-image without an inner .section-bg-image').toEqual([])
  })
})
