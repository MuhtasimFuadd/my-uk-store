"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import BottlePlaceholder from "@/components/BottlePlaceholder";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[60vh] max-w-content px-6 py-16">
        <h1 className="font-display text-3xl text-paper">Your basket</h1>

        {items.length === 0 ? (
          <div className="mt-10 border border-dashed border-line px-6 py-16 text-center text-paper/50">
            <p>Nothing in here yet.</p>
            <Link
              href="/#collection"
              className="mt-4 inline-block border border-brass/50 px-5 py-2 text-xs uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <ul className="space-y-6 lg:col-span-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-line pb-6"
                >
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden border border-line bg-panel">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <BottlePlaceholder color={item.accent} />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-base text-paper">
                        {item.title}
                      </h2>
                      <span className="text-sm text-brass-light">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-paper/60">
                      <label className="flex items-center gap-2">
                        Qty
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            setQuantity(item.id, Number(e.target.value))
                          }
                          className="w-16 border border-line bg-panel px-2 py-1 text-paper"
                        />
                      </label>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-paper/50 underline underline-offset-4 hover:text-paper"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="h-fit border border-line bg-panel p-6">
              <div className="flex items-center justify-between text-paper">
                <span>Subtotal</span>
                <span className="text-brass-light">£{subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs text-paper/50">
                Shipping and any taxes are calculated at checkout.
              </p>
              <button
                disabled
                title="Payment isn't connected yet"
                className="mt-6 w-full cursor-not-allowed border border-line px-4 py-3 text-sm uppercase tracking-wide text-paper/40"
              >
                Checkout — coming soon
              </button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
