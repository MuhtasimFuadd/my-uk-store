-- Run this in Supabase: Project -> SQL Editor -> New query
-- Safe to run whether this is a brand new project or you already ran an
-- earlier version of this file — it only creates/adjusts what's missing.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(10, 2) not null,
  image_url text not null default '',       -- the small "elements/sticker" image shown on the shop grid
  description text not null,
  accent text,
  created_at timestamptz not null default now()
);

-- If you ran an older version of this file before, bring the table up to date:
alter table products alter column image_url set default '';
alter table products add column if not exists accent text;

-- New fields for the product detail page (product/[id]).
alter table products add column if not exists vial_design_url text not null default ''; -- the larger bottle photo shown on the detail page
alter table products add column if not exists gender text not null default 'unisex';    -- 'male' | 'female' | 'unisex'
alter table products add column if not exists vial_size text not null default '';       -- free text, e.g. "50ml"
alter table products add column if not exists in_stock boolean not null default true;   -- shown publicly
alter table products add column if not exists stock_count integer not null default 0;   -- admin-only, never sent to the public site

-- Public (anon key) can read products — no login required to browse.
-- Nothing else is allowed for the anon/public role: creating, editing, and
-- deleting all go through the admin panel's server-side service-role key,
-- which bypasses RLS entirely, so no "insert/update/delete" policy is
-- needed (or wanted) here.
alter table products enable row level security;

drop policy if exists "Public products are viewable by everyone" on products;
create policy "Public products are viewable by everyone"
  on products for select
  using (true);

-- RLS policies control WHICH rows a role can touch, but Postgres also
-- requires the role to have basic table-level privileges in the first
-- place. Some projects don't grant these automatically, which shows up
-- as "permission denied for table products" even with RLS set up
-- correctly — so we grant them explicitly here.
grant usage on schema public to anon, authenticated, service_role;
grant select on products to anon, authenticated;
grant select, insert, update, delete on products to service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

-- Starter perfumes — delete or edit these from the admin panel once you
-- add your own. All start at £10 while the shop is new.
--
-- "on conflict do nothing" doesn't actually prevent duplicates here,
-- since every row gets a fresh random id — there's nothing for it to
-- conflict with. Instead, the "where not exists" below only runs this
-- insert the very first time (when the table has zero rows). Once
-- anything exists in products — these samples, or your own real
-- products — re-running this whole file will skip this block entirely,
-- so it's safe to re-run schema.sql later for other changes without
-- worrying about duplicate demo rows.
insert into products (title, price, image_url, description, accent, gender, vial_size, in_stock, stock_count)
select * from (values
  ('Deep Current', 10.00, '', 'Salt spray, ambergris, cold linen — the scent of the whale''s road, sung through fathoms of blue.', '#2E6F8E', 'unisex', '50ml', true, 12),
  ('Bioluminescence', 10.00, '', 'Kelp, white musk, night rain — a glow that follows you up from the deep and doesn''t quite fade.', '#1F6F5C', 'unisex', '50ml', true, 12),
  ('Fernshadow', 10.00, '', 'Green fig, moss, cedar — sunlight through a canopy that hasn''t seen a clock in centuries.', '#3F5C3A', 'unisex', '50ml', true, 12),
  ('Stag''s Hollow', 10.00, '', 'Birch, wet stone, black pepper — the path a deer takes when no one else is watching.', '#6B4A2F', 'male', '50ml', true, 12),
  ('Amber Vial No. 7', 10.00, '', 'Dried orange, clove, old book resin — the shop itself, bottled: brass, candle smoke, quiet.', '#C79A44', 'unisex', '30ml', true, 12),
  ('Nightshelf', 10.00, '', 'Tobacco leaf, dark honey, vetiver — for the last hour a shop is open, after the lamps are low.', '#4A2E1F', 'male', '50ml', true, 12)
) as starter_products(title, price, image_url, description, accent, gender, vial_size, in_stock, stock_count)
where not exists (select 1 from products);

-- Storage bucket for product photos uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can view uploaded product photos (they're shown on the public
-- site). Uploading/replacing/deleting is done by the admin panel's
-- service-role key, which bypasses storage policies entirely.
drop policy if exists "Public read access to product photos" on storage.objects;
create policy "Public read access to product photos"
  on storage.objects for select
  using (bucket_id = 'product-images');


-- ============================================================
-- ORDERS — created when a customer checks out.
-- ============================================================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id), -- who placed it, if they were signed in; null for guest checkout
  customer_name text not null,
  email text not null,
  phone text not null default '',
  address_line1 text not null,
  address_line2 text not null default '',
  city text not null,
  postcode text not null,
  items jsonb not null,        -- snapshot of what was bought: [{product_id, title, price, quantity}, ...]
  total numeric(10, 2) not null,
  status text not null default 'paid', -- always 'paid' for now — there's no real payment processor yet
  created_at timestamptz not null default now()
);

-- If you ran an earlier version of this file before Google sign-in existed:
alter table orders add column if not exists user_id uuid references auth.users(id);

-- Orders contain personal info (name, address, phone), so unlike
-- products, there is no blanket public read policy. Two things can read
-- orders:
--   1. The admin panel's service-role key — bypasses RLS entirely.
--   2. A signed-in customer, but ONLY their own orders (where user_id
--      matches their own account) — never anyone else's, and a guest
--      (not signed in, or a guest-checkout order with no account
--      attached) can't read any orders at all.
alter table orders enable row level security;
grant select, insert on orders to service_role;
grant select on orders to authenticated;

drop policy if exists "Users can view their own orders" on orders;
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- place_order() is what actually takes payment (a fake, instant "payment"
-- for now) and creates the order. Doing this as one Postgres function,
-- rather than several separate API calls, is what makes it safe against
-- two customers buying the last item at the same time:
--   - "for update" locks each product row the moment we look at it, so a
--     second concurrent checkout has to wait its turn rather than reading
--     stale stock numbers.
--   - If ANY item in the order doesn't have enough stock, the function
--     raises an exception — which automatically rolls back every change
--     made earlier in the same function call (Postgres wraps each
--     function execution in a transaction). So an order either fully
--     succeeds or fully fails; stock is never partially deducted.
--   - Prices come from the products table here, not from whatever the
--     browser sends, so a tampered client-side cart can't check out for
--     less than the real price.
--
-- Dropped and recreated (rather than just "create or replace") because
-- we're adding a new parameter (p_user_id) — Postgres treats a different
-- parameter list as a different function, so the old 8-argument version
-- needs removing explicitly or it'd be left behind as dead, unused code.
drop function if exists place_order(jsonb, text, text, text, text, text, text, text);

create or replace function place_order(
  p_items jsonb,               -- [{"id": "uuid-...", "quantity": 2}, ...]
  p_customer_name text,
  p_email text,
  p_phone text,
  p_address_line1 text,
  p_address_line2 text,
  p_city text,
  p_postcode text,
  p_user_id uuid default null  -- the signed-in customer's id, if any; null for guest checkout
) returns table (order_id uuid, order_total numeric) as $$
declare
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
  v_price numeric;
  v_title text;
  v_stock integer;
  v_total numeric := 0;
  v_order_items jsonb := '[]'::jsonb;
  v_order_id uuid;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'No items in order';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for item %', v_product_id;
    end if;

    -- "for update" locks this row until the function finishes, so a
    -- second simultaneous order for the same product waits here instead
    -- of reading the same (soon to be outdated) stock number.
    select price, title, stock_count into v_price, v_title, v_stock
    from products
    where id = v_product_id
    for update;

    if not found then
      raise exception 'Product % no longer exists', v_product_id;
    end if;

    if v_stock < v_qty then
      raise exception 'Not enough stock for "%": only % left', v_title, v_stock;
    end if;

    update products
    set stock_count = stock_count - v_qty,
        in_stock = (stock_count - v_qty) > 0
    where id = v_product_id;

    v_total := v_total + (v_price * v_qty);
    v_order_items := v_order_items || jsonb_build_object(
      'product_id', v_product_id,
      'title', v_title,
      'price', v_price,
      'quantity', v_qty
    );
  end loop;

  insert into orders (
    user_id, customer_name, email, phone, address_line1, address_line2, city, postcode, items, total, status
  ) values (
    p_user_id, p_customer_name, p_email, p_phone, p_address_line1, p_address_line2, p_city, p_postcode, v_order_items, v_total, 'paid'
  )
  returning id into v_order_id;

  return query select v_order_id, v_total;
end;
$$ language plpgsql;

-- Only our own server-side code (using the service-role key) is allowed
-- to call this — never the public anon key directly.
revoke all on function place_order(jsonb, text, text, text, text, text, text, text, uuid) from public;
grant execute on function place_order(jsonb, text, text, text, text, text, text, text, uuid) to service_role;
