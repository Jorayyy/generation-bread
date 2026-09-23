"use client";

import { formatPeso } from "@/lib/format";
import { messengerUrl, orderMessageText } from "@/lib/messenger";
import { useCart } from "@/lib/cart-context";
import { useContent } from "@/lib/content-context";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, count } = useCart();
  const { business } = useContent();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px]"
        onClick={close}
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-cream-50 shadow-2xl flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
          <h2 className="font-display text-xl text-ink-950">
            Cart <span className="text-ink-400">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="p-2 -mr-2 rounded-full text-ink-400 hover:text-ink-800 hover:bg-ink-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-2xl text-ink-300">
              Your cart is empty
            </p>
            <Link
              href="/products"
              onClick={close}
              className="btn btn-primary"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 bg-white rounded-2xl p-3.5 border border-ink-100">
                  <div className="w-20 h-24 bg-cream-100 shrink-0 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display text-[15px] text-ink-900 truncate">
                          {item.name}
                        </p>
                        {item.variantLabel && (
                          <p className="text-xs text-ink-500 mt-0.5">
                            {item.variantLabel}
                          </p>
                        )}
                        <p className="text-xs text-ink-500 mt-0.5">
                          {formatPeso(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="text-ink-400 hover:text-red-600 text-xs shrink-0 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        className="w-8 h-8 rounded-full border border-ink-200 hover:border-brand-500 transition-colors text-ink-600"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm text-ink-900">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        className="w-8 h-8 rounded-full border border-ink-200 hover:border-brand-500 transition-colors text-ink-600"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <span className="ml-auto text-sm font-medium text-ink-900">
                        {formatPeso(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-ink-100 px-6 py-5 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Subtotal</span>
                <span className="font-display text-xl text-ink-950">
                  {formatPeso(subtotal)}
                </span>
              </div>
              <p className="text-xs text-ink-400">
                Delivery fee is calculated upon order confirmation.
              </p>
              <div className="grid gap-2.5">
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn btn-primary w-full !py-3.5"
                >
                  Checkout
                </Link>
                <a
                  href={messengerUrl(
                    business.social.messenger,
                    orderMessageText({
                      id: "cart",
                      orderNumber: "Cart",
                      status: "pending",
                      items: items.map((item) => ({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        qty: item.qty,
                        variantId: item.variantId,
                        variantLabel: item.variantLabel,
                      })),
                      subtotal,
                      total: subtotal,
                      customer: {
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        city: "",
                        province: "",
                        zip: "",
                        notes: "",
                      },
                      paymentMethod: "gcash",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      history: [],
                    })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full !py-3.5"
                >
                  Order via Messenger
                </a>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
