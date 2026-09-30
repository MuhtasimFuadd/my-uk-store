"use client";

import { useState } from "react";
import Link from "next/link";
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
      {/* Clicking the image or title goes to the product's own page
          (/products/[id]). The "Add to basket" button below is
          deliberately OUTSIDE this Link, so tapping it adds to the
          basket instead of navigating away. */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line bg-panel">
          {/* On the grid, only the small "elements/sticker" image
              (product.image_url) shows — the bigger vial design photo and
              full description only appear once you click through. */}
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

          {!product.in_stock && (
            <span className="absolute left-2 top-2 bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-wide text-paper/70">
              Out of stock
            </span>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-paper group-hover:text-brass-light">
            {product.title}
          </h3>
          <span className="whitespace-nowrap text-sm text-brass-light">
            £{product.price.toFixed(2)}
          </span>
        </div>
      </Link>

      <button
        onClick={handleAdd}
        disabled={!product.in_stock}
        className="mt-3 border border-brass/50 px-4 py-2 text-xs uppercase tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10 disabled:cursor-not-allowed disabled:border-line disabled:text-paper/30 disabled:hover:bg-transparent"
      >
        {!product.in_stock ? "Out of stock" : justAdded ? "Added" : "Add to basket"}
      </button>
    </article>
  );
}
