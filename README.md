# my-uk-store

A base Next.js storefront: hero section + a product grid, ready to connect
to a free Supabase database and deploy to Vercel with zero cold starts.

Built to match this stack:

- **Framework:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database:** Supabase (Postgres) — optional to start, falls back to
  sample data automatically
- **Host:** Vercel (free tier, no cold starts)

It runs immediately with four sample products, so you can see the site
before wiring up a real database.

## Project structure

```
app/
  layout.tsx          root layout, fonts, metadata
  page.tsx             homepage: hero + product grid
  globals.css          Tailwind + base styles
  api/products/route.ts  JSON API route (GET /api/products)
components/
  SiteHeader.tsx
  SiteFooter.tsx
  ProductGrid.tsx
  ProductCard.tsx
lib/
  products.ts          Supabase client + sample-data fallback
supabase/
  schema.sql            run this once in Supabase to create the products table
.env.local.example      copy to .env.local and fill in your Supabase keys
```

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll see the site with sample products,
no setup required.

## 2. Connect a real database (Supabase)

1. Create a free project at https://supabase.com.
2. In the Supabase dashboard, go to **SQL Editor → New query**, paste the
   contents of `supabase/schema.sql`, and run it. This creates a
   `products` table with two starter rows and opens read access to it.
3. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public** key.
4. Copy `.env.local.example` to `.env.local` and paste those two values in:

   ```bash
   cp .env.local.example .env.local
   ```

5. Restart `npm run dev`. The homepage now reads from Supabase instead of
   the sample data. Add, edit, or delete rows in the Supabase **Table
   editor** and refresh the page to see changes.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Base storefront"
gh repo create my-uk-store --public --source=. --push
```

(Or create an empty repo on github.com and follow its "push an existing
repository" instructions.)

## 4. Deploy to Vercel

1. Go to https://vercel.com and log in with GitHub.
2. Click **Add New → Project** and import your `my-uk-store` repo.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values from your
   `.env.local`.
4. Click **Deploy**. You'll get a live URL like `my-uk-store.vercel.app`
   in under a minute, with no cold starts anywhere in the world.

Every push to your GitHub repo's main branch will redeploy automatically.

## 5. Optional: a UK domain

Buy a `.co.uk` domain (Namecheap, Porkbun, etc.), then in the Vercel
project go to **Settings → Domains** and add it — Vercel gives you the
DNS records to set at your registrar.

## What to customise next

- Swap the sample copy in `app/page.tsx` (site name, headline, blurb).
- Replace the sample product images/rows with your own in Supabase.
- Add a product detail page at `app/products/[id]/page.tsx`.
- Wire up the "Add to basket" button in `components/ProductCard.tsx` to
  real cart state once you're ready for checkout.
