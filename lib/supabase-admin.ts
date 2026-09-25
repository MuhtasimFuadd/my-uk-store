import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key and must never be imported into
// client components or exposed to the browser. It's only ever used inside
// route handlers (app/api/admin/**), which run on the server.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}
