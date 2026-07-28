import { test, expect } from '@playwright/test'

/**
 * Saved addresses + billing.
 *
 * Storefront auth is Supabase (cloud) and not automatable in CI without a seeded
 * session, so the logged-in address-book CRUD is covered by the integration
 * suite (tests/int/account-addresses.int.spec.ts) + the API auth guard here.
 * The guest-visible billing "same as shipping" flow is driven in a real browser.
 */

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

// A persisted cart so /checkout renders the wizard instead of the empty state.
const CART = {
  state: {
    items: [
      {
        id: 'demo-500ml',
        productId: 'demo',
        slug: 'wood-pressed-groundnut-oil',
        name: 'Wood-Pressed Groundnut Oil',
        variantSize: '500ml',
        sku: 'PT-GN-500',
        price: 499,
        image: '',
        quantity: 3,
        isSubscription: false,
      },
    ],
    isOpen: false,
  },
  version: 0,
}

test.describe('Account addresses & billing', () => {
  test('address book requires login', async ({ page }) => {
    await page.goto(`${BASE}/account/addresses`)
    await expect(page).toHaveURL(/\/login/)
  })

  test('address API rejects unauthenticated writes', async ({ request }) => {
    const res = await request.post(`${BASE}/api/account/addresses`, {
      data: { fullName: 'Test', line1: '1 St', city: 'BLR', state: 'KA', pincode: '560001' },
    })
    expect(res.status()).toBe(401)
  })

  test('checkout billing "same as shipping" toggle reveals billing fields', async ({ page }) => {
    await page.addInitScript((cart) => {
      window.localStorage.setItem('pt-cart', JSON.stringify(cart))
      // Suppress the newsletter popup so it can't intercept the checkout flow.
      window.localStorage.setItem('pt-news-subscribed', '1')
    }, CART)

    await page.goto(`${BASE}/checkout`)

    // Contact step → fill and continue.
    await page.getByPlaceholder('priya@example.com').fill('priya@example.com')
    await page.getByPlaceholder('9876543210').fill('9876543210')
    await page.getByRole('button', { name: /continue to shipping/i }).click()

    // Shipping step: the billing checkbox is present and checked by default.
    const billingToggle = page.getByLabel(/billing address is the same as my shipping address/i)
    await expect(billingToggle).toBeVisible()
    await expect(billingToggle).toBeChecked()

    // Billing fields are hidden while "same as shipping" is on…
    await expect(page.getByPlaceholder('House / flat / street')).toHaveCount(1)

    // …and revealed when it is unchecked.
    await billingToggle.uncheck()
    await expect(page.getByLabel('Address line 1', { exact: true })).toHaveCount(2)
  })

  test('delivery methods render on the Delivery step', async ({ page }) => {
    await page.addInitScript((cart) => {
      window.localStorage.setItem('pt-cart', JSON.stringify(cart))
      window.localStorage.setItem('pt-news-subscribed', '1')
    }, CART)

    await page.goto(`${BASE}/checkout`)

    // Contact
    await page.getByPlaceholder('priya@example.com').fill('priya@example.com')
    await page.getByPlaceholder('9876543210').fill('9876543210')
    await page.getByRole('button', { name: /continue to shipping/i }).click()

    // Shipping (billing "same as shipping" stays checked so no billing needed)
    await page.getByPlaceholder('Priya Sharma').fill('Priya Sharma')
    await page.getByPlaceholder('House / flat / street').fill('12 MG Road')
    await page.getByPlaceholder('Bangalore').fill('Bangalore')
    await page.getByPlaceholder('Karnataka').fill('Karnataka')
    await page.getByPlaceholder('560001').fill('560001')
    await page.getByRole('button', { name: /continue to delivery/i }).click()

    // Delivery methods (CMS-driven, with a fallback) render as a radiogroup.
    const group = page.getByRole('radiogroup', { name: /delivery method/i })
    await expect(group).toBeVisible()
    await expect(group.getByText('Standard', { exact: true })).toBeVisible()
    await expect(group.getByText('Express', { exact: true })).toBeVisible()
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible()
  })
})
