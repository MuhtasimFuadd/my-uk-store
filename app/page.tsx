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

      <section id="collection" className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 max-w-lg sm:mb-12">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brass-light">
            The Collection
          </p>
          <h2 className="mt-3 font-display text-2xl text-paper sm:text-3xl">
            Six doors, six worlds
          </h2>
          <p className="mt-3 text-sm text-paper/60 sm:text-base">
            Every scent starts at £10 while the shop is new. More doors open
            soon.
          </p>
        </div>
        <ProductGrid products={products} />
      </section>

      <SiteFooter />
    </>
  );
}
