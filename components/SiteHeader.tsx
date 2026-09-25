"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg tracking-wide text-paper">
          MMBoutique
        </Link>
        <nav className="flex items-center gap-6 text-sm text-paper/80">
          <a href="/#collection" className="hover:text-paper">
            Shop
          </a>
          <Link href="/cart" className="hover:text-paper">
            Basket ({count})
          </Link>
        </nav>
      </div>
    </header>
  );
}
