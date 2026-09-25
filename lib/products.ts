import { createClient } from "@supabase/supabase-js";

export type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  description: string;
};

// Sample data so the site works immediately, before Supabase is connected.
// Once you add real rows to a "products" table in Supabase, this fallback
// is ignored automatically.
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "sample-1",
    title: "Waxed Canvas Tote",
    price: 38,
    image_url:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    description: "Hardwearing waxed canvas, leather handles, room for a laptop and a loaf of bread."
  },
  {
    id: "sample-2",
    title: "Enamel Camp Mug",
    price: 14,
    image_url:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    description: "Chip-resistant enamel with a rolled rim. Dishwasher safe, campfire proof."
  },
  {
    id: "sample-3",
    title: "Merino Bed Socks",
    price: 22,
    image_url:
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80",
    description: "18-micron merino, loosely ribbed cuff. Made in a small mill in Yorkshire."
  },
  {
    id: "sample-4",
    title: "Cedar Fire Lighters",
    price: 9,
    image_url:
      "https://images.unsplash.com/photo-1520950237264-3d99cf82a074?w=800&q=80",
    description: "Off-cuts from a cedar workshop, dipped in wax. A box of forty."
  }
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return SAMPLE_PRODUCTS;

  const { data, error } = await supabase
    .from("products")
    .select("id, title, price, image_url, description")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return SAMPLE_PRODUCTS;
  return data as Product[];
}
