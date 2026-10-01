import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// This is DIFFERENT from lib/supabase-admin.ts: that one uses the
// service-role key and bypasses RLS entirely — for the admin panel only.
// This one uses the public anon key plus whichever visitor's session
// cookie is present, so a signed-in customer can only ever read their own
// rows (enforced by the "Users can view their own orders" RLS policy in
// schema.sql), never anyone else's.
export function getSupabaseServerClient() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component (not a Route Handler) — safe
          // to ignore, since middleware.ts refreshes the session cookie
          // separately on every request anyway.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Same as above.
        }
      }
    }
  });
}
