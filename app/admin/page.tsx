import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    redirect("/admin/login");
  }

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!supabaseConfigured) {
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

  return <AdminDashboard />;
}
