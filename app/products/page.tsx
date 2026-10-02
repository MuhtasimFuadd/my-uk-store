import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader />

      <section className="mx-auto max-w-content px-6 py-20">
        <div className="mb-12 max-w-lg">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brass-light">
            The Collection
          </p>
          <h2 className="mt-3 font-display text-3xl text-paper">
            A variety of scents, each a door to another world.
          </h2>
        </div>
        <ProductGrid products={products} />
      </section>

      <SiteFooter />
    </>
  );
}
