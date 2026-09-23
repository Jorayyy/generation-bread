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
      className="group block h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100">
        <ProductImage
          src={image}
          alt={product.name}
          className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />

        {product.badge && (
          <span className="absolute top-3 left-3 badge bg-white/95 text-brand-800 shadow-sm backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {!available && (
          <div className="absolute inset-0 bg-cream-50/70 flex items-center justify-center rounded-2xl">
            <span className="badge bg-ink-900 text-cream-50">Sold out</span>
          </div>
        )}
      </div>

      <div className="pt-4 px-1">
        <p className="text-[11px] font-medium text-ink-400 capitalize tracking-wide">
          {product.category}
        </p>
        <h3 className="font-display text-lg text-ink-950 mt-1 leading-snug group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-[15px] font-medium text-ink-900">
            {formatPeso(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-ink-400 line-through">
              {formatPeso(product.compareAtPrice)}
            </span>
          )}
        </div>
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.allergens.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-ink-500 bg-cream-100 rounded-full px-2 py-0.5"
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
