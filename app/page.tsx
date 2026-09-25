import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader />

      <section className="border-b border-line">
        <div className="mx-auto max-w-content px-6 py-20">
          <h1 className="max-w-xl font-display text-4xl italic leading-tight text-ink sm:text-5xl">
            Everyday things, made to last a while.
          </h1>
          <p className="mt-5 max-w-md text-ink/60">
            A small, growing shelf of goods we'd buy ourselves — picked for
            how they wear in, not just how they look on day one.
          </p>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-content px-6 py-16">
        <ProductGrid products={products} />
      </section>

      <SiteFooter />
    </>
  );
}
