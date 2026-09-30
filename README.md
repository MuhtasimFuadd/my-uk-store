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

### Common setup gotchas

- **The Project URL must NOT include `/rest/v1/`.** Use just
  `https://xxxxxxxxxxxx.supabase.co` — `supabase-js` appends the API path
  itself. Including it causes every request to silently or loudly fail.
- **On Vercel, `NEXT_PUBLIC_...` variables must be Type "Config", not
  "Secret".** A "Secret" type variable can't be read back out, which
  breaks anything meant to be embedded in the browser. Keep
  `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` as "Secret" — just not
  the two `NEXT_PUBLIC_` ones.
- **New Supabase projects show "publishable" and "secret" keys by
  default**, replacing the older "anon" and "service_role" names. They're
  drop-in equivalents — publishable → `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  secret → `SUPABASE_SERVICE_ROLE_KEY`. The older "Legacy API Keys" tab
  still works too, if you prefer those.
- **"permission denied for table products"** means the RLS policy is
  fine but the underlying Postgres role is missing basic table grants —
  `schema.sql` now includes explicit `grant` statements for this, but if
  you ran an older copy, re-run the `grant ...` lines near the bottom.

## 3. Push to GitHub and deploy to Vercel

Same as before — commit, push, and Vercel redeploys automatically. Just
make sure all **four** environment variables from step 2 are added in
Vercel too: **Project → Settings → Environment Variables**. Add
`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` there exactly as in
`.env.local` — Vercel keeps them server-side, they're never sent to the
browser.

## Using the admin panel

- Go to `yoursite.com/admin` — you'll be sent to a login page if you're
  not signed in. This is now a menu of "postcard" buttons rather than one
  long page — **Add a new product** and **Inventory**, with room to add
  more later (just copy an `<AdminCardLink>` in `app/admin/page.tsx`).
- **Add a new product** (`/admin/products/new`): name, price, description,
  gender (male/female/unisex), vial size, two optional photos (the small
  "elements/sticker" image shown on the shop grid, and a bigger "vial
  design" photo shown on the product's own page), a placeholder colour
  used until real photos are added, and stock (an admin-only quantity,
  plus an "in stock" toggle customers actually see).
- **Inventory** (`/admin/inventory`): every product, editable inline —
  same fields as above, plus Save/Delete per row. Click either photo
  thumbnail to replace it.
- Both pages require being logged in, same as before — going to either
  URL directly while signed out redirects to `/admin/login`.
- The password is a single shared secret (like a shop's back-office door
  code) — good enough for one admin managing their own shop, not built for
  multiple staff accounts with different permissions.

## The shop's pages

- `/` — the video/photo hero landing page.
- `/products` — the full grid of scents (this used to live on the
  homepage itself; "Enter the shop" on the hero now links here).
- `/products/[id]` — each product's own page: its bigger "vial design"
  photo, gender/size/stock badges, full description, and an Add to
  Basket button. Clicking a card in the grid goes here.

If you already had products in Supabase before this update, re-run
`supabase/schema.sql` — it only *adds* the new columns
(`vial_design_url`, `gender`, `vial_size`, `in_stock`, `stock_count`) with
safe defaults, it won't touch your existing rows' data.

## Checkout and orders

- `/checkout` — collects delivery details and has a "Pay now" button.
  **There's no real payment processor connected yet** — clicking Pay Now
  instantly "succeeds" (no card is charged) once stock is confirmed
  available, creates an order record, and reduces stock. Swap this for a
  real processor (e.g. Stripe) later; everything else stays the same.
- Overselling is prevented at the database level, not just in the app:
  `place_order()` in `supabase/schema.sql` locks each product row and
  decrements stock inside a single all-or-nothing transaction, so two
  people checking out for the last item at the same instant can't both
  succeed — whoever's request reaches the database first wins, and the
  other gets a clear "not enough stock" error instead of a broken order.
- Orders are never publicly readable — there's no RLS policy allowing it,
  only the admin panel's service-role key can see them. View them at
  `/admin/orders`.

## What to add next

- **Payment:** connect Stripe Checkout so the basket can actually charge
  cards. We held off deliberately — happy to do this next, carefully.
- A dedicated page per scent (`/products/[id]`) with a longer story.
- Order history / a simple "orders" table once payments exist.
- Multiple admin accounts with proper login (Supabase Auth) instead of one
  shared password, if more than one person will manage the shop.
