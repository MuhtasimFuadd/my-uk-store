import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
