import { createClient } from "@supabase/supabase-js";

export type Gender = "male" | "female" | "unisex";

// Fields any visitor can see. Note stock_count is deliberately NOT part of
// this type or ever selected by the public queries below — it's admin-only
// and lives in a separate type in the admin dashboard code.
export type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string; // the small "elements/sticker" image shown on the shop grid
  vial_design_url: string; // the larger bottle photo shown on the detail page
  description: string;
  accent?: string | null; // placeholder tint, used until a real photo is set
  gender: Gender;
  vial_size: string;
  in_stock: boolean;
};

// Sample data so the site works immediately, before Supabase is connected.
// Once you add real rows to a "products" table in Supabase, this fallback
// is ignored automatically.
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "sample-1",
    title: "Deep Current",
    price: 10.0,
    image_url: "",
    vial_design_url: "",
    accent: "#2E6F8E",
    description: "Salt spray, ambergris, cold linen — the scent of the whale's road, sung through fathoms of blue.",
    gender: "unisex",
    vial_size: "50ml",
    in_stock: true
  },
  {
    id: "sample-2",
    title: "Bioluminescence",
    price: 10.0,
    image_url: "",
    vial_design_url: "",
    accent: "#1F6F5C",
    description: "Kelp, white musk, night rain — a glow that follows you up from the deep and doesn't quite fade.",
    gender: "unisex",
    vial_size: "50ml",
    in_stock: true
  },
  {
    id: "sample-3",
    title: "Fernshadow",
    price: 10.0,
    image_url: "",
    vial_design_url: "",
    accent: "#3F5C3A",
    description: "Green fig, moss, cedar — sunlight through a canopy that hasn't seen a clock in centuries.",
    gender: "unisex",
    vial_size: "50ml",
    in_stock: true
  },
  {
    id: "sample-4",
    title: "Stag's Hollow",
    price: 10.0,
    image_url: "",
    vial_design_url: "",
    accent: "#6B4A2F",
    description: "Birch, wet stone, black pepper — the path a deer takes when no one else is watching.",
    gender: "male",
    vial_size: "50ml",
    in_stock: true
  },
  {
    id: "sample-5",
    title: "Amber Vial No. 7",
    price: 10.0,
    image_url: "",
    vial_design_url: "",
    accent: "#C79A44",
    description: "Dried orange, clove, old book resin — the shop itself, bottled: brass, candle smoke, quiet.",
    gender: "unisex",
    vial_size: "30ml",
    in_stock: true
  },
  {
    id: "sample-6",
    title: "Nightshelf",
    price: 10.0,
    image_url: "",
    vial_design_url: "",
    accent: "#4A2E1F",
    description: "Tobacco leaf, dark honey, vetiver — for the last hour a shop is open, after the lamps are low.",
    gender: "male",
    vial_size: "50ml",
    in_stock: true
  }
];

const PUBLIC_COLUMNS =
  "id, title, price, image_url, vial_design_url, description, accent, gender, vial_size, in_stock";

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
    .select(PUBLIC_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return SAMPLE_PRODUCTS;
  return data as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) {
    // Also check the sample list, in case Supabase is connected but this
    // particular id is one of the placeholder "sample-N" ids.
    return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  return data as unknown as Product;
}
