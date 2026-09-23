"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories || []);
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCategories(data.categories || []);
      })
      .catch(() => {});
  }, []);

  function flash(msg: string, isError = false) {
    setError(isError ? msg : "");
    setMessage(isError ? "" : msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3500);
  }

  async function save(category: Category) {
    try {
      const res = await fetch("/api/admin/categories", {
        method: category.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error || "Failed to save", true);
        return;
      }
      setEditing(null);
      setIsNew(false);
      flash("Category saved.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products keep their category slug.")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        flash("Failed to delete", true);
        return;
      }
      flash("Category deleted.");
      load();
    } catch {
      flash("Connection error", true);
    }
  }

  const empty: Category = {
    id: "",
    slug: "",
    name: "",
    description: "",
    image: null,
    order: categories.length + 1,
    status: "active",
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-ink-950">
            Categories
          </h1>
          <p className="text-ink-500 mt-2 text-sm">Organize products into collections</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(empty);
            setIsNew(true);
          }}
          className="btn btn-primary"
        >
          + Add Category
        </button>
      </div>

      {message && (
        <div className="mb-5 px-4 py-3 bg-cream-50 border border-ink-100 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {editing && (
        <div className="card p-6 mb-6 space-y-4">
          <h2 className="font-display text-lg text-ink-950">
            {isNew ? "New Category" : `Edit: ${editing.name}`}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label mb-2">
                Name
              </label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="label mb-2">
                Slug
              </label>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="auto-from-name"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label mb-2">
                Description
              </label>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className="label mb-2">
                Order
              </label>
              <input
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="label mb-2">
                Status
              </label>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as Category["status"] })
                }
                className={inputCls}
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => save(editing)}
              className="btn btn-primary"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="card p-5 flex flex-wrap items-center gap-4"
          >
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-ink-950">{category.name}</h3>
                <span
                  className={`badge border ${
                    category.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-cream-100 text-ink-500 border-ink-200"
                  }`}
                >
                  {category.status}
                </span>
              </div>
              <p className="text-ink-500 text-sm mt-1">{category.description}</p>
              <p className="text-ink-400 text-xs mt-0.5">
                /{category.slug} · order {category.order}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(category);
                  setIsNew(false);
                }}
                className="px-4 py-2 text-xs border border-ink-200 hover:bg-cream-50 tracking-widest uppercase"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(category.id)}
                className="btn btn-ghost !py-2 text-xs !text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls =
  "input";
