import Image from "next/image";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-snug text-ink">
          {product.title}
        </h3>
        <span className="whitespace-nowrap font-body text-sm text-ink/70">
          £{product.price.toFixed(2)}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-ink/60">
        {product.description}
      </p>
      <button className="mt-3 text-sm font-medium text-teal underline decoration-teal/40 underline-offset-4 transition-colors hover:text-teal-dark">
        Add to basket
      </button>
    </article>
  );
}
