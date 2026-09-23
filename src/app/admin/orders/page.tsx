"use client";

import { useEffect, useState } from "react";
import { formatDate, formatPeso } from "@/lib/format";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "paid", "refunded"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  unpaid: "bg-honey-100 text-honey-800 border-honey-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  refunded: "bg-ink-100 text-ink-600 border-ink-200",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-honey-100 text-honey-800 border-honey-200",
  confirmed: "bg-brand-100 text-brand-700 border-brand-200",
  preparing: "bg-amber-100 text-amber-800 border-amber-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function changeStatus(id: string, status: OrderStatus) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setMessage(`Order marked as ${STATUS_LABELS[status]}.`);
        setTimeout(() => setMessage(""), 3000);
        load();
      } else {
        const data = await res.json().catch(() => null);
        setMessage(data?.error || "Failed to update order.");
        setTimeout(() => setMessage(""), 3000);
        load();
      }
    } catch {
      setMessage("Failed to update order.");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function changePayment(id: string, paymentStatus: PaymentStatus) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      if (res.ok) {
        setMessage(`Payment marked as ${PAYMENT_LABELS[paymentStatus]}.`);
        setTimeout(() => setMessage(""), 3000);
        load();
      } else {
        const data = await res.json().catch(() => null);
        setMessage(data?.error || "Failed to update payment.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("Failed to update payment.");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const filtered =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const counts = STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow mb-2">Admin</span>
        <h1 className="font-display text-3xl lg:text-4xl text-ink-950">Orders</h1>
        <p className="text-ink-500 mt-2 text-sm">
          Review incoming orders and update their status
        </p>
      </div>

      {message && (
        <div className="mb-5 px-4 py-3 card text-sm bg-brand-50 border-brand-200 text-brand-700">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          All ({orders.length})
        </FilterButton>
        {STATUSES.map((status) => (
          <FilterButton
            key={status}
            active={filter === status}
            onClick={() => setFilter(status)}
          >
            {STATUS_LABELS[status]} ({counts[status] ?? 0})
          </FilterButton>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-400 text-sm">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 card text-center">
          <p className="font-display text-2xl text-ink-300">
            No orders {filter !== "all" ? `with status ${filter}` : "yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="card">
              <div className="p-5 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg text-ink-950">{order.orderNumber}</p>
                    <span className={`badge border ${STATUS_STYLES[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    <span
                      className={`badge border ${
                        PAYMENT_STYLES[order.paymentStatus ?? "unpaid"]
                      }`}
                    >
                      {PAYMENT_LABELS[order.paymentStatus ?? "unpaid"]}
                    </span>
                  </div>
                  <p className="text-ink-500 text-sm mt-1">
                    {order.customer.name} · {order.customer.phone}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">
                    {formatDate(order.createdAt)} · {order.paymentMethod.toUpperCase()} ·{" "}
                    {(order.fulfillment === "pickup" ? "Pickup" : "Delivery")} ·{" "}
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <p className="font-display text-xl text-ink-950">{formatPeso(order.total)}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}
                    aria-label={`Status for ${order.orderNumber}`}
                    className="input !w-auto !py-2 text-xs"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <select
                    value={order.paymentStatus ?? "unpaid"}
                    onChange={(e) =>
                      changePayment(order.id, e.target.value as PaymentStatus)
                    }
                    aria-label={`Payment for ${order.orderNumber}`}
                    className="input !w-auto !py-2 text-xs"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {PAYMENT_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="btn btn-ghost !py-2 text-xs"
                  >
                    {expanded === order.id ? "Hide" : "Details"}
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-ink-100 p-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs text-ink-400 mb-3">Items</h3>
                    <ul className="space-y-3">
                      {order.items.map((item, index) => (
                        <li key={`${item.productId}-${index}`} className="flex gap-3 text-sm">
                          <div className="w-12 h-14 bg-cream-100 shrink-0 overflow-hidden rounded-lg">
                            {item.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-ink-950">{item.name}</p>
                            {item.variantLabel && (
                              <p className="text-xs text-ink-400">{item.variantLabel}</p>
                            )}
                            <p className="text-xs text-ink-400">
                              {item.qty} × {formatPeso(item.price)}
                            </p>
                          </div>
                          <span className="font-medium">
                            {formatPeso(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-ink-100 text-sm flex justify-between">
                      <span className="text-ink-500">Subtotal</span>
                      <span className="font-medium">{formatPeso(order.subtotal)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs text-ink-400 mb-3">Customer</h3>
                    <dl className="space-y-2 text-sm">
                      <DetailRow label="Name">{order.customer.name}</DetailRow>
                      <DetailRow label="Phone">{order.customer.phone}</DetailRow>
                      {order.customer.email && (
                        <DetailRow label="Email">{order.customer.email}</DetailRow>
                      )}
                      {order.fulfillment !== "pickup" && (
                        <DetailRow label="Address">
                          {order.customer.address}, {order.customer.city},{" "}
                          {order.customer.province} {order.customer.zip}
                        </DetailRow>
                      )}
                      <DetailRow label="Payment">{order.paymentMethod}</DetailRow>
                      <DetailRow label="Payment status">
                        {PAYMENT_LABELS[order.paymentStatus ?? "unpaid"]}
                      </DetailRow>
                      <DetailRow label="Fulfillment">
                        {order.fulfillment === "pickup" ? "Store pickup" : "Delivery"}
                      </DetailRow>
                      {order.customer.notes && (
                        <DetailRow label="Notes">{order.customer.notes}</DetailRow>
                      )}
                    </dl>

                    <h3 className="text-xs text-ink-400 mt-5 mb-3">History</h3>
                    <ul className="space-y-1.5 text-xs text-ink-500">
                      {order.history.map((entry, index) => (
                        <li key={index}>
                          {STATUS_LABELS[entry.status] ?? entry.status} —{" "}
                          {new Date(entry.at).toLocaleString("en-PH")}
                          {entry.note ? ` (${entry.note})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="text-ink-400 w-24 shrink-0">{label}</dt>
      <dd className="text-ink-800">{children}</dd>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-xs rounded-full transition-colors ${
        active
          ? "bg-brand-700 text-white"
          : "bg-white border border-ink-200 text-ink-500 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}
