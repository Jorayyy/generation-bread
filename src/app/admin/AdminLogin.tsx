"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword("");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid password");
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-brand-700 rounded-2xl flex items-center justify-center font-display text-2xl text-white mb-4">
            GB
          </div>
          <h1 className="font-display text-3xl text-ink-950">Admin Panel</h1>
          <p className="text-ink-500 mt-2 text-sm">Generation Bread Manager</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 border border-ink-100 rounded-3xl shadow-sm"
        >
          <label htmlFor="admin-password" className="label">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Enter password"
            autoFocus
            required
          />

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-5 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-ink-500 hover:text-brand-700 transition-colors"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
