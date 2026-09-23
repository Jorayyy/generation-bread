# Bread & Pastry Store — Project Context (for a fresh opencode session)

## Goal
Build a new e-commerce website for a **bread and pastry store**, modeled on the same architecture and feature set as the existing MicsApparel storefront:

- Reference repo (read-only for patterns, do NOT modify): `C:\Users\MEBS TACLOBAN\micsapparel-website`
- New project location: `C:\Users\MEBS TACLOBAN\Desktop\bread-pastry-store` (already created — scaffold into it)

## First things to ask the user before coding
1. Company/store name, tagline, and branding (logo file, colors, contact info, social links — Messenger/Facebook/TikTok placeholders are fine initially).
2. Product categories (e.g., breads, pastries, cakes, rolls?) and a seed list of products with prices (₱ or other currency?).
3. Fulfillment specifics: delivery/pickup, payment methods (MicsApparel used GCash/Maya/Bank/COD), operating hours, service area.
4. Whether to deploy to Vercel + Neon Postgres like the reference site.

## Stack (mirror the reference site)
- Next.js 16.3.5 App Router (note: this version has breaking changes — read `node_modules/next/dist/docs/` before writing code), React 19, TypeScript, Tailwind CSS v4
- PostgreSQL via `pg` (Neon in prod, `DATABASE_URL` in `.env.local`), JSONB-per-row data pattern (see `src/lib/db.ts` + `src/lib/store.ts` in reference)
- Pages are `force-dynamic`; client chrome lives in a root `ClientLayout` that hides Navbar/Footer on `/admin*`

## Features to replicate (study these files in the reference repo)
1. **Storefront**: home, `/products` (ShopBrowser with category/sort/price filters), product detail, collections, about, FAQ, contact — FAQ answers driven by DB `faqs` table via ContentProvider.
2. **Cart + checkout**: cart drawer, checkout form, order creation API (`/api/orders`), COD/online payment options, order confirmation page.
3. **Admin panel** (`/admin`, cookie-session auth in `src/lib/admin-auth.ts`, password from `ADMIN_PASSWORD` env var):
   - Dashboard stats, orders (status: pending/confirmed/shipped/delivered/cancelled — note `orders` table needs `updated_at` column; see fixed `updateOrderStatus`), products CRUD with stock/variants, categories, reviews, FAQs/content, media upload, logo update.
   - Admin link: footer Navigation list, last item "Admin Login".
4. **Navbar**: fixed header, search icon opens a compact dropdown search directly under the icon (navigates to `/products?q=…`); mobile bottom bar (home/shop/search/cart).
5. **Floating chatbot** (`MessengerChat.tsx`): FAQ keyword matching + catalog-aware answers (product lookup, prices, stock, category browse chips), Messenger handoff CTA, quick-reply chips.
6. **Footer**: navigation + socials + contact.

## Domain adaptations (bread & pastry)
- Categories/seed data: baked goods instead of caps (placeholder seed is fine until user supplies real products).
- Business content: hours, pickup/delivery messaging, freshness/"baked daily" copy, allergen info if relevant.
- Chatbot INTENTS/FAQ patterns: shipping→delivery/pickup, keep payment/bulk intents; adjust starter chips (e.g., "Today's menu?", "Delivery areas?", "How to order?").

## Workflow conventions (important)
- **Never commit/push unless the user explicitly says to** ("push" / "commit and push"). Stage only intended files; leave unrelated untracked files alone.
- Verification loop before reporting done: `npx tsc --noEmit` → `npm run lint` → start dev (`npm run dev`, port 3000) → smoke-test pages → stop the dev server (kill via `Get-NetTCPConnection -LocalPort 3000`).
- PowerShell gotchas: don't put nested quotes in `node -e` — write a temp `.mjs` script instead; don't kill processes by command-line pattern (you may kill your own shell).
- Git style: concise imperative commit messages (e.g., "Fix admin order status updates failing with 500").
- Keep responses concise; make targeted changes; no drive-by refactors or comments unless asked.

## Day-1 plan for the fresh session
1. Ask the branding/product questions above.
2. Scaffold Next.js app into `C:\Users\MEBS TACLOBAN\Desktop\bread-pastry-store` (manually mirror the reference repo's structure rather than `create-next-app` if that keeps parity — reference uses src/ layout, `src/app`, `src/components`, `src/lib`, `src/data`).
3. Port db/store/auth/admin patterns, then rebrand content, seed bread/pastry catalog, adjust chatbot copy.
4. Verify, then wait for explicit push instruction (init git first, ask before first commit).
