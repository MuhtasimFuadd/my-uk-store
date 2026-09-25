import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, price, image_url, description, accent, created_at")
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
  const accent = body.accent ? String(body.accent).trim() : null;

  if (!title || !description || Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .insert({ title, price, description, image_url, accent })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
