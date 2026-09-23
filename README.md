# Generation Bread

E-commerce website for **Generation Bread** — a bakery café on P. Gomez Street, Tacloban City (a subsidiary of Ironwood Hotel). Fresh breads, pastries, and cakes, with online ordering for pickup and delivery.

**Live catalog highlights:** Ube Cheese Pandesal, three-day fermented croissants, egg tarts, Pande Coco, crookies, cakes, and more.

## Stack

- [Next.js 16.3.5](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- PostgreSQL ([Neon](https://neon.tech)) via `pg` — JSONB-per-row data pattern
- Floating FAQ/catalog chatbot with Facebook Messenger handoff

## Features

- **Storefront** — home, `/products` (category/sort/price filters), product detail, collections, about, FAQ, contact
- **Cart & checkout** — cart drawer, checkout form, order creation (`/api/orders`), GCash/Maya/Bank/COD, order confirmation with Messenger confirm CTA
- **Admin panel** at `/admin` — cookie-session auth, dashboard stats, orders, products (stock/variants), categories, reviews, FAQs/content, media upload, logo update
- **Chatbot** — FAQ keyword matching + live catalog lookup (prices, stock, category browse), quick-reply chips, Messenger handoff
- **Navbar** — fixed header, dropdown search under the icon (`/products?q=…`), mobile bottom bar

## Getting started (local)

```bash
npm install
cp .env.example .env.local
# edit .env.local — set DATABASE_URL (Neon or local Postgres)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The DB schema auto-initializes and the bread/pastry catalog seeds on first request.

### Environment variables (`.env.local`)

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string (Neon in prod) |
| `ADMIN_PASSWORD` | Prod yes | Password for `/admin` (dev fallback: `generationbread2026`) |
| `ADMIN_SESSION_SECRET` | Optional | Cookie signing secret (derived from `ADMIN_PASSWORD` if unset) |
| `NEXT_PUBLIC_SITE_URL` | Yes in prod | Canonical site URL for SEO/sitemap |
| `DATA_DIR` | Optional | Override data dir (legacy migration only) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run migrate:neon` | Import legacy `.data/` file store into Neon |

## Deploy to Vercel

1. Push this repo to GitHub (already connected: `Jorayyy/generation-bread`).
2. In [Vercel](https://vercel.com/new), **Import** the `generation-bread` repo (Next.js preset is automatic).
3. Add environment variables:
   - `DATABASE_URL` — your Neon `g_bread` connection string
   - `ADMIN_PASSWORD` — choose a strong password
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://generation-bread.vercel.app` (update after custom domain)
4. Deploy. First request creates tables and seeds the catalog.
5. Optional: attach a custom domain in Vercel → Domains, then update `NEXT_PUBLIC_SITE_URL`.

## Project structure

```
src/
  app/           # App Router pages, API routes, admin
  components/    # Navbar, Footer, ShopBrowser, MessengerChat, cart, etc.
  data/          # Seed: business profile, categories, products, FAQs, reviews
  lib/           # db, store, admin-auth, cart/content contexts, helpers
scripts/         # seed-catalog, migrate-to-neon, replace-images
public/          # logo and static assets
```

## Admin

- URL: `/admin`
- Password: `ADMIN_PASSWORD` (or dev default `generationbread2024` → use `generationbread2026` as set in this project)
- Footer → Navigation → **Admin Login**

## Business info

- **Address:** P. Gomez Street, Tacloban City, Leyte 6500, Philippines
- **Hours:** Daily 7:00 AM – 11:00 PM
- **Contact:** generationbread@gmail.com · +63 917 102 1233
- **Social:** [Facebook](https://www.facebook.com/generationbread/) · [Instagram](https://www.instagram.com/generationbread/)

---

Modeled on the MicsApparel storefront architecture. Product prices and copy are placeholder seed data — manage the live catalog via `/admin`.
