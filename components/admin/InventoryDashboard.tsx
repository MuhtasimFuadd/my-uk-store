"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import BottlePlaceholder from "@/components/BottlePlaceholder";

// Admin-only view of a product — includes stock_count, which the public
// site's Product type never has.
type AdminProduct = Product & { created_at?: string; stock_count: number };

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

export default function InventoryDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSave(product: AdminProduct) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: product.title,
        price: product.price,
        description: product.description,
        image_url: product.image_url,
        vial_design_url: product.vial_design_url,
        accent: product.accent,
        gender: product.gender,
        vial_size: product.vial_size,
        in_stock: product.in_stock,
        stock_count: product.stock_count
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save changes.");
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === product.id ? data.product : p)));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReplacePhoto(
    product: AdminProduct,
    field: "image_url" | "vial_design_url",
    file: File
  ) {
    try {
      const url = await uploadImage(file);
      const updated = { ...product, [field]: url };
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      await handleSave(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  function updateLocal(id: string, patch: Partial<AdminProduct>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-paper/50 hover:text-paper">
            ← Admin
          </Link>
          <h1 className="mt-2 font-display text-2xl text-paper">Inventory</h1>
        </div>
        <button
          onClick={handleLogout}
          className="border border-line px-4 py-2 text-xs uppercase tracking-wide text-paper/60 hover:text-paper"
        >
          Log out
        </button>
      </div>

      {error && (
        <p className="mt-4 border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-paper/50">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-paper/50">
          Nothing here yet.{" "}
          <Link href="/admin/products/new" className="text-brass-light underline">
            Add your first product
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {products.map((product) => (
            <li key={product.id} className="border border-line bg-panel p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[100px_100px_1fr_auto]">
                {/* Elements/sticker photo (grid image) */}
                <div className="relative h-24 w-full overflow-hidden border border-line bg-ink">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <BottlePlaceholder color={product.accent} />
                  )}
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-ink/60 text-center text-[9px] uppercase tracking-wide text-paper/0 hover:text-paper/90">
                    Elements photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplacePhoto(product, "image_url", file);
                      }}
                    />
                  </label>
                </div>

                {/* Vial design photo (detail page image) */}
                <div className="relative h-24 w-full overflow-hidden border border-line bg-ink">
                  {product.vial_design_url ? (
                    <Image
                      src={product.vial_design_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <BottlePlaceholder color={product.accent} />
                  )}
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-ink/60 text-center text-[9px] uppercase tracking-wide text-paper/0 hover:text-paper/90">
                    Vial design photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplacePhoto(product, "vial_design_url", file);
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <input
                    value={product.title}
                    onChange={(e) => updateLocal(product.id, { title: e.target.value })}
                    className="w-full border border-line bg-ink px-3 py-2 font-display text-paper"
                  />
                  <textarea
                    value={product.description}
                    onChange={(e) =>
                      updateLocal(product.id, { description: e.target.value })
                    }
                    rows={2}
                    className="w-full border border-line bg-ink px-3 py-2 text-sm text-paper/80"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-paper/60">
                      £
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={product.price}
                        onChange={(e) =>
                          updateLocal(product.id, { price: Number(e.target.value) })
                        }
                        className="w-24 border border-line bg-ink px-2 py-1 text-paper"
                      />
                    </label>

                    <select
                      value={product.gender}
                      onChange={(e) =>
                        updateLocal(product.id, {
                          gender: e.target.value as Product["gender"]
                        })
                      }
                      className="border border-line bg-ink px-2 py-1 text-sm text-paper"
                    >
                      <option value="unisex">Unisex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>

                    <input
                      value={product.vial_size}
                      onChange={(e) =>
                        updateLocal(product.id, { vial_size: e.target.value })
                      }
                      placeholder="Vial size"
                      className="w-24 border border-line bg-ink px-2 py-1 text-sm text-paper"
                    />

                    <input
                      type="color"
                      value={product.accent || "#C79A44"}
                      onChange={(e) =>
                        updateLocal(product.id, { accent: e.target.value })
                      }
                      className="h-8 w-8 border border-line bg-ink"
                      title="Placeholder colour"
                    />
                  </div>

                  {/* Stock controls — admin-only, this whole page requires login */}
                  <div className="flex flex-wrap items-center gap-4 border-t border-line pt-2">
                    <label className="flex items-center gap-2 text-sm text-paper/60">
                      <input
                        type="checkbox"
                        checked={product.in_stock}
                        onChange={(e) =>
                          updateLocal(product.id, { in_stock: e.target.checked })
                        }
                        className="h-4 w-4"
                      />
                      In stock
                    </label>
                    <label className="flex items-center gap-2 text-sm text-paper/60">
                      Qty left (admin only)
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={product.stock_count}
                        onChange={(e) =>
                          updateLocal(product.id, {
                            stock_count: Number(e.target.value)
                          })
                        }
                        className="w-20 border border-line bg-ink px-2 py-1 text-paper"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-row gap-2 md:flex-col">
                  <button
                    onClick={() => handleSave(product)}
                    className="border border-brass/50 px-4 py-2 text-xs uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="border border-line px-4 py-2 text-xs uppercase tracking-wide text-paper/50 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
