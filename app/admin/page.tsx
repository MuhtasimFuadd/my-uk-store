import { requireAdminPage, isSupabaseConfigured } from "@/lib/require-admin-page";
import AdminCardLink from "@/components/admin/AdminCardLink";

export default async function AdminPage() {
  await requireAdminPage();

  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-content px-6 py-16">
        <h1 className="font-display text-2xl text-paper">Admin</h1>
        <p className="mt-4 max-w-md text-paper/60">
          The admin panel needs Supabase connected to save changes. Add{" "}
          <code className="font-mono text-brass-light">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          ,{" "}
          <code className="font-mono text-brass-light">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          , and{" "}
          <code className="font-mono text-brass-light">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          to your environment variables, then reload this page.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <h1 className="font-display text-2xl text-paper">Admin</h1>
      <p className="mt-2 text-paper/60">Choose what you'd like to do.</p>

      {/* Adding a third/fourth card later is just another AdminCardLink
          here — copy one of the two below and change its href/title/
          description. */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminCardLink
          href="/admin/products/new"
          title="Add a new product"
          description="Create a new scent, with its price, photos, gender, vial size, and stock."
        />
        <AdminCardLink
          href="/admin/inventory"
          title="Inventory"
          description="View, edit, or remove existing products, and manage stock levels."
        />
        <AdminCardLink
          href="/admin/orders"
          title="Orders"
          description="See what's been purchased and each order's delivery address."
        />
      </div>
    </main>
  );
}
