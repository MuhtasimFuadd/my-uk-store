import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

const VALID_GENDERS = ["male", "female", "unisex"];

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const supabase = getSupabaseAdmin();
  // Admin's own list includes stock_count — the ONLY place in the whole
  // app that column is ever selected. The public site's queries (in
  // lib/products.ts) never include it.
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, price, image_url, vial_design_url, description, accent, gender, vial_size, in_stock, stock_count, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const price = Number(body.price);
  const description = String(body.description ?? "").trim();
  const image_url = String(body.image_url ?? "").trim();
  const vial_design_url = String(body.vial_design_url ?? "").trim();
  const accent = body.accent ? String(body.accent).trim() : null;
  const gender = VALID_GENDERS.includes(body.gender) ? body.gender : "unisex";
  const vial_size = String(body.vial_size ?? "").trim();
  const in_stock = Boolean(body.in_stock ?? true);
  const stock_count = Number.isFinite(Number(body.stock_count))
    ? Math.max(0, Math.trunc(Number(body.stock_count)))
    : 0;

  if (!title || !description || Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .insert({
      title,
      price,
      description,
      image_url,
      vial_design_url,
      accent,
      gender,
      vial_size,
      in_stock,
      stock_count
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
