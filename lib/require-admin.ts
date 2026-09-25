import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";

// Call at the top of every admin route handler. Returns a 401 response if
// the caller isn't authenticated, or null if they're clear to proceed.
export async function requireAdmin(): Promise<NextResponse | null> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return null;
}
