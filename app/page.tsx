import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/Hero";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader />
      <Hero />

      <section id="collection" className="mx-auto max-w-content px-6 py-20">
        <div className="mb-12 max-w-lg">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brass-light">
            The Collection
          </p>
          <h2 className="mt-3 font-display text-3xl text-paper">
            A variety of scents, each a door to another world.
          </h2>
          <p className="mt-3 text-paper/60">
            Browse below
          </p>
        </div>
        <ProductGrid products={products} />
      </section>

      <SiteFooter />
    </>
  );
}
