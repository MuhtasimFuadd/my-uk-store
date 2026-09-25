import { createClient } from "@supabase/supabase-js";

export type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  description: string;
  accent?: string | null; // placeholder bottle tint, used until a real photo is set
};

// Sample data so the site works immediately, before Supabase is connected.
// Once you add real rows to a "products" table in Supabase, this fallback
// is ignored automatically. Leaving image_url empty shows a stylised
// placeholder bottle in the shop's own colours instead of a broken image.
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "sample-1",
    title: "Deep Current",
    price: 10.0,
    image_url: "",
    accent: "#2E6F8E",
    description: "Salt spray, ambergris, cold linen — the scent of the whale's road, sung through fathoms of blue."
  },
  {
    id: "sample-2",
    title: "Bioluminescence",
    price: 10.0,
    image_url: "",
    accent: "#1F6F5C",
    description: "Kelp, white musk, night rain — a glow that follows you up from the deep and doesn't quite fade."
  },
  {
    id: "sample-3",
    title: "Fernshadow",
    price: 10.0,
    image_url: "",
    accent: "#3F5C3A",
    description: "Green fig, moss, cedar — sunlight through a canopy that hasn't seen a clock in centuries."
  },
  {
    id: "sample-4",
    title: "Stag's Hollow",
    price: 10.0,
    image_url: "",
    accent: "#6B4A2F",
    description: "Birch, wet stone, black pepper — the path a deer takes when no one else is watching."
  },
  {
    id: "sample-5",
    title: "Amber Vial No. 7",
    price: 10.0,
    image_url: "",
    accent: "#C79A44",
    description: "Dried orange, clove, old book resin — the shop itself, bottled: brass, candle smoke, quiet."
  },
  {
    id: "sample-6",
    title: "Nightshelf",
    price: 10.0,
    image_url: "",
    accent: "#4A2E1F",
    description: "Tobacco leaf, dark honey, vetiver — for the last hour a shop is open, after the lamps are low."
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
    .select("id, title, price, image_url, description, accent")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return SAMPLE_PRODUCTS;
  return data as Product[];
}
