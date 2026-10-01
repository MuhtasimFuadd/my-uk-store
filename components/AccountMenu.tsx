"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AccountMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoaded(true);
    });

    // Keeps this in sync if they sign in/out in another tab, or right
    // after the OAuth redirect completes.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignIn() {
    const supabase = getSupabaseBrowserClient();
    // Remembers where the "Sign in" click happened (e.g. /checkout) so
    // app/auth/callback/route.ts can send them back there afterward,
    // instead of always landing on the homepage.
    const next = encodeURIComponent(window.location.pathname);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` }
    });
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  // Avoids a flash of "Sign in" before we've actually checked — render
  // nothing for a split second rather than something that might be wrong.
  if (!loaded) return <span className="w-16" />;

  if (!user) {
    return (
      <button onClick={handleSignIn} className="hover:text-paper">
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/account/orders" className="hover:text-paper">
        My Orders
      </Link>
      <button onClick={handleSignOut} className="text-paper/50 hover:text-paper">
        Sign out
      </button>
    </div>
  );
}