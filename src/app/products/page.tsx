import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/ShopBrowser";
import { getCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Generation Bread breads, pastries, and cakes. Freshly baked daily in Tacloban City, Philippines.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-10">
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            Shop
          </span>
          <h1 className="font-oswald text-5xl lg:text-7xl font-bold uppercase tracking-tight">
            Products
          </h1>
          <p className="text-neutral-500 mt-5 max-w-lg">
            Freshly baked in Tacloban City. Breads, pastries, and cakes made
            with quality ingredients every day.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center text-neutral-400">Loading products…</div>}>
        <ShopBrowser products={products} categories={categories} />
      </Suspense>

      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <span className="text-[11px] text-neutral-400 tracking-[0.3em] uppercase block mb-3">
            Custom Orders
          </span>
          <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-4">
            Bulk Orders Available
          </h2>
          <p className="text-neutral-500 mb-7 max-w-lg mx-auto text-sm">
            Planning an event or need trays of bread? We offer special pricing for
            bulk orders and custom cakes — message us for a quote.
          </p>
          <a
            href="https://m.me/generationbread?text=Hi!%20I%27m%20interested%20in%20bulk%20ordering."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-4 bg-brand-800 text-white font-oswald text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-900 transition-colors"
          >
            Contact for Bulk Orders
          </a>
        </div>
      </section>
    </>
  );
}
