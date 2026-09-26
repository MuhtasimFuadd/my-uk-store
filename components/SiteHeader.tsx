"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-base tracking-wide text-paper sm:text-lg"
        >
          Threshold
        </Link>
        <nav className="flex items-center gap-4 text-xs text-paper/80 sm:gap-6 sm:text-sm">
          <a href="/#collection" className="hover:text-paper">
            Shop
          </a>
          <Link href="/cart" className="whitespace-nowrap hover:text-paper">
            Basket ({count})
          </Link>
        </nav>
      </div>
    </header>
  );
}
