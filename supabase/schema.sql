-- Run this in Supabase: Project -> SQL Editor -> New query
-- Safe to run whether this is a brand new project or you already ran an
-- earlier version of this file — it only creates/adjusts what's missing.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(10, 2) not null,
  image_url text not null default '',
  description text not null,
  accent text,
  created_at timestamptz not null default now()
);

-- If you ran an older version of this file before, bring the table up to date:
alter table products alter column image_url set default '';
alter table products add column if not exists accent text;

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
insert into products (title, price, image_url, description, accent)
values
  ('Deep Current', 10.00, '', 'Salt spray, ambergris, cold linen — the scent of the whale''s road, sung through fathoms of blue.', '#2E6F8E'),
  ('Bioluminescence', 10.00, '', 'Kelp, white musk, night rain — a glow that follows you up from the deep and doesn''t quite fade.', '#1F6F5C'),
  ('Fernshadow', 10.00, '', 'Green fig, moss, cedar — sunlight through a canopy that hasn''t seen a clock in centuries.', '#3F5C3A'),
  ('Stag''s Hollow', 10.00, '', 'Birch, wet stone, black pepper — the path a deer takes when no one else is watching.', '#6B4A2F'),
  ('Amber Vial No. 7', 10.00, '', 'Dried orange, clove, old book resin — the shop itself, bottled: brass, candle smoke, quiet.', '#C79A44'),
  ('Nightshelf', 10.00, '', 'Tobacco leaf, dark honey, vetiver — for the last hour a shop is open, after the lamps are low.', '#4A2E1F')
on conflict do nothing;

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
