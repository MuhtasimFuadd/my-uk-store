"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function AddToBasketButton({ product }: { product: Product }) {
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
    <button
      onClick={handleAdd}
      disabled={!product.in_stock}
      className="mt-8 border border-brass/60 px-7 py-3 text-sm uppercase tracking-wide text-brass-light transition-colors hover:border-brass hover:bg-brass/10 disabled:cursor-not-allowed disabled:border-line disabled:text-paper/30 disabled:hover:bg-transparent"
    >
      {!product.in_stock ? "Out of stock" : justAdded ? "Added to basket" : "Add to basket"}
    </button>
  );
}
