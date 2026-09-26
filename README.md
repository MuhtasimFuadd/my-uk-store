# Threshold — a perfume shop

A dark, mystical little perfumery site: a video hero, a product grid of
scents, a working shopping basket, and a password-protected admin panel to
add/edit/delete products and upload photos.

- **Framework:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database + Storage:** Supabase (Postgres + file storage) — optional to
  start, the shop runs on sample data until you connect it
- **Host:** Vercel (free tier, no cold starts)

## What's included

- **Shop:** hero video, product grid, £10 starter pricing, a working
  basket (add, change quantity, remove) that persists in the browser
- **Admin panel** at `/admin` (password-protected): add new scents, edit
  price/description, upload/replace photos, delete products
- **No payment processing yet, on purpose** — the basket has a disabled
  "Checkout — coming soon" button. Taking real card payments needs Stripe
  (or similar) wired in deliberately and carefully, since it involves
  people's money and card data — let's do that as its own step once
  you're ready, rather than rushing it in here.

## Project structure

```
app/
  page.tsx                 homepage: hero + product grid
  cart/page.tsx             basket page
  admin/
    page.tsx                 admin dashboard (protected)
    login/page.tsx            admin login
  api/
    products/route.ts         public GET — reads products
    admin/
      login/route.ts           checks password, sets session cookie
      logout/route.ts          clears session cookie
      products/route.ts        admin GET (all) + POST (create)
      products/[id]/route.ts   admin PUT (update) + DELETE
      upload/route.ts          uploads a photo to Supabase Storage
components/
  Hero.tsx, SiteHeader.tsx, SiteFooter.tsx
  ProductCard.tsx, ProductGrid.tsx, BottlePlaceholder.tsx
  admin/AdminDashboard.tsx
lib/
  products.ts               public reads + sample fallback data
  cart-context.tsx           basket state (React context + localStorage)
  supabase-admin.ts          server-only Supabase client (service role)
  admin-auth.ts              password + session-cookie logic
  require-admin.ts           auth guard used by every admin API route
middleware.ts                redirects signed-out visitors away from /admin
supabase/schema.sql          run once in Supabase: table, policies, storage
public/
  hero-portals.mp4, hero-poster.jpg   your hero background
```

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the shop works immediately with 6 sample
scents. The admin panel needs Supabase connected first (next section).

## 2. Connect Supabase (database, storage, and admin login)

1. Create a free project at https://supabase.com (skip if you already
   have one from before).
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → Run.
   This creates the `products` table, its public-read policy, the
   `product-images` storage bucket, and 6 starter scents.
3. **Project Settings → API** → copy the **Project URL**, the **anon
   public** key, and the **service_role** key (click "reveal" — keep this
   one secret, it has full database access).
4. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
5. Fill in all four values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — the service_role key. **Never** put
     `NEXT_PUBLIC_` in front of this one.
   - `ADMIN_PASSWORD` — whatever password you want to log into `/admin`
     with. Also stays server-only.
6. Restart `npm run dev`. Visit `/admin`, log in, and try adding a scent.

## 3. Push to GitHub and deploy to Vercel

Same as before — commit, push, and Vercel redeploys automatically. Just
make sure all **four** environment variables from step 2 are added in
Vercel too: **Project → Settings → Environment Variables**. Add
`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` there exactly as in
`.env.local` — Vercel keeps them server-side, they're never sent to the
browser.

## Using the admin panel

- Go to `yoursite.com/admin` — you'll be sent to a login page if you're
  not signed in.
- **Add a scent:** name, price, description, an optional photo (or leave
  it blank to show a stylised placeholder bottle in a colour you pick).
- **Edit:** change any field inline and click Save. Click the photo to
  replace it.
- **Delete:** removes it from the shop immediately.
- **Log out** when you're done, especially on a shared computer.

The password is a single shared secret (like a shop's back-office door
code) — good enough for one admin managing their own shop, not built for
multiple staff accounts with different permissions.

## What to add next

- **Payment:** connect Stripe Checkout so the basket can actually charge
  cards. We held off deliberately — happy to do this next, carefully.
- A dedicated page per scent (`/products/[id]`) with a longer story.
- Order history / a simple "orders" table once payments exist.
- Multiple admin accounts with proper login (Supabase Auth) instead of one
  shared password, if more than one person will manage the shop.
