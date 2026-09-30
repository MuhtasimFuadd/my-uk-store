"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postcode: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    orderId: string;
    total: number;
  } | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPaying(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          customer: form
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order.");

      // There's no real payment processor yet — this is an instant,
      // always-succeeds "payment" once stock is confirmed available.
      // Swap this fetch for a real charge (e.g. Stripe) later; everything
      // else (the order record, stock decrement) stays the same.
      setConfirmation({ orderId: data.order_id, total: data.total });
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPaying(false);
    }
  }

  if (confirmation) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-content px-6 py-16 text-center">
          <h1 className="font-display text-3xl text-paper">Order placed</h1>
          <p className="mt-3 text-paper/60">
            Thank you, {form.name || "friend"} — your order is confirmed.
          </p>
          <p className="mt-6 text-sm text-paper/50">
            Order reference:{" "}
            <span className="font-mono text-paper/80">{confirmation.orderId}</span>
          </p>
          <p className="mt-1 text-sm text-paper/50">
            Total paid: <span className="text-brass-light">£{confirmation.total.toFixed(2)}</span>
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block border border-brass/60 px-6 py-3 text-sm uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10"
          >
            Continue browsing
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-content px-6 py-16 text-center">
          <p className="text-paper/60">Your basket is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block border border-brass/50 px-5 py-2 text-xs uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10"
          >
            Browse the collection
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-content px-6 py-16">
        <h1 className="font-display text-3xl text-paper">Checkout</h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <form onSubmit={handlePayNow} className="space-y-4 lg:col-span-2">
            <h2 className="font-display text-lg text-paper">Delivery details</h2>

            {error && (
              <p className="border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm text-paper/70">
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
                />
              </label>
              <label className="text-sm text-paper/70">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
                />
              </label>
            </div>

            <label className="block text-sm text-paper/70">
              Phone (optional)
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
              />
            </label>

            <label className="block text-sm text-paper/70">
              Address line 1
              <input
                required
                value={form.address_line1}
                onChange={(e) => update("address_line1", e.target.value)}
                className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
              />
            </label>

            <label className="block text-sm text-paper/70">
              Address line 2 (optional)
              <input
                value={form.address_line2}
                onChange={(e) => update("address_line2", e.target.value)}
                className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm text-paper/70">
                City
                <input
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
                />
              </label>
              <label className="text-sm text-paper/70">
                Postcode
                <input
                  required
                  value={form.postcode}
                  onChange={(e) => update("postcode", e.target.value)}
                  className="mt-1 w-full border border-line bg-panel px-3 py-2 text-paper"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={paying}
              className="mt-4 w-full border border-brass/60 px-6 py-3 text-sm uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10 disabled:opacity-50 sm:w-auto"
            >
              {paying ? "Processing…" : `Pay now — £${subtotal.toFixed(2)}`}
            </button>
            <p className="text-xs text-paper/40">
              There's no real payment processor connected yet — this
              confirms your order and reserves the stock, no card is
              actually charged.
            </p>
          </form>

          <div className="h-fit border border-line bg-panel p-6">
            <h2 className="font-display text-lg text-paper">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-paper">
              <span>Total</span>
              <span className="text-brass-light">£{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
