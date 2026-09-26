"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/lib/products";
import BottlePlaceholder from "@/components/BottlePlaceholder";

type AdminProduct = Product & { created_at?: string };

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("10.00");
  const [newDescription, setNewDescription] = useState("");
  const [newAccent, setNewAccent] = useState("#C79A44");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let image_url = "";
      if (newFile) image_url = await uploadImage(newFile);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice),
          description: newDescription,
          image_url,
          accent: newAccent
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add product.");

      setProducts((prev) => [data.product, ...prev]);
      setNewTitle("");
      setNewPrice("10.00");
      setNewDescription("");
      setNewAccent("#C79A44");
      setNewFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
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
        accent: product.accent
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
    if (!confirm("Delete this scent? This can't be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReplacePhoto(product: AdminProduct, file: File) {
    try {
      const image_url = await uploadImage(file);
      const updated = { ...product, image_url };
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
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-paper">Admin</h1>
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

      {/* Add new product */}
      <form
        onSubmit={handleAddProduct}
        className="mt-8 grid grid-cols-1 gap-4 border border-line bg-panel p-6 md:grid-cols-2"
      >
        <h2 className="font-display text-lg text-paper md:col-span-2">
          Add a new scent
        </h2>

        <label className="text-sm text-paper/70">
          Name
          <input
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Price (£)
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="text-sm text-paper/70 md:col-span-2">
          Description
          <textarea
            required
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Photo (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            className="mt-1 w-full text-paper/70 file:mr-3 file:border file:border-line file:bg-ink file:px-3 file:py-1 file:text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Placeholder colour (used until a photo is added)
          <input
            type="color"
            value={newAccent}
            onChange={(e) => setNewAccent(e.target.value)}
            className="mt-1 h-10 w-full border border-line bg-ink"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 border border-brass/60 px-4 py-2 text-sm uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10 disabled:opacity-50 md:col-span-2"
        >
          {saving ? "Adding…" : "Add scent"}
        </button>
      </form>

      {/* Existing products */}
      <div className="mt-12">
        <h2 className="font-display text-lg text-paper">Current scents</h2>

        {loading ? (
          <p className="mt-4 text-paper/50">Loading…</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {products.map((product) => (
              <li
                key={product.id}
                className="grid grid-cols-1 gap-4 border border-line bg-panel p-5 md:grid-cols-[100px_1fr_auto]"
              >
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
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-ink/50 text-center text-[10px] uppercase tracking-wide text-paper/70 transition-colors hover:bg-ink/70 hover:text-paper active:bg-ink/70">
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplacePhoto(product, file);
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
                  <div className="flex items-center gap-3">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
