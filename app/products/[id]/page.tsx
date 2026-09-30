import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BottlePlaceholder from "@/components/BottlePlaceholder";
import AddToBasketButton from "@/components/AddToBasketButton";

export default async function ProductDetailPage({
  params
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-content px-6 py-16">
        <Link
          href="/products"
          className="text-sm text-paper/50 hover:text-paper"
        >
          ← Back to the collection
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* The bigger "vial design" photo — falls back to the same
              illustrated bottle used elsewhere if no photo has been
              uploaded yet for this product. */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line bg-panel">
            {product.vial_design_url ? (
              <Image
                src={product.vial_design_url}
                alt={product.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <BottlePlaceholder color={product.accent} />
            )}
          </div>

          <div>
            <div className="flex items-start gap-4">
              {/* The small "elements/sticker" image from the shop grid,
                  shown again here as a little badge next to the title. */}
              {product.image_url && (
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-line bg-panel">
                  <Image
                    src={product.image_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="font-display text-3xl text-paper">
                  {product.title}
                </h1>
                <p className="mt-1 text-lg text-brass-light">
                  £{product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Gender / size / stock badges */}
            <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-paper/60">
              <span className="border border-line px-3 py-1 capitalize">
                {product.gender}
              </span>
              {product.vial_size && (
                <span className="border border-line px-3 py-1">
                  {product.vial_size}
                </span>
              )}
              <span
                className={`border px-3 py-1 ${
                  product.in_stock
                    ? "border-brass/50 text-brass-light"
                    : "border-line text-paper/40"
                }`}
              >
                {product.in_stock ? "In stock" : "Out of stock"}
              </span>
            </div>

            <p className="mt-6 max-w-md text-paper/70">
              {product.description}
            </p>

            <AddToBasketButton product={product} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
