"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-panel p-8"
      >
        <h1 className="font-display text-2xl text-paper">Admin</h1>
        <p className="mt-2 text-sm text-paper/50">
          Enter the shop's admin password to manage products.
        </p>

        <label className="mt-6 block text-sm text-paper/70">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-paper"
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full border border-brass/60 px-4 py-2 text-sm uppercase tracking-wide text-brass-light hover:border-brass hover:bg-brass/10 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
