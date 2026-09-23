"use client";

import Link from "next/link";
import { formatPeso } from "@/lib/format";
import { messengerUrl, orderMessageText } from "@/lib/messenger";
import { useCart } from "@/lib/cart-context";
import { useContent } from "@/lib/content-context";

export default function CartPage() {
  const { items, subtotal, count, setQty, remove, ready } = useCart();
  const { business } = useContent();

  return (
    <section className="section bg-cream-50">
      <div className="container-site">
        <span className="eyebrow mb-3">Your bag</span>
        <h1 className="font-display text-3xl lg:text-4xl text-ink-950 mb-10">
          Cart {ready && count > 0 ? `(${count})` : ""}
        </h1>

        {!ready ? (
          <div className="py-24 text-center text-ink-400 text-sm">Loading cart…</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-ink-200 rounded-3xl bg-white">
            <p className="font-display text-2xl text-ink-300 mb-5">
              Your cart is empty
            </p>
            <Link href="/products" className="btn btn-primary">
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-5 p-4 border border-ink-100 bg-white rounded-2xl"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="w-24 h-28 bg-cream-100 shrink-0 overflow-hidden rounded-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-display text-lg text-ink-950 hover:text-brand-700 transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="text-xs text-ink-500 mt-1">
                            {item.variantLabel}
                          </p>
                        )}
                        <p className="text-sm text-ink-500 mt-1">
                          {formatPeso(item.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="text-sm text-ink-400 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-ink-200 rounded-full bg-white">
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="w-9 h-9 rounded-full hover:bg-ink-50 text-ink-600"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm text-ink-900">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="w-9 h-9 rounded-full hover:bg-ink-50 text-ink-600"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display text-lg text-ink-950">
                        {formatPeso(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-32 h-fit border border-ink-100 bg-white rounded-3xl p-6 space-y-5">
              <h2 className="font-display text-xl text-ink-950">Order summary</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Subtotal</span>
                <span className="font-medium text-ink-900">{formatPeso(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Fulfillment</span>
                <span className="text-ink-400 text-xs">Pickup or delivery at checkout</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-ink-100">
                <span className="text-sm font-medium text-ink-700">Total</span>
                <span className="font-display text-2xl text-ink-950">{formatPeso(subtotal)}</span>
              </div>

              <div className="grid gap-2.5">
                <Link href="/checkout" className="btn btn-primary w-full !py-3.5">
                  Proceed to checkout
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
                <Link
                  href="/products"
                  className="btn btn-ghost w-full text-sm"
                >
                  Continue shopping
                </Link>
              </div>

              <p className="text-xs text-ink-400 leading-relaxed">
                Payment options: GCash, Maya, bank transfer, or COD for select areas.
                Choose free store pickup or Tacloban delivery at checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
