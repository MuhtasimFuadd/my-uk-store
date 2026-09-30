"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = { product_id: string; title: string; price: number; quantity: number };

type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postcode: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-2xl text-paper">Orders</h1>

      {error && (
        <p className="mt-4 border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-paper/50">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-paper/50">No orders yet.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border border-line bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-paper">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-paper/50">
                    {new Date(order.created_at).toLocaleString()} ·{" "}
                    <span className="font-mono">{order.id}</span>
                  </p>
                </div>
                <span className="border border-brass/50 px-3 py-1 text-xs uppercase tracking-wide text-brass-light">
                  {order.status}
                </span>
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
