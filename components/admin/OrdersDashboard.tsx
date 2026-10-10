"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = { product_id: string; title: string; price: number; quantity: number };

type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postcode: string;
  items: OrderItem[];
  total: number;
  status: "paid" | "delivered";
  created_at: string;
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // "paid" here means "current" (ordered, not yet delivered) — it's the
  // same value place_order() sets automatically for every new order.
  const [tab, setTab] = useState<"paid" | "delivered">("paid");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  }, []);

  async function setStatus(order: Order, status: "paid" | "delivered") {
    setUpdating(order.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update order.");
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdating(null);
    }
  }

  const visibleOrders = orders.filter((o) => o.status === tab);
  const currentCount = orders.filter((o) => o.status === "paid").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl text-paper">Orders</h1>

      {/* Tabs — Current is the default landing view */}
      <div className="mt-6 flex gap-2 border-b border-line">
        <button
          onClick={() => setTab("paid")}
          className={`px-4 py-2 text-sm uppercase tracking-wide transition-colors ${
            tab === "paid"
              ? "border-b-2 border-brass text-brass-light"
              : "text-paper/50 hover:text-paper"
          }`}
        >
          Current ({currentCount})
        </button>
        <button
          onClick={() => setTab("delivered")}
          className={`px-4 py-2 text-sm uppercase tracking-wide transition-colors ${
            tab === "delivered"
              ? "border-b-2 border-brass text-brass-light"
              : "text-paper/50 hover:text-paper"
          }`}
        >
          Delivered ({deliveredCount})
        </button>
      </div>

      {error && (
        <p className="mt-4 border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-paper/50">Loading…</p>
      ) : visibleOrders.length === 0 ? (
        <p className="mt-8 text-paper/50">
          {tab === "paid" ? "No current orders." : "No delivered orders yet."}
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {visibleOrders.map((order) => (
            <li key={order.id} className="border border-line bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-paper">
                    #{order.order_number} — {order.customer_name}
                  </p>
                  <p className="text-xs text-paper/50">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                {tab === "paid" ? (
                  <button
                    onClick={() => setStatus(order, "delivered")}
                    disabled={updating === order.id}
                    className="border border-brass/50 px-4 py-2 text-xs uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10 disabled:opacity-50"
                  >
                    {updating === order.id ? "Updating…" : "Mark as delivered"}
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(order, "paid")}
                    disabled={updating === order.id}
                    className="border border-line px-4 py-2 text-xs uppercase tracking-wide text-paper/50 hover:text-paper disabled:opacity-50"
                  >
                    {updating === order.id ? "Updating…" : "Move back to current"}
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-paper/40">
                    Items purchased
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-paper/70">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span>
                          {item.title} × {item.quantity}
                        </span>
                        <span>£{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 border-t border-line pt-2 text-sm text-paper">
                    Total:{" "}
                    <span className="text-brass-light">
                      £{order.total.toFixed(2)}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-paper/40">
                    Delivery address
                  </p>
                  <address className="mt-2 text-sm not-italic text-paper/70">
                    {order.address_line1}
                    {order.address_line2 && <>, {order.address_line2}</>}
                    <br />
                    {order.city}, {order.postcode}
                  </address>
                  <p className="mt-2 text-sm text-paper/50">
                    {order.email}
                    {order.phone && <> · {order.phone}</>}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
