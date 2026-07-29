import { test, expect } from '@playwright/test'

/**
 * Razorpay checkout wiring. Stubs window.Razorpay so we can assert the client
 * creates a real order via /api/checkout and opens Checkout.js with the right
 * options (order_id, key, UPI-first display config) — without depending on the
 * external Razorpay-hosted modal. Requires RAZORPAY_* test keys in the env.
 */

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

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

test('checkout opens Razorpay with a real order and UPI-first config', async ({ page }) => {
  await page.addInitScript((cart) => {
    window.localStorage.setItem('pt-cart', JSON.stringify(cart))
    window.localStorage.setItem('pt-news-subscribed', '1')
    // Stub Razorpay so no external modal / script load is needed.
    ;(window as unknown as { __rzpOpts?: unknown }).__rzpOpts = undefined
    ;(window as unknown as { Razorpay?: unknown }).Razorpay = class {
      constructor(opts: unknown) {
        ;(window as unknown as { __rzpOpts?: unknown }).__rzpOpts = opts
      }
      open() {
        ;(window as unknown as { __rzpOpened?: boolean }).__rzpOpened = true
      }
      on() {}
    }
  }, CART)

  await page.goto(`${BASE}/checkout`)

  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Checkout')

  // Contact
  await page.getByPlaceholder('priya@example.com').fill('priya@example.com')
  await page.getByPlaceholder('9876543210').fill('9876543210')
  await page.getByRole('button', { name: /continue to shipping/i }).click()

  // Shipping
  await page.getByPlaceholder('Priya Sharma').fill('Priya Sharma')
  await page.getByPlaceholder('House / flat / street').fill('12 MG Road')
  await page.getByPlaceholder('Bangalore').fill('Bangalore')
  await page.getByPlaceholder('Karnataka').fill('Karnataka')
  await page.getByPlaceholder('560001').fill('560001')
  await page.getByRole('button', { name: /continue to delivery/i }).click()

  // Delivery → Payment
  await page.getByRole('button', { name: /continue to payment/i }).click()

  // Pay — triggers POST /api/checkout then new Razorpay(opts)
  const orderResp = page.waitForResponse((r) => r.url().includes('/api/checkout') && r.request().method() === 'POST')
  await page.getByRole('button', { name: /^Pay ₹/i }).click()
  const resp = await orderResp
  expect(resp.status()).toBe(200)
  const body = await resp.json()
  expect(body.order_id ?? body.orderId).toMatch(/^order_/)

  // Razorpay was constructed with the right options.
  await expect
    .poll(async () => page.evaluate(() => (window as unknown as { __rzpOpts?: unknown }).__rzpOpts != null))
    .toBe(true)

  const opts = await page.evaluate(() => (window as unknown as { __rzpOpts?: Record<string, unknown> }).__rzpOpts)
  expect(opts?.order_id).toMatch(/^order_/)
  expect(String(opts?.key)).toMatch(/^rzp_test_/)
  const method = opts?.method as { upi?: boolean; card?: boolean } | undefined
  expect(method?.upi).toBe(true)
  expect(method?.card).toBe(false)
  const config = opts?.config as { display?: { sequence?: string[]; hide?: unknown[] } } | undefined
  expect(config?.display?.sequence?.[0]).toBe('upi')
  expect(config?.display?.hide).toEqual([{ method: 'card' }])
})
