"use client";

import Link from "next/link";
import { formatPeso } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ProductImage";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const image = product.images[0] ?? "";
  const available =
    product.status === "active" && (product.stock === null || product.stock > 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative bg-neutral-100 overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage
          src={image}
          alt={product.name}
          className="w-full h-full"
          priority={priority}
        />

        {product.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white text-brand-800 text-[10px] font-bold tracking-widest uppercase">
            {product.badge}
          </div>
        )}

        <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-brand-800 text-white text-xs font-bold">
          {formatPeso(product.price)}
        </div>

        {!available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-oswald text-sm font-bold tracking-[0.2em] uppercase">
              Sold Out
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="block w-full py-3 bg-brand-800 text-white text-center font-oswald text-xs font-bold tracking-[0.2em] uppercase">
            View Product
          </span>
        </div>
      </div>

      <div className="p-4 bg-white border border-neutral-200 border-t-0">
        <p className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase mb-1">
          {product.category}
        </p>
        <h3 className="font-oswald text-base font-semibold uppercase tracking-wide text-brand-900">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-brand-900">
            {formatPeso(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPeso(product.compareAtPrice)}
            </span>
          )}
        </div>
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.allergens.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-cream-100 text-brand-800 text-[9px] font-semibold tracking-wider uppercase border border-cream-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
