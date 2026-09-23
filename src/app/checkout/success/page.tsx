import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPeso, formatDateTime } from "@/lib/format";
import { messengerUrl, orderMessageText } from "@/lib/messenger";
import { getBusiness, getOrderById } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { order: identifier } = await searchParams;
  if (!identifier) notFound();

  const [order, business] = await Promise.all([
    getOrderById(identifier),
    getBusiness(),
  ]);
  if (!order) notFound();

  const messenger = messengerUrl(business.social.messenger, orderMessageText(order));

  return (
    <section className="bg-cream-50">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto bg-brand-700 text-white flex items-center justify-center rounded-full mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="eyebrow mb-3">Order received</span>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-950">Thank you!</h1>
          <p className="text-ink-500 mt-4 text-sm max-w-md mx-auto">
            Your order has been saved. Confirm it on Messenger so we can lock in your
            bakes and arrange pickup or delivery.
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-cream-50 border-b border-ink-100">
            <div>
              <p className="text-xs text-ink-400">Order number</p>
              <p className="font-display text-xl text-ink-950">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-400">Status</p>
              <p className="badge bg-brand-100 text-brand-700">{order.status}</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-4">
                <div className="w-16 h-20 bg-cream-100 shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-ink-950">{item.name}</p>
                  {item.variantLabel && (
                    <p className="text-xs text-ink-400 mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-ink-400 mt-0.5">
                    {item.qty} × {formatPeso(item.price)}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatPeso(item.price * item.qty)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t border-ink-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Subtotal</span>
                <span>{formatPeso(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Delivery</span>
                <span className="text-ink-400 text-xs">Confirmed separately</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-ink-100">
                <span className="font-display text-sm">Total</span>
                <span className="font-display text-2xl text-ink-950">
                  {formatPeso(order.total)}
                </span>
              </div>
            </div>

            <dl className="pt-4 border-t border-ink-100 text-sm space-y-2">
              <SummaryRow label="Fulfillment">
                {order.fulfillment === "pickup" ? "Store pickup" : "Delivery"}
              </SummaryRow>
              <SummaryRow label="Payment">{order.paymentMethod}</SummaryRow>
              <SummaryRow label="Name">{order.customer.name}</SummaryRow>
              <SummaryRow label="Phone">{order.customer.phone}</SummaryRow>
              {order.fulfillment !== "pickup" && (
                <SummaryRow label="Address">
                  {order.customer.address}, {order.customer.city}, {order.customer.province}{" "}
                  {order.customer.zip}
                </SummaryRow>
              )}
              <SummaryRow label="Placed">{formatDateTime(order.createdAt)}</SummaryRow>
            </dl>
          </div>

          <div className="p-6 border-t border-ink-100 grid sm:grid-cols-2 gap-3">
            <a href={messenger} target="_blank" rel="noopener noreferrer" className="btn btn-primary justify-center">
              Confirm on Messenger
            </a>
            <Link href="/products" className="btn btn-secondary justify-center">
              Continue shopping
            </Link>
          </div>
        </div>

        <p className="text-xs text-ink-400 text-center mt-6 leading-relaxed">
          Keep your order number: <strong>{order.orderNumber}</strong>. We&apos;ll contact
          you on {order.customer.phone} to confirm availability,{" "}
          {order.fulfillment === "pickup" ? "pickup time" : "delivery"}, and payment
          instructions.
        </p>
      </div>
    </section>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-400 text-xs">{label}</dt>
      <dd className="text-xs text-right text-ink-800">{children}</dd>
    </div>
  );
}
