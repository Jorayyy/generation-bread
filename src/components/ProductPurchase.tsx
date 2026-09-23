"use client";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useContent } from "@/lib/content-context";
import { messengerUrl, productInquiryText } from "@/lib/messenger";
import { formatPeso } from "@/lib/format";
import { useEffect, useMemo, useState } from "react";

interface ProductPurchaseProps {
  product: Product;
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const { add } = useCart();
  const { business } = useContent();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [recent, setRecent] = useState<Product[]>([]);

  const available =
    product.status === "active" && (product.stock === null || product.stock > 0);

  const variantGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    product.variants.forEach((variant) => {
      if (!groups.has(variant.name)) groups.set(variant.name, new Set());
      groups.get(variant.name)?.add(variant.value);
    });
    return Array.from(groups.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [product.variants]);

  const activeVariant = useMemo(() => {
    if (!variantGroups.length) return null;
    const complete = variantGroups.every((group) => selected[group.name]);
    if (!complete) return null;
    return (
      product.variants.find((variant) =>
        variantGroups.every((group) => selected[group.name] === variant.value)
      ) ?? null
    );
  }, [product.variants, variantGroups, selected]);

  const needsSelection = variantGroups.length > 0 && !activeVariant;
  const price = activeVariant?.price ?? product.price;
  const canAdd = available && !needsSelection;

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem("generationbread-recent-v1");
        if (!raw) return;
        const parsed = JSON.parse(raw) as Product[];
        if (!Array.isArray(parsed)) return;
        setRecent(
          parsed.filter((p) => p.slug !== product.slug).slice(0, 4)
        );
      } catch {
        // ignore
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product.slug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("generationbread-recent-v1");
      const parsed: Product[] = raw ? JSON.parse(raw) : [];
      const next = [
        product,
        ...parsed.filter((p) => p.slug !== product.slug),
      ].slice(0, 8);
      localStorage.setItem("generationbread-recent-v1", JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [product]);

  function handleAdd() {
    if (!canAdd) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price,
        image: product.images[0] ?? "",
        variantId: activeVariant?.id ?? null,
        variantLabel: activeVariant
          ? `${activeVariant.name}: ${activeVariant.value}`
          : null,
      },
      qty
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-3">{product.category}</p>
        <h1 className="font-display text-3xl lg:text-4xl text-ink-950 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <span className="font-display text-2xl text-ink-950">{formatPeso(price)}</span>
          {product.compareAtPrice && product.compareAtPrice > price && (
            <span className="text-ink-400 line-through text-lg">
              {formatPeso(product.compareAtPrice)}
            </span>
          )}
          {product.badge && (
            <span className="badge bg-brand-50 text-brand-700">{product.badge}</span>
          )}
        </div>
      </div>

      <p className="text-ink-600 leading-relaxed text-[15px]">{product.description}</p>

      {product.allergens && product.allergens.length > 0 && (
        <div className="border border-cream-200 bg-cream-100/60 rounded-2xl px-5 py-4">
          <p className="label text-brand-700 mb-2.5">Contains</p>
          <div className="flex flex-wrap gap-1.5">
            {product.allergens.map((tag) => (
              <span
                key={tag}
                className="badge bg-white text-ink-700 border border-cream-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-500 mt-2.5">
            Baked in a facility that handles nuts. Message us for dietary concerns.
          </p>
        </div>
      )}

      {product.features.length > 0 && (
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-600">
              <span className="mt-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {product.ingredients && product.ingredients.length > 0 && (
        <div>
          <p className="label text-ink-700 mb-2.5">Ingredients</p>
          <p className="text-sm text-ink-500 leading-relaxed">
            {product.ingredients.join(", ")}.
          </p>
        </div>
      )}

      {variantGroups.map((group) => (
        <div key={group.name}>
          <p className="label text-ink-700 mb-2.5">{group.name}</p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = selected[group.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setSelected((current) => ({ ...current, [group.name]: value }))
                  }
                  className={`px-4 py-2.5 border rounded-full text-sm font-medium transition-all ${
                    active
                      ? "border-brand-800 bg-brand-700 text-white"
                      : "border-ink-200 hover:border-brand-500 text-ink-700"
                  }`}
                  aria-pressed={active}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-ink-200 rounded-full bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-11 rounded-full hover:bg-ink-50 transition-colors text-ink-600"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-ink-900">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="w-11 h-11 rounded-full hover:bg-ink-50 transition-colors text-ink-600"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <span className="text-sm text-ink-500">
          {!available
            ? "Sold out"
            : product.stock !== null && product.stock <= product.lowStockAt
              ? `Only ${product.stock} left`
              : "In stock"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="btn btn-primary w-full !py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {needsSelection ? `Select ${variantGroups[0]?.name}` : "Add to cart"}
        </button>
        <a
          href={messengerUrl(business.social.messenger, productInquiryText(product))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary w-full !py-3.5"
        >
          Ask via Messenger
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-ink-100 pt-6 text-center">
        {[
          { label: "Pickup & Delivery", hint: "Tacloban City" },
          { label: "GCash / Maya", hint: "Also COD" },
          { label: "Baked Fresh", hint: "Daily, 7 AM" },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs font-semibold text-ink-800">{item.label}</p>
            <p className="text-xs text-ink-400 mt-0.5">{item.hint}</p>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="pt-6 border-t border-ink-100">
          <p className="label text-ink-700 mb-3">Recently viewed</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {recent.map((item) => (
              <a
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group block bg-white border border-ink-100 rounded-xl p-3 hover:border-brand-300 transition-colors"
              >
                <p className="text-sm font-medium text-ink-800 truncate group-hover:text-brand-700">
                  {item.name}
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {formatPeso(item.price)}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
