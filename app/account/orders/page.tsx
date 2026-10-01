import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type OrderItem = { title: string; price: number; quantity: number };

export default async function AccountOrdersPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-content px-6 py-16 text-center">
          <h1 className="font-display text-2xl text-paper">My Orders</h1>
          <p className="mt-4 text-paper/60">
            Sign in with Google (top right) to see your order history.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block border border-brass/50 px-5 py-2 text-xs uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10"
          >
            Browse the collection
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  // RLS ("Users can view their own orders" in schema.sql) means this
  // query can ONLY ever return rows where user_id = this signed-in
  // user's own id — there's no need to add a .eq("user_id", ...) filter
  // here ourselves, the database enforces it regardless.
  const { data: orders } = await supabase
    .from("orders")
    .select("id, items, total, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-content px-6 py-16">
        <h1 className="font-display text-2xl text-paper">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <p className="mt-6 text-paper/60">
            No orders yet.{" "}
            <Link href="/products" className="text-brass-light underline">
              Start browsing
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-8 space-y-6">
            {orders.map((order) => (
              <li key={order.id} className="border border-line bg-panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-xs text-paper/50">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    <span className="font-mono">{order.id.slice(0, 8)}</span>
                  </p>
                  <span className="border border-brass/50 px-3 py-1 text-xs uppercase tracking-wide text-brass-light">
                    {order.status}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-paper/70">
                  {(order.items as OrderItem[]).map((item, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>£{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 border-t border-line pt-2 text-sm text-paper">
                  Total: <span className="text-brass-light">£{order.total.toFixed(2)}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
