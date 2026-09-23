"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPeso } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import type { FulfillmentMethod, PaymentMethod } from "@/lib/types";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "gcash", label: "GCash", hint: "Details sent after order" },
  { value: "maya", label: "Maya", hint: "Details sent after order" },
  { value: "bank", label: "Bank transfer", hint: "Details sent after order" },
  { value: "cod", label: "Cash on delivery", hint: "Select areas only" },
];

const FULFILLMENT_OPTIONS: { value: FulfillmentMethod; label: string; hint: string }[] = [
  { value: "pickup", label: "Store pickup", hint: "P. Gomez Street · Free" },
  { value: "delivery", label: "Delivery", hint: "Within Tacloban City" },
];

export default function CheckoutPage() {
  const { items, subtotal, ready, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("gcash");
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const needsAddress = fulfillment === "delivery";
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      (needsAddress &&
        (!form.address.trim() || !form.city.trim() || !form.province.trim()))
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            variantId: item.variantId,
          })),
          customer: form,
          paymentMethod: payment,
          fulfillment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/checkout/success?order=${encodeURIComponent(data.order.orderNumber)}`);
    } catch {
      setError("Connection error. Please try again.");
      setSubmitting(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <section className="bg-cream-50 min-h-[70vh]">
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-ink-950 mb-4">
            Your cart is empty
          </h1>
          <p className="text-ink-500 text-sm mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link href="/products" className="btn btn-primary">
            Shop products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50">
      <div className="container-site py-12">
        <span className="eyebrow mb-3">Checkout</span>
        <h1 className="font-display text-4xl lg:text-5xl text-ink-950 mb-10">
          Pickup &amp; payment
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Fieldset legend="How would you like your order?">
              <div className="grid sm:grid-cols-2 gap-3">
                {FULFILLMENT_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    name="fulfillment"
                    value={option.value}
                    label={option.label}
                    hint={option.hint}
                    checked={fulfillment === option.value}
                    onChange={() => setFulfillment(option.value)}
                  />
                ))}
              </div>
              {fulfillment === "pickup" && (
                <p className="text-xs text-ink-500 mt-4 bg-cream-100 border border-cream-200 px-3 py-2 rounded-xl">
                  Pick up at <strong>P. Gomez Street, Tacloban City</strong> — daily 7:00
                  AM – 11:00 PM. We&apos;ll message you when your bakes are ready.
                </p>
              )}
            </Fieldset>

            <Fieldset legend="Contact information">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  required
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Juan Dela Cruz"
                />
                <Field
                  label="Mobile number"
                  required
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  placeholder="09XX XXX XXXX"
                  type="tel"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Email (optional)"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@email.com"
                    type="email"
                  />
                </div>
              </div>
            </Fieldset>

            {fulfillment === "delivery" ? (
              <Fieldset legend="Delivery address">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field
                      label="Street address / barangay"
                      required
                      value={form.address}
                      onChange={(v) => update("address", v)}
                      placeholder="House no., street, barangay"
                    />
                  </div>
                  <Field
                    label="City / municipality"
                    required
                    value={form.city}
                    onChange={(v) => update("city", v)}
                    placeholder="Tacloban City"
                  />
                  <Field
                    label="Province"
                    required
                    value={form.province}
                    onChange={(v) => update("province", v)}
                    placeholder="Leyte"
                  />
                  <Field
                    label="ZIP code"
                    value={form.zip}
                    onChange={(v) => update("zip", v)}
                    placeholder="6500"
                  />
                  <div className="sm:col-span-2">
                    <NotesField
                      value={form.notes}
                      onChange={(v) => update("notes", v)}
                      placeholder="Landmark, preferred delivery time, etc."
                    />
                  </div>
                </div>
              </Fieldset>
            ) : (
              <Fieldset legend="Pickup notes (optional)">
                <NotesField
                  value={form.notes}
                  onChange={(v) => update("notes", v)}
                  placeholder="Preferred pickup time, gift message, etc."
                />
              </Fieldset>
            )}

            <Fieldset legend="Payment method">
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    name="payment"
                    value={option.value}
                    label={option.label}
                    hint={option.hint}
                    checked={payment === option.value}
                    onChange={() => setPayment(option.value)}
                  />
                ))}
              </div>
              <p className="text-xs text-ink-400 mt-4">
                Payment details are sent after your order is confirmed. Delivery fees are
                calculated based on your location and confirmed via Messenger or phone.
              </p>
            </Fieldset>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit card p-6 space-y-4">
            <h2 className="font-display text-xl text-ink-950">Your order</h2>

            <ul className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="w-14 h-16 bg-cream-100 shrink-0 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-ink-950 truncate">{item.name}</p>
                    {item.variantLabel && (
                      <p className="text-xs text-ink-400">{item.variantLabel}</p>
                    )}
                    <p className="text-xs text-ink-400">Qty {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium shrink-0">
                    {formatPeso(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-ink-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Subtotal</span>
                <span>{formatPeso(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">
                  {fulfillment === "pickup" ? "Pickup" : "Delivery"}
                </span>
                <span className="text-ink-400 text-xs">
                  {fulfillment === "pickup" ? "Free" : "On confirmation"}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-ink-100">
                <span className="font-display text-sm">Total</span>
                <span className="font-display text-2xl text-ink-950">
                  {formatPeso(subtotal)}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="btn btn-primary w-full justify-center disabled:opacity-50"
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>

            <p className="text-xs text-ink-400 leading-relaxed">
              Your order is saved as <strong>Pending</strong>. We&apos;ll confirm stock and
              delivery with you shortly.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="card p-6">
      <legend className="px-2 font-display text-sm text-brand-700">{legend}</legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

function ChoiceCard({
  name,
  value,
  label,
  hint,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
        checked ? "border-brand-500 bg-cream-50" : "border-ink-200 hover:border-ink-300"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 accent-brand-600"
      />
      <span>
        <span className="block font-display text-ink-950">{label}</span>
        <span className="block text-xs text-ink-400 mt-0.5">{hint}</span>
      </span>
    </label>
  );
}

function NotesField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="label">Order notes (optional)</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="input resize-none"
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}
