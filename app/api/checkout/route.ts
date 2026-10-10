import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmationEmail } from "@/lib/email";

type CheckoutItem = { id: string; quantity: number };

export async function POST(request: Request) {
  const body = await request.json();

  const items: CheckoutItem[] = Array.isArray(body.items)
    ? body.items
        .map((i: any) => ({ id: String(i.id ?? ""), quantity: Number(i.quantity) }))
        .filter((i: CheckoutItem) => i.id && Number.isFinite(i.quantity) && i.quantity > 0)
    : [];

  const customer = body.customer ?? {};
  const customer_name = String(customer.name ?? "").trim();
  const email = String(customer.email ?? "").trim();
  const phone = String(customer.phone ?? "").trim();
  const address_line1 = String(customer.address_line1 ?? "").trim();
  const address_line2 = String(customer.address_line2 ?? "").trim();
  const city = String(customer.city ?? "").trim();
  const postcode = String(customer.postcode ?? "").trim();

  if (items.length === 0) {
    return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
  }
  if (!customer_name || !email || !address_line1 || !city || !postcode) {
    return NextResponse.json(
      { error: "Please fill in your name, email, address, city, and postcode." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // This single database call does everything atomically — see
  // place_order() in supabase/schema.sql for exactly how it prevents two
  // customers from both buying the last item in stock.
  const { data, error } = await supabase.rpc("place_order", {
    p_items: items,
    p_customer_name: customer_name,
    p_email: email,
    p_phone: phone,
    p_address_line1: address_line1,
    p_address_line2: address_line2,
    p_city: city,
    p_postcode: postcode
  });

  if (error) {
    // Stock/validation failures raised inside place_order() land here as
    // a normal error message (e.g. "Not enough stock for X: only 2 left"),
    // which is safe to show the customer directly.
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const result = Array.isArray(data) ? data[0] : data;

  // place_order() only returns the id and total — fetch the full record
  // back (including the item titles/prices it snapshotted) so the email
  // can show real product names, not just ids.
  const { data: orderRow } = await supabase
    .from("orders")
    .select("items")
    .eq("id", result.order_id)
    .single();

  // If the email fails for any reason, the order has still genuinely gone
  // through (stock is already decremented), so we never fail the whole
  // checkout over it — the failure is just logged in Vercel's function
  // logs.
  //
  // IMPORTANT: this is awaited on purpose. Previously it was fired off
  // without waiting, but on Vercel a serverless function can be frozen
  // the moment it sends its response — which could cut the email request
  // off before it finished, unpredictably. Waiting costs a fraction of a
  // second and guarantees the send actually completes (or fails loudly).
  try {
    await sendOrderConfirmationEmail({
      to: email,
      customerName: customer_name,
      orderNumber: result.order_number,
      items: orderRow?.items ?? [],
      total: result.order_total
    });
  } catch (err) {
    console.error("Order confirmation email failed:", err);
  }

  return NextResponse.json({
    // order_number is the short, sequential reference (#1, #2, ...) a
    // customer can actually read out over the phone — order_id is the
    // long internal uuid, kept here only in case it's ever useful for
    // debugging, never shown to the customer.
    order_id: result.order_id,
    order_number: result.order_number,
    total: result.order_total
  });
}
