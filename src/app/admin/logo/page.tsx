"use client";

import { useEffect, useState } from "react";
import type { Business } from "@/lib/types";

export default function AdminLogo() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setBusiness(data.business);
        setLogoUrl(data.business?.logo ?? "");
      })
      .catch(() => setError("Failed to load current logo"));
  }, []);

  async function save(logo: string) {
    if (!business) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "business",
          data: { ...business, logo },
        }),
      });
      if (!res.ok) {
        setError("Failed to save logo");
        return;
      }
      setLogoUrl(logo);
      setMessage("Logo updated across the site.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Connection error");
    }
    setSaving(false);
  }

  const DEFAULT_LOGO = "/logo.svg";

  return (
    <div>
      <div className="mb-9">
        <h1 className="font-display text-3xl lg:text-4xl text-ink-950">Logo</h1>
        <p className="text-ink-500 mt-2 text-sm">
          Brand logo shown in the navbar, footer, and about sections
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-7">
          <h3 className="text-xs text-ink-400 mb-5">
            Preview
          </h3>
          <div className="flex items-center justify-center py-10 bg-cream-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Logo preview"
              className="w-32 h-32 rounded-full object-cover ring-2 ring-ink-200"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src =
                  "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=200";
              }}
            />
          </div>
          <div className="mt-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src =
                  "https://ui-avatars.com/api/?name=MA&background=000&color=fff&size=100";
              }}
            />
            <span className="font-display text-sm text-ink-950">
              Generation Bread
            </span>
          </div>
        </div>

        <div className="card p-7 space-y-5">
          <h3 className="text-xs text-ink-400">
            Update Logo
          </h3>

          <div>
            <label className="label mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-ink-200 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="https://example.com/logo.jpg"
            />
            <p className="text-ink-400 text-xs mt-2">
              JPG, PNG, or SVG URL (JPG/PNG recommended for best rendering)
            </p>
          </div>

          {message && (
            <p className="text-sm bg-cream-50 border border-ink-100 px-4 py-3">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => save(logoUrl)}
              disabled={saving || !logoUrl}
              className="btn btn-primary disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Logo"}
            </button>
            <button
              type="button"
              onClick={() => save(DEFAULT_LOGO)}
              className="btn btn-secondary"
            >
              Reset to Default
            </button>
          </div>

          <div className="pt-5 border-t border-ink-200">
            <h4 className="text-xs text-ink-400 mb-3">
              Quick Sources
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setLogoUrl(DEFAULT_LOGO)}
                className="block w-full text-left px-4 py-3 bg-cream-50 border border-ink-100 text-sm text-ink-600 hover:text-ink-950 hover:border-ink-400 transition-all"
              >
                Local GB Logo (default)
              </button>
              <button
                type="button"
                onClick={() =>
                  setLogoUrl(
                    "https://ui-avatars.com/api/?name=GB&background=0b4558&color=fff&size=400&bold=true"
                  )
                }
                className="block w-full text-left px-4 py-3 bg-cream-50 border border-ink-100 text-sm text-ink-600 hover:text-ink-950 hover:border-ink-400 transition-all"
              >
                Generated GB Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
