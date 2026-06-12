# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

**After changing Payload collections/globals/DB schema (dev, keep existing data):** run **`pnpm db:sync`** (pick local or prod) or **`pnpm cms:sync`** against current `DATABASE_URL`. — regenerates the admin import map and `payload-types.ts`, then runs Drizzle push via `scripts/payload-db-sync.ts` (not a DB reset). Use a real terminal if Drizzle asks interactive questions; use **`pnpm db:local:fresh`** only when you intentionally want a wiped local DB.

**HTTP seed APIs (demo content / fresh DB):** see **`doc/SEED_APIS.md`**. CLI: **`pnpm seed`** (interactive local/prod) or **`pnpm seed -- local all`**. HTTP: `GET /api/seed-all`, `seed-categories`, `seed-media`, etc.

**Vercel deploy:** see **`doc/DEPLOY_VERCEL.md`** — env vars, `main` branch auto-deploy, one-time `pnpm cms:sync` on prod Postgres.

**Media hosting (ImageKit):** all uploads go to ImageKit via a cloud-storage adapter; the storefront reads `imagekitUrl` from each Media doc. To mirror local `assets/` → ImageKit → Payload Media in one shot, run **`GET /api/sync-assets`** (streams NDJSON progress). To refresh the generated catalog (after uploading via the ImageKit dashboard), run **`pnpm imagekit:list`**. Full guide: **`doc/IMAGEKIT.md`**.

**Site frame (centered max-width):** the storefront is capped at `--site-max-width` (default `1600px`) and centered with side gutters on wider screens. New `position: fixed` overlays (cart drawer, future cookie banners, etc.) must use `right: var(--site-side-gutter)` (or `left:`) to stay aligned to the centered frame — see **`doc/SITE_FRAME.md`** for variables, fixed/sticky positioning rules, and per-page opt-out.

**E2E verification after every user-facing change:** see **`.claude/skills/feature-e2e-verify/SKILL.md`**. After implementing/modifying a feature, write or update the relevant `tests/e2e/*.e2e.spec.ts`, run `pnpm exec playwright test ...`, and drive a real Chromium via the Playwright MCP (`.mcp.json` is configured; Claude Code restart needed first time). Don't report a feature done until the spec passes.

**Storefront globals ↔ repo seed JSON:** after changing `shop-listing`, `product-detail`, `cart`, `account`, `order-success`, or `homepage-settings` in Payload, follow `.cursor/skills/payload-storefront-seed-sync/SKILL.md` (export route + commit `src/seed/generated/*.json`).

---

# Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Zustand
- Supabase
- Payload CMS
- Razorpay
- Resend
- Vercel

---

# Development Rules

- Use TypeScript strict mode
- Use App Router only
- Prefer Server Components
- Keep components small and reusable
- Use feature-based architecture
- Avoid duplicated logic
- Use reusable hooks and utilities
- Use Zod validation
- Use clean folder structure
- Use environment variables securely
- Optimize Core Web Vitals
- Follow accessibility best practices
- Use semantic HTML
- Avoid unnecessary dependencies

---

# UI & Design Rules

- Mobile-first responsive design
- Premium organic D2C aesthetics
- Warm earthy color palette
- Minimal clean layouts
- Soft shadows and rounded corners
- Smooth subtle animations
- Maintain spacing consistency
- Ensure pixel-perfect responsiveness

---

# Responsive Design Rules

Support:
- Mobile
- Tablet
- Desktop
- Large screens

Requirements:
- Flexible layouts
- Responsive typography
- Responsive spacing
- Optimized images
- Touch-friendly interactions
- Sticky mobile navigation where needed

Test responsiveness on:
- iPhone
- Android
- iPad
- Desktop

---

# Coding Guidelines

## Naming
- Use meaningful names
- PascalCase for components
- camelCase for variables/functions
- kebab-case for folders

## Components
- Keep components under 200 lines where possible
- Split reusable UI
- Avoid prop drilling
- Prefer composition

## APIs
- Validate all inputs
- Use async/await
- Handle errors properly
- Use typed responses

## State
- Zustand for client state
- Keep server/client state separated

---

# Git Branch Rules

## Branch Naming

Feature:
feature/<ticket>-<feature-name>

Bug:
bugfix/<ticket>-<bug-name>

Hotfix:
hotfix/<ticket>-<issue-name>

Examples:
- feature/PT-101-product-page
- feature/PT-102-cart-flow
- bugfix/PT-110-mobile-navbar

---

# Commit Rules

Format:
type(scope): message

Examples:
- feat(cart): add cart drawer
- fix(auth): fix google login redirect
- refactor(product): optimize product card

Types:
- feat
- fix
- refactor
- chore
- docs
- style
- test

---

# Pull Request Rules

## PR Requirements

- Clear PR title
- Add summary
- Add screenshots/videos
- Mention testing done
- Keep PR focused and small
- Avoid unrelated changes

## PR Checklist

- Code builds successfully
- Lint passes
- Tests pass
- Responsive design verified
- Accessibility checked
- No console errors
- No unused code
- SEO metadata added where needed

---

# E2E Testing Rules

Use:
- Playwright

Requirements:
- Add E2E tests for critical flows
- Use reusable test utilities
- Keep tests stable and independent

Critical flows:
- Homepage load
- Product listing
- Product detail page
- Add to cart
- Checkout flow
- Login/signup
- Razorpay payment flow
- Order confirmation

Test devices:
- Mobile
- Tablet
- Desktop

---

# Performance Rules

- Use Next.js Image
- Lazy load where needed
- Minimize client components
- Use dynamic imports
- Avoid unnecessary re-renders
- Optimize bundle size

---

# SEO Rules

Implement:
- Metadata API
- OpenGraph tags
- Sitemap
- Robots.txt
- Structured data
- Canonical URLs

---

# Security Rules

- Validate inputs
- Secure Razorpay webhooks
- Protect admin routes
- Use Supabase RLS
- Avoid exposing secrets
- Sanitize user input

---

# Deployment

Frontend:
- Vercel

Database:
- Supabase

CMS:
- Payload CMS

---

# Goal

Create a fast, scalable, production-grade ecommerce platform with excellent UX, performance, SEO, maintainability, and responsive design.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
