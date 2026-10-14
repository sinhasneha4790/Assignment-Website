# Folk & Form

Online clothing store for teens, women and men (folknform.com), with logins, payments and styling-appointment bookings.

- **Design reference:** `design-reference/` holds the approved mockup exported as HTML (open `design-reference/index.html` or `pages.html`). It is read-only.
- **Build spec:** *Folk & Form — Technical Build Spec for Claude Code* (owner's document).

## Stack

Next.js (App Router, TypeScript strict) · Tailwind CSS v4 · Prisma + Postgres (Neon) · Auth.js · Razorpay · Resend · Vercel (Mumbai, `bom1`).

## Run locally

```bash
cp .env.example .env.local        # fill in DATABASE_URL at minimum
npm install
npx prisma migrate deploy         # create tables
npx prisma db seed                # load the mockup's sample catalogue and content
npm run dev                       # http://localhost:3000
```

Without `DATABASE_URL` the home page still renders from `prisma/seed-data.ts`; catalogue pages show a "being stocked" notice until Neon is connected and seeded.

Sample coupons in the seed: `WELCOME10` (10 % off over ₹1,999) and `FOLK200` (₹200 off over ₹2,499).

## Checks

```bash
npm run lint
npm run typecheck
npm test               # Vitest unit tests
npm run build
npm run test:e2e       # Playwright at 1280 px and 390 px (needs a build)
```

CI (`.github/workflows/ci.yml`) runs all of these against a Postgres service on every pull request and push to `main`.

## Project layout

```
app/(shop)/          home, hubs, listings, new-in/sale/collections, search, product, size guide, cart
app/actions/         server actions (newsletter, cart)
app/api/             search suggestions, PIN-code check
components/ui/       Button, Chip, SizeButton, Input, Card, Pill, ImageFrame, Accordion, Icons
components/layout/   Header (sticky), Footer, MobileMenu, MobileTabBar, CookieBanner, WhatsAppButton
components/shop/     HeroCarousel, ProductCard, HubView, ListingView, FilterPanel, ProductHero, SizeGuide, Reviews…
components/cart/     line controls, coupon form, gift wrap
lib/                 db, content (CMS reads), catalog (listings + facets), search (trigram), product,
                     cart, pricing, pincode, format, nav, site
prisma/              schema.prisma, migrations/, seed.ts, seed-data.ts
public/seed/         mockup illustrations used as seed product images
design-reference/    exported mockup artboards (read-only)
tests/unit, tests/e2e
```

## Conventions

- Colours, type and spacing come from the tokens in `app/globals.css` (`bg-cream`, `text-ink`, `border-line`…). No raw hex in components.
- Money is integer paise; format with `formatPrice()`. Cart totals come from `lib/pricing.ts` on the server.
- Listing filters live in the URL (`size`, `line`, `colour`, `min`, `max`, `fabric`, `fit`, `occasion`, `instock`, `sale`, `sort`, `page`).
- Product search uses `pg_trgm` on `Product.searchText`; call `buildSearchText()` whenever a product changes.
- Prices, names and copy live in the database (seeded from `prisma/seed-data.ts`), never in components.
- Secrets live only in Vercel environment variables and a git-ignored `.env.local`.

## Deploying

Every push to `main` deploys to production on Vercel; every pull request gets a preview URL. The Vercel build runs `npm run vercel-build` (`prisma generate`, `prisma migrate deploy`, `next build`).
