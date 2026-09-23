"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 12;

type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name" },
];

interface ShopBrowserProps {
  products: Product[];
  categories: Category[];
}

export default function ShopBrowser({ products, categories }: ShopBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as SortKey) || "featured";
  const maxPrice = Number(searchParams.get("max") || 0);

  const [limit, setLimit] = useState(PAGE_SIZE);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") params.delete(key);
      else params.set(key, value);
    });
    const qs = params.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    setLimit(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (maxPrice > 0) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        list.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
        );
    }

    return list;
  }, [products, activeCategory, query, sort, maxPrice]);

  const visible = filtered.slice(0, limit);

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-[5.5rem] lg:top-[6.25rem] z-30 bg-cream-50/95 backdrop-blur-md border-b border-ink-100">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 py-3.5">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1">
              {[{ slug: "all", name: "All" }, ...categories].map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => updateParams({ category: cat.slug === "all" ? null : cat.slug })}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-brand-800 text-white"
                      : "text-ink-500 hover:text-brand-800 hover:bg-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value === "featured" ? null : e.target.value })}
                aria-label="Sort products"
                className="input !w-auto !py-2 text-sm cursor-pointer"
              >
                {SORTS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={maxPrice || ""}
                onChange={(e) => updateParams({ max: e.target.value || null })}
                aria-label="Maximum price"
                className="input !w-auto !py-2 text-sm cursor-pointer"
              >
                <option value="">Any price</option>
                <option value="100">Under ₱100</option>
                <option value="200">Under ₱200</option>
                <option value="300">Under ₱300</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section">
        <div className="container-site">
          <div className="flex items-center justify-between mb-8">
            <p className="text-ink-500 text-sm">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {query ? ` for “${query}”` : ""}
            </p>
            {(activeCategory !== "all" || query || maxPrice > 0) && (
              <button
                type="button"
                onClick={() => {
                  router.replace("/products", { scroll: false });
                  setLimit(PAGE_SIZE);
                }}
                className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-ink-200 rounded-2xl bg-white">
              <p className="font-display text-2xl text-ink-300 mb-4">
                Nothing matches that
              </p>
              <button
                type="button"
                onClick={() => {
                  router.replace("/products", { scroll: false });
                }}
                className="btn btn-primary"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
              {visible.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          )}

          {filtered.length > visible.length && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setLimit((value) => value + PAGE_SIZE)}
                className="btn btn-secondary"
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
