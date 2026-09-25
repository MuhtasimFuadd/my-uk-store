import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.description !== undefined)
    updates.description = String(body.description).trim();
  if (body.image_url !== undefined)
    updates.image_url = String(body.image_url).trim();
  if (body.accent !== undefined) updates.accent = body.accent ? String(body.accent) : null;
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }
    updates.price = price;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
