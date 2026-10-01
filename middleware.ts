import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";

// Two completely separate auth systems live in this one middleware:
//  1. The admin panel's single shared password (unchanged from before).
//  2. Customer Google sign-in via Supabase Auth — this needs its session
//     cookie refreshed on every request, or it'll silently expire.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  // --- 1. Admin password check (only runs on /admin/* except /admin/login) ---
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!(await isValidSessionToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // --- 2. Refresh the customer's Google sign-in session, if any ---
  // This keeps them signed in across requests. It does nothing at all if
  // the visitor never signed in — no cookie, no-op.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        }
      }
    });
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  // Runs on every page EXCEPT static assets/images/etc — needed site-wide
  // now (not just /admin) so the Google sign-in session stays refreshed
  // wherever a visitor goes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|mp4)).*)"]
};
