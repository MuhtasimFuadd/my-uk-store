import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isCorrectPassword
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let password: string;
  try {
    const body = await request.json();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password || !isCorrectPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8 // 8 hours
  });

  return NextResponse.json({ ok: true });
}
