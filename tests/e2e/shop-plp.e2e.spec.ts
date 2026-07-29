import { test, expect } from '@playwright/test'

const SHOP = 'http://localhost:3000/shop'

test.describe('Storefront — shop PLP', () => {
  test('lists published products (not empty CMS catch-all)', async ({ page }) => {
    await page.goto(SHOP)

    await expect(page.locator('.plp-page')).toBeVisible()
    await expect(page.locator('h1')).toContainText(/every press/i)

    const grid = page.locator('.plp-grid')
    await expect(grid).toBeVisible()
    await expect(grid.locator('a[href^="/shop/"]')).not.toHaveCount(0)
  })
})
