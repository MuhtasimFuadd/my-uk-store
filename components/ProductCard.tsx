"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import BottlePlaceholder from "./BottlePlaceholder";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      accent: product.accent
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <article className="group">
      {/* rounded-3xl (your change, kept) softens the corners on the image/
          placeholder box — overflow-hidden clips the image inside it to
          match, so the rounding applies whether it's a real photo or the
          BottlePlaceholder. */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line bg-panel">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <BottlePlaceholder color={product.accent} />
        )}
      </div>

      {/* text-base on phones, text-lg from sm: up — keeps titles readable
          without feeling oversized on a 2-column mobile grid */}
      <div className="mt-3 flex items-start justify-between gap-3 sm:mt-4">
        <h3 className="font-display text-base leading-snug text-paper sm:text-lg">
          {product.title}
        </h3>
        <span className="whitespace-nowrap text-sm text-brass-light">
          £{product.price.toFixed(2)}
        </span>
      </div>

      <p className="mt-1 text-xs leading-relaxed text-paper/60 sm:text-sm">
        {product.description}
      </p>

      {/* py-2.5 (up from py-2) gives a slightly taller tap target for
          fingers on mobile, without changing how it looks on desktop */}
      <button
        onClick={handleAdd}
        className="mt-3 w-full border border-brass/50 px-4 py-2.5 text-xs uppercase tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10 sm:w-auto sm:py-2"
      >
        {justAdded ? "Added" : "Add to basket"}
      </button>
    </article>
  );
}
