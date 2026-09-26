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
      {/* Added 'rounded-lg' here. Because of 'overflow-hidden', it automatically rounds the image and the placeholder inside it. */}
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
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-snug text-paper">
          {product.title}
        </h3>
        <span className="whitespace-nowrap text-sm text-brass-light">
          £{product.price.toFixed(2)}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-paper/60">
        {product.description}
      </p>
      <button
        onClick={handleAdd}
        className="mt-3 border border-brass/50 px-4 py-2 text-xs uppercase tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10"
      >
        {justAdded ? "Added" : "Add to basket"}
      </button>
    </article>
  );
}
