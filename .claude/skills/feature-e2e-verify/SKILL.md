---
name: feature-e2e-verify
description: Use after implementing or modifying a user-facing feature on the storefront or admin (any change in src/components/, src/app/(frontend)/, src/app/(payload)/, src/globals/, src/collections/ that the user could see in the browser). Triggers BEFORE saying the task is done. Writes or updates an e2e test, runs it, then drives a real Chromium via Playwright MCP to confirm the feature works end-to-end. Skip for non-user-facing changes (pure refactors, internal utilities, scripts, docs, tests).
---

# Feature E2E Verify

Goal: every user-facing change is proved working in a real browser before the task is reported done. No "looks right to me" — show it working.

## When to run

**Run** for:
- New or modified components under `src/components/` (storefront or shop)
- Changes to home / shop / admin pages under `src/app/(frontend)/` or `src/app/(payload)/`
- Schema changes that surface in the UI (`src/collections/`, `src/globals/`, `src/fields/`)
- API routes that the UI calls (`src/app/api/`)

**Skip** for:
- Pure refactors with no behavioural change
- Tests, scripts, docs
- Tooling config (eslint, tsconfig, next.config) unless it affects rendering
- Backend-only utilities the UI doesn't reach

## Workflow (in order)

### 1. Add or update the e2e test

The home suite is [tests/e2e/frontend.e2e.spec.ts](../../../tests/e2e/frontend.e2e.spec.ts). For other pages, add a new spec next to it (e.g. `shop.e2e.spec.ts`, `product-detail.e2e.spec.ts`). Each spec should:

- Import `{ test, expect }` from `@playwright/test`.
- Set a constant base URL (`const HOME = 'http://localhost:3000'`).
- Group tests inside a `test.describe(...)` named after the feature.
- Assert behaviour, not markup. Prefer `getByRole`, `getByText`, `toBeVisible()`, `toHaveAttribute()`, `toHaveText()` over brittle class selectors. Use class selectors only when the design system genuinely doesn't expose accessible names.
- Cover at least: it renders, it responds to one realistic interaction, it has no console errors during load.

For changes that touch home, **extend** the existing suite — don't duplicate.

### 2. Run the suite

```bash
pnpm exec playwright test tests/e2e/<file>.e2e.spec.ts --reporter=line
```

The Playwright config reuses an existing dev server on `:3000`. If one isn't running, start it: `pnpm dev` (or use `preview_start` if the Claude Preview MCP is available).

If the chromium binary is missing (`Executable doesn't exist at .../Google Chrome for Testing.app`):
```bash
pnpm exec playwright install chromium
```

Fix any genuine failures. Don't disable tests to make them pass.

### 3. Drive a real browser via Playwright MCP

Once the spec passes, prove it visually:

```
mcp__playwright__browser_navigate({ url: 'http://localhost:3000/<path>' })
mcp__playwright__browser_snapshot()          # accessibility tree
mcp__playwright__browser_take_screenshot()   # visual proof
```

For interactive features (click, fill, hover) use `browser_click`, `browser_fill`, etc. and re-snapshot after each step.

**If the Playwright MCP isn't loaded** (no `mcp__playwright__*` tools available): the project's `.mcp.json` is configured but Claude Code only reads MCP servers at startup. Tell the user to restart, and fall back to `pnpm exec playwright test` output as the proof.

### 4. Report

End the turn with:
- Pass/fail count from the test run (verbatim from the test output)
- One screenshot from the MCP browser (or skip if MCP wasn't available)
- File links to the test file and the components that were modified

## Anti-patterns

- ❌ "I checked the page looks fine" without running a test
- ❌ Selectors that depend on exact CSS classes when an accessible name exists
- ❌ Tests that pass because they assert nothing (`await page.goto(...)` with no `expect`)
- ❌ Marking the task done while tests are skipped, broken, or never run
- ❌ Hard-coded sleep timeouts to "wait for things" — use `waitForLoadState('networkidle')` or `expect(locator).toBeVisible()` (auto-waits)

## Quick reference

| Need | Use |
|------|-----|
| Run one spec | `pnpm exec playwright test tests/e2e/<file>.e2e.spec.ts --reporter=line` |
| Run all e2e | `pnpm test:e2e` |
| Run one test by name | `pnpm exec playwright test -g "renders every major home section"` |
| Open the HTML report | `pnpm exec playwright show-report` |
| Update browser binary | `pnpm exec playwright install chromium` |
| Existing home spec | [tests/e2e/frontend.e2e.spec.ts](../../../tests/e2e/frontend.e2e.spec.ts) |
| Existing admin spec | [tests/e2e/admin.e2e.spec.ts](../../../tests/e2e/admin.e2e.spec.ts) |
| Playwright config | [playwright.config.ts](../../../playwright.config.ts) |
