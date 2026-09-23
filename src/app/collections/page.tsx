import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCategories, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Generation Bread categories — breads, pastries, and cakes baked daily in Tacloban City.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <>
      <section className="bg-cream-50 border-b border-ink-100">
        <div className="container-site pt-14 pb-10">
          <span className="eyebrow mb-3">Menu</span>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-950">
            Browse the lineup
          </h1>
          <p className="text-ink-500 mt-4 max-w-lg">
            Every Generation Bread category. Fresh bakes from Tacloban City.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site space-y-16">
          {categories.map((category, index) => {
            const items = products.filter((p) => p.category === category.slug);
            return (
              <Reveal key={category.id} delay={index * 60}>
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-7 pb-5 border-b border-ink-100">
                    <div>
                      <span className="eyebrow mb-2">Collection 0{index + 1}</span>
                      <h2 className="font-display text-2xl lg:text-3xl text-ink-950">
                        {category.name}
                      </h2>
                      <p className="text-ink-500 text-sm mt-2 max-w-lg">
                        {category.description}
                      </p>
                    </div>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="btn btn-ghost text-sm"
                    >
                      View all ({items.length})
                    </Link>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-ink-400 text-sm py-6">
                      Fresh bakes are on the way. Check back soon.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                      {items.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}

          {categories.length === 0 && (
            <div className="py-20 text-center border border-dashed border-ink-200 rounded-3xl">
              <p className="font-display text-2xl text-ink-300">
                No collections yet
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
