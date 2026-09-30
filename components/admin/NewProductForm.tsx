"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

export default function NewProductForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("10.00");
  const [description, setDescription] = useState("");
  const [accent, setAccent] = useState("#C79A44");
  const [gender, setGender] = useState<"male" | "female" | "unisex">("unisex");
  const [vialSize, setVialSize] = useState("50ml");
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState("0");

  // The small icon shown on the shop grid.
  const [elementsFile, setElementsFile] = useState<File | null>(null);
  // The bigger photo shown on the product's own page.
  const [vialDesignFile, setVialDesignFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Upload whichever photos were actually chosen. Either can be left
      // blank — the site falls back to the illustrated placeholder bottle
      // wherever a photo hasn't been set yet.
      const [image_url, vial_design_url] = await Promise.all([
        elementsFile ? uploadImage(elementsFile) : Promise.resolve(""),
        vialDesignFile ? uploadImage(vialDesignFile) : Promise.resolve("")
      ]);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: Number(price),
          description,
          image_url,
          vial_design_url,
          accent,
          gender,
          vial_size: vialSize,
          in_stock: inStock,
          stock_count: Number(stockCount)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add product.");

      // Done — head to Inventory to see it in the list.
      router.push("/admin/inventory");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <h1 className="font-display text-2xl text-paper">Add a new product</h1>
      <p className="mt-2 text-paper/60">
        Fill in as much as you have — you can always come back and edit it
        later from Inventory.
      </p>

      {error && (
        <p className="mt-4 border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 border border-line bg-panel p-6 md:grid-cols-2"
      >
        <label className="text-sm text-paper/70">
          Name
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="text-sm text-paper/70 md:col-span-2">
          Short description (the scent's story — shown on its own page)
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Gender
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as typeof gender)}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          >
            <option value="unisex">Unisex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label className="text-sm text-paper/70">
          Vial size
          <input
            placeholder="e.g. 50ml"
            value={vialSize}
            onChange={(e) => setVialSize(e.target.value)}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Elements / sticker image
          <span className="block text-xs text-paper/40">
            The small image shown on the shop grid. Optional — a placeholder
            bottle is shown if left blank.
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setElementsFile(e.target.files?.[0] || null)}
            className="mt-1 w-full text-paper/70 file:mr-3 file:border file:border-line file:bg-ink file:px-3 file:py-1 file:text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Vial design photo
          <span className="block text-xs text-paper/40">
            The bigger photo shown on the product's own page. Also optional.
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setVialDesignFile(e.target.files?.[0] || null)}
            className="mt-1 w-full text-paper/70 file:mr-3 file:border file:border-line file:bg-ink file:px-3 file:py-1 file:text-paper"
          />
        </label>

        <label className="text-sm text-paper/70">
          Placeholder colour
          <span className="block text-xs text-paper/40">
            Used for the illustrated bottle until real photos are added.
          </span>
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="mt-1 h-10 w-full border border-line bg-ink"
          />
        </label>

        <label className="text-sm text-paper/70">
          Stock count
          <span className="block text-xs text-paper/40">
            Admin-only — customers never see this number, only "in stock" /
            "out of stock".
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={stockCount}
            onChange={(e) => setStockCount(e.target.value)}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-paper"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-paper/70">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4"
          />
          In stock (shown to customers)
        </label>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 border border-brass/60 px-4 py-2 text-sm uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10 disabled:opacity-50 md:col-span-2"
        >
          {saving ? "Adding…" : "Add product"}
        </button>
      </form>
    </main>
  );
}
