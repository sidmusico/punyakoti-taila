import { test, expect } from '@playwright/test'

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

test.describe('Account profile', () => {
  test('edit profile requires login', async ({ page }) => {
    await page.goto(`${BASE}/account`)
    await expect(page).toHaveURL(/\/login/)
    await expect(page.url()).toContain('next=')
  })

  test('profile API rejects unauthenticated PATCH', async ({ request }) => {
    const res = await request.patch(`${BASE}/api/account/profile`, {
      data: { name: 'Test', phone: '9876543210' },
    })
    expect(res.status()).toBe(401)
  })
})
