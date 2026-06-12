import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.describe('storefront login', () => {
  test('login page shows Google sign-in and uses cloud Supabase', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto(`${BASE}/login`)
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /send otp/i })).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('auth callback without code redirects to login with error', async ({ page }) => {
    await page.goto(`${BASE}/auth/callback`)
    await expect(page).toHaveURL(/\/login\?error=auth_callback/)
  })

  test('email tab shows sign-in and register forms', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await page.getByRole('button', { name: /^email$/i }).click()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await page.getByRole('button', { name: 'Create account', exact: true }).first().click()
    await expect(page.getByPlaceholder('Full name')).toBeVisible()
    await expect(page.locator('form').getByRole('button', { name: 'Create account' })).toBeVisible()
  })
})
