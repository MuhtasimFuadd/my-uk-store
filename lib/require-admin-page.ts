import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";

// Call at the top of any admin PAGE component (not API route — see
// lib/require-admin.ts for that). Redirects to /admin/login if the
// visitor isn't signed in. The middleware also blocks /admin/* pages for
// signed-out visitors, so this is a second, page-level check — defense in
// depth, in case middleware is ever changed or bypassed.
export async function requireAdminPage(): Promise<void> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    redirect("/admin/login");
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
