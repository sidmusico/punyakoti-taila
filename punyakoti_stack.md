# Indian E-Commerce Platform — Claude Code Project Setup

## Project Overview

Build a modern, scalable, SEO-friendly, fully responsive Indian e-commerce platform using:

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

Target:
- 100–200 products/SKUs
- Indian payment support including UPI
- Authentication with Google + Email login
- Admin dashboard
- Newsletter support
- Production-ready architecture

---

# 1. Recommended Folder Structure

```txt
apps/
  web/
    src/
      app/
      components/
      features/
      hooks/
      lib/
      services/
      store/
      styles/
      types/
      utils/
      providers/
      config/

      app/
        (public)/
        (auth)/
        (shop)/
        admin/
        api/

      features/
        auth/
        cart/
        checkout/
        orders/
        products/
        categories/
        wishlist/
        search/
        newsletter/
        users/
        payments/

  cms/
    payload.config.ts
    collections/
    globals/
    hooks/
    access/

packages/
  ui/
  shared/
  config/

```

---

# 2. Tech Stack Decisions

## Frontend

- Next.js App Router
- React Server Components where possible
- TypeScript strict mode
- Tailwind CSS
- ShadCN UI
- Framer Motion
- Zustand
- React Hook Form
- Zod validation

## Backend

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions

## CMS

- Payload CMS

## Payments

- Razorpay

## Emails

- Resend

## Hosting

- Vercel

---

# 3. CLAUDE.md

Create a file named:

```txt
CLAUDE.md
```

Add the following content:

```md
# Project Rules

You are working on a modern production-grade Indian e-commerce platform.

## Core Stack
- Next.js App Router
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

## Development Rules

- Always use TypeScript strict typing.
- Use App Router only.
- Prefer Server Components where possible.
- Keep components small and reusable.
- Use feature-based architecture.
- Avoid large monolithic components.
- Use Tailwind utility classes.
- Use ShadCN components wherever possible.
- Use Zustand for client state.
- Use React Query only if necessary.
- Use server actions where appropriate.
- Ensure SEO optimization.
- Ensure accessibility.
- Follow clean architecture.
- Avoid unnecessary dependencies.
- Do not duplicate logic.
- Create reusable utility functions.
- Use environment variables securely.
- Use Zod validation for forms and APIs.
- Use proper loading and error states.
- Optimize for performance and Core Web Vitals.

## Authentication

Use Supabase Auth with:
- Google OAuth
- Email/password
- Optional magic links

## Payments

Use Razorpay:
- UPI
- Cards
- Wallets
- Net Banking

Verify payments securely using webhooks.

## Emails

Use Resend for:
- Welcome emails
- Order confirmation
- Shipping updates
- Newsletter emails

## Database

Use Supabase PostgreSQL.

Implement:
- Row Level Security
- Proper indexes
- Optimized queries
- Reusable database types

## Styling

Use:
- Tailwind CSS
- ShadCN UI
- Responsive mobile-first design

## Coding Standards

- Prefer composition over inheritance.
- Keep files modular.
- Use absolute imports.
- Use async/await.
- Avoid any type.
- Use enums/constants for reusable values.
- Use feature-based naming.

## Performance

- Use image optimization.
- Use lazy loading.
- Use dynamic imports where beneficial.
- Minimize client-side JavaScript.
- Use caching strategies.

## SEO

Implement:
- Metadata API
- OpenGraph tags
- Structured data
- Sitemap
- Robots.txt

## Security

Implement:
- CSRF protection
- Secure cookies
- Input validation
- Rate limiting where required
- Secure webhook validation

## Deployment

Deploy frontend to Vercel.
Use environment variables properly.
Maintain separate environments:
- local
- development
- staging
- production

```

---

# 4. Initial Claude Prompt

Use this as the first prompt in Claude Code:

```txt
Create a modern production-ready Indian e-commerce platform using:

- Next.js App Router
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

Requirements:
- Fully responsive
- SEO optimized
- Mobile-first design
- Clean scalable architecture
- Feature-based folder structure
- Reusable components
- Authentication with Google + email login
- Product listing and detail pages
- Cart and checkout flow
- Razorpay payment integration with UPI
- Order management
- Newsletter support
- Welcome/order/shipping emails
- Admin dashboard
- CMS integration with Payload
- Supabase database integration
- Proper TypeScript typing
- Zod validation
- Loading and error states
- Production-grade coding standards

Please:
1. Initialize the project.
2. Setup Tailwind and ShadCN.
3. Setup Supabase.
4. Setup Payload CMS.
5. Setup authentication.
6. Create reusable layouts.
7. Create homepage.
8. Create product listing pages.
9. Create product detail page.
10. Create cart and checkout.
11. Setup Razorpay integration.
12. Setup Resend email service.
13. Add SEO support.
14. Add admin dashboard.
15. Add deployment configuration for Vercel.
16. Use clean architecture and best practices.
```

---

# 5. Environment Variables

Create:

```txt
.env.local
```

```env
# NEXT
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# PAYLOAD
PAYLOAD_SECRET=
DATABASE_URI=

# RAZORPAY
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# RESEND
RESEND_API_KEY=
EMAIL_FROM=noreply@example.com

# GOOGLE AUTH
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# CMS
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001

# APP
NODE_ENV=development
```

---

# 6. Suggested Database Tables

## users

```txt
id
name
email
phone
avatar_url
created_at
```

## products

```txt
id
title
slug
description
price
discount_price
sku
stock
images
category_id
is_active
created_at
```

## categories

```txt
id
name
slug
image
```

## cart_items

```txt
id
user_id
product_id
quantity
```

## orders

```txt
id
user_id
status
payment_status
total_amount
address
created_at
```

## order_items

```txt
id
order_id
product_id
quantity
price
```

## newsletter_subscribers

```txt
id
email
created_at
```

---

# 7. Recommended UI Pages

## Public

- Home
- Shop
- Product Details
- Categories
- Cart
- Checkout
- Order Success
- Login
- Signup
- Forgot Password
- About
- Contact
- Privacy Policy
- Terms

## User

- Profile
- Orders
- Wishlist
- Addresses

## Admin

- Dashboard
- Products
- Categories
- Orders
- Users
- Coupons
- Newsletter
- Analytics

---

# 8. Recommended Libraries

```bash
npm install zustand zod react-hook-form @hookform/resolvers
npm install @supabase/supabase-js
npm install razorpay
npm install resend
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install framer-motion
npm install sonner
npm install date-fns
```

---

# 9. Suggested API Structure

```txt
/api/auth
/api/products
/api/categories
/api/cart
/api/orders
/api/payments
/api/webhooks/razorpay
/api/newsletter
```

---

# 10. Razorpay Integration Notes

## Payment Flow

1. User places order.
2. Create Razorpay order.
3. Open Razorpay checkout.
4. Verify payment signature.
5. Store order in database.
6. Send confirmation email.

## Supported Methods

- UPI
- Cards
- Wallets
- Net Banking

---

# 11. Email Templates Needed

- Welcome Email
- Verify Email
- Password Reset
- Order Confirmation
- Shipping Update
- Delivered Confirmation
- Newsletter

---

# 12. SEO Checklist

- Metadata API
- Dynamic meta tags
- OpenGraph
- Twitter cards
- Structured JSON-LD
- Sitemap.xml
- Robots.txt
- Canonical URLs

---

# 13. Performance Checklist

- Next.js Image optimization
- Route-based code splitting
- Dynamic imports
- Server Components
- Edge caching
- Lazy loading
- Font optimization
- Minimal bundle size

---

# 14. Deployment Flow

## Frontend

Deploy using:
- Vercel

## CMS

Deploy Payload CMS separately.
Possible options:
- Railway
- Render
- DigitalOcean
- Fly.io

## Database

Use:
- Supabase PostgreSQL

---

# 15. Recommended Development Order

1. Project initialization
2. Tailwind + ShadCN setup
3. Authentication
4. Database schema
5. CMS setup
6. Product APIs
7. Product listing pages
8. Product detail pages
9. Cart
10. Checkout
11. Razorpay
12. Orders
13. Emails
14. Admin dashboard
15. SEO
16. Performance optimization
17. Deployment

---

# 16. Suggested Design Style

- Minimal modern UI
- Premium e-commerce feel
- Soft shadows
- Rounded corners
- Clean typography
- Mobile-first
- Fast interactions
- Smooth animations
- Accessible design

Suggested inspirations:
- Apple
- Nike
- CRED
- Nothing
- Minimal Indian D2C brands

---

# 17. Future Scalability

Architecture should support:

- 1000+ products
- Multi-vendor marketplace
- Mobile apps
- AI recommendations
- International shipping
- Multiple payment providers
- Advanced analytics
- Inventory automation

---

# 18. Recommended Vercel Settings

- Enable Edge Runtime where beneficial
- Enable image optimization
- Configure environment variables
- Use preview deployments
- Enable analytics

---

# 19. Suggested Supabase Features

Use:

- Auth
- PostgreSQL
- Storage
- Edge Functions
- Realtime (optional)
- Row Level Security
- Database triggers

---

# 20. Final Architecture Summary

## Frontend
- Next.js
- React
- TypeScript
- Tailwind
- ShadCN
- Zustand

## Backend
- Supabase
- Payload CMS

## Payments
- Razorpay

## Emails
- Resend

## Hosting
- Vercel

This setup provides:
- Excellent performance
- SEO optimization
- Low operational cost
- Modern developer experience
- Scalability
- Indian payment support
- Production-grade architecture

