import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/ShopBrowser";
import { getBusiness, getCategories, getProducts } from "@/lib/store";
import { messengerUrl } from "@/lib/messenger";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Generation Bread breads, pastries, and cakes. Freshly baked daily in Tacloban City, Philippines.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories, business] = await Promise.all([
    getProducts(),
    getCategories(),
    getBusiness(),
  ]);

  return (
    <>
      <section className="bg-cream-50 border-b border-ink-100">
        <div className="container-site pt-14 pb-10">
          <span className="eyebrow mb-3">Shop</span>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-950">
            The menu
          </h1>
          <p className="text-ink-500 mt-4 max-w-lg">
            Freshly baked in Tacloban City. Breads, pastries, and cakes made
            with quality ingredients every day.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center text-ink-400">Loading products…</div>}>
        <ShopBrowser products={products} categories={categories} />
      </Suspense>

      <section className="section bg-cream-100 border-t border-ink-100">
        <div className="container-site text-center">
          <span className="eyebrow mb-3">Custom orders</span>
          <h2 className="font-display text-3xl lg:text-4xl text-ink-950 mb-4">
            Bulk orders available
          </h2>
          <p className="text-ink-500 mb-7 max-w-lg mx-auto">
            Planning an event or need trays of bread? We offer special pricing for
            bulk orders and custom cakes — message us for a quote.
          </p>
          <a
            href={messengerUrl(
              business.social.messenger,
              "Hi! I'm interested in bulk ordering."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Contact for bulk orders
          </a>
        </div>
      </section>
    </>
  );
}
