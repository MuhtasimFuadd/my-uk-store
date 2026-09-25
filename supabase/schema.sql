-- Run this in Supabase: Project -> SQL Editor -> New query

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(10, 2) not null,
  image_url text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Allow the site's anon key to read products (no login required to browse)
alter table products enable row level security;

create policy "Public products are viewable by everyone"
  on products for select
  using (true);

-- A couple of starter rows — delete or edit these once you add your own
insert into products (title, price, image_url, description) values
  ('Waxed Canvas Tote', 38.00, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80', 'Hardwearing waxed canvas, leather handles, room for a laptop and a loaf of bread.'),
  ('Enamel Camp Mug', 14.00, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80', 'Chip-resistant enamel with a rolled rim. Dishwasher safe, campfire proof.');
