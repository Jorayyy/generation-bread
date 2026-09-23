"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPeso } from "@/lib/format";
import type { SalesSummary } from "@/lib/analytics";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const METHOD_LABELS: Record<string, string> = {
  gcash: "GCash",
  maya: "Maya",
  bank: "Bank transfer",
  cod: "Cash on delivery",
  pickup: "Store pickup",
  delivery: "Delivery",
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

function pctChange(current: number, previous: number): string | null {
  if (previous === 0) {
    if (current === 0) return null;
    return "New";
  }
  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(change));
  if (change === 0) return "0%";
  return `${change > 0 ? "+" : "−"}${rounded}%`;
}

function ChangeBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-xs text-ink-400">—</span>;
  const positive = value === "New" || value.startsWith("+");
  return (
    <span
      className={`badge border ${
        positive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {value}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  change,
}: {
  label: string;
  value: string;
  hint?: string;
  change?: string | null;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-ink-400 text-xs">{label}</p>
        {change !== undefined && <ChangeBadge value={change} />}
      </div>
      <p className="font-display text-2xl text-ink-950 mt-2">{value}</p>
      {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}

function BarChart({ data }: { data: SalesSummary["daily"] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const paidMax = Math.max(...data.map((d) => d.paidRevenue), 1);
  const scale = Math.max(max, paidMax);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 sm:gap-3 h-44">
        {data.map((point) => {
          const totalH = Math.max((point.revenue / scale) * 100, point.revenue > 0 ? 4 : 2);
          return (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="relative w-full flex-1 flex items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-md bg-cream-200 relative overflow-hidden"
                  style={{ height: `${totalH}%` }}
                  title={`${point.label}: ${formatPeso(point.revenue)} (${point.orders} orders)`}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-brand-700"
                    style={{ height: point.revenue > 0 ? `${(point.paidRevenue / Math.max(point.revenue, 1)) * 100}%` : "0%" }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-ink-400 truncate w-full text-center">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-brand-700" aria-hidden="true" />
          Paid revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cream-200" aria-hidden="true" />
          Total (incl. unpaid)
        </span>
      </div>
      <p className="text-xs text-ink-400">Last 7 days</p>
    </div>
  );
}

function ProfitBars({ data }: { data: SalesSummary["daily"] }) {
  const max = Math.max(...data.map((d) => d.profit), 1);
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 sm:gap-3 h-32">
        {data.map((point) => {
          const h = point.profit > 0 ? Math.max((point.profit / max) * 100, 6) : 2;
          return (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="w-full flex-1 flex items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-md bg-honey-400"
                  style={{ height: `${h}%` }}
                  title={`${point.label} profit: ${formatPeso(point.profit)}`}
                />
              </div>
              <span className="text-[10px] text-ink-400 truncate w-full text-center">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-ink-400">Estimated daily profit (requires product cost)</p>
    </div>
  );
}

function DonutChart({
  slices,
}: {
  slices: { label: string; value: number; color: string }[];
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const segments = slices
    .filter((s) => s.value > 0)
    .reduce<{ label: string; value: number; color: string; pct: number; offset: number }[]>(
      (acc, s) => {
        const pct = (s.value / total) * 100;
        const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].pct : 0;
        acc.push({ ...s, pct, offset });
        return acc;
      },
      [],
    );

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--color-cream-100)" strokeWidth="5" />
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke={seg.color}
              strokeWidth="5"
              strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
              strokeDashoffset={-seg.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl text-ink-950">{total}</span>
          <span className="text-[10px] text-ink-400">orders</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm flex-1 w-full">
        {slices
          .filter((s) => s.value > 0)
          .map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-ink-600">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                  aria-hidden="true"
                />
                {s.label}
              </span>
              <span className="font-medium text-ink-950">{s.value}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

function ProgressList({
  items,
  total,
  format = formatPeso,
}: {
  items: { label: string; value: number; meta?: string }[];
  total: number;
  format?: (n: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
            <span className="text-ink-700 truncate">{item.label}</span>
            <span className="font-medium text-ink-950 shrink-0">
              {item.meta ?? format(item.value)}
            </span>
          </div>
          <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-700 rounded-full"
              style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
            />
          </div>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-sm text-ink-400">No data yet.</li>
      )}
      <li className="text-xs text-ink-400 pt-1 border-t border-ink-100">
        {total > 0 ? `Across ${total} order${total === 1 ? "" : "s"}` : "No orders yet"}
      </li>
    </ul>
  );
}

export default function AdminAnalytics() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => setSummary(data.summary))
      .catch(() => setError("Failed to load sales data."))
      .finally(() => setLoading(false));
  }, []);

  const statusSlices = useMemo(() => {
    if (!summary) return [];
    const colors: Record<string, string> = {
      pending: "var(--color-honey-400)",
      confirmed: "var(--color-brand-500)",
      preparing: "var(--color-amber-500)",
      ready: "var(--color-emerald-500)",
      shipped: "var(--color-indigo-500)",
      delivered: "var(--color-brand-700)",
      cancelled: "var(--color-red-400)",
    };
    return summary.statusBreakdown
      .filter((s) => s.count > 0)
      .map((s) => ({
        label: STATUS_LABELS[s.status],
        value: s.count,
        color: colors[s.status] ?? "var(--color-ink-300)",
      }));
  }, [summary]);

  const paymentSlices = useMemo(() => {
    if (!summary) return [];
    const colors: Record<string, string> = {
      gcash: "var(--color-brand-600)",
      maya: "var(--color-brand-400)",
      bank: "var(--color-honey-500)",
      cod: "var(--color-ink-400)",
    };
    return summary.paymentBreakdown
      .filter((p) => p.count > 0)
      .map((p) => ({
        label: METHOD_LABELS[p.method] ?? p.method,
        value: p.count,
        color: colors[p.method] ?? "var(--color-ink-300)",
      }));
  }, [summary]);

  if (loading) {
    return (
      <div className="py-16 text-center text-ink-400 text-sm">Loading sales data…</div>
    );
  }

  if (error || !summary) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600 text-sm mb-4">{error || "No data."}</p>
        <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const revenueChange = pctChange(summary.today.revenue, summary.yesterday.revenue);
  const ordersChange = pctChange(summary.today.orders, summary.yesterday.orders);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow mb-2">Admin</span>
          <h1 className="font-display text-3xl lg:text-4xl text-ink-950">Sales</h1>
          <p className="text-ink-500 mt-2 text-sm">
            Daily revenue, profit, and order insights
          </p>
        </div>
        <Link href="/admin/orders" className="btn btn-secondary !py-2 text-sm">
          Manage orders
        </Link>
      </div>

      {!summary.hasCostData && (
        <div className="px-4 py-3 card bg-honey-50 border-honey-200 text-sm text-ink-700">
          Profit uses product <strong>cost per unit</strong>. Add costs on the{" "}
          <Link href="/admin/products" className="text-brand-700 underline">
            Products page
          </Link>{" "}
          to track real margins. Until then, profit may show ₱0.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today revenue"
          value={formatPeso(summary.today.revenue)}
          hint={`${summary.today.orders} order${summary.today.orders === 1 ? "" : "s"}`}
          change={revenueChange}
        />
        <StatCard
          label="Today paid"
          value={formatPeso(summary.today.paidRevenue)}
          hint={`${summary.today.paidOrders} paid`}
        />
        <StatCard
          label="Today profit"
          value={formatPeso(summary.today.profit)}
          hint={summary.hasCostData ? "From product costs" : "Add costs for accuracy"}
        />
        <StatCard
          label="Orders today"
          value={String(summary.today.orders)}
          hint={`${summary.today.orders - summary.today.paidOrders} unpaid`}
          change={ordersChange}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Yesterday revenue" value={formatPeso(summary.yesterday.revenue)} hint={`${summary.yesterday.orders} orders`} />
        <StatCard label="Last 7 days" value={formatPeso(summary.week.revenue)} hint={`${summary.week.orders} orders`} />
        <StatCard label="This month" value={formatPeso(summary.month.revenue)} hint={`${summary.month.orders} orders`} />
        <StatCard label="All-time revenue" value={formatPeso(summary.allTime.revenue)} hint={`${summary.allTime.orders} orders`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-ink-950">Daily revenue</h2>
            <span className="text-xs text-ink-400">Last 7 days</span>
          </div>
          <BarChart data={summary.daily} />
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg text-ink-950 mb-5">Order status</h2>
          {statusSlices.length === 0 ? (
            <p className="text-sm text-ink-400">No orders yet.</p>
          ) : (
            <DonutChart slices={statusSlices} />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-ink-950">Daily profit</h2>
            <span className="text-xs text-ink-400">Estimate</span>
          </div>
          <ProfitBars data={summary.daily} />
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg text-ink-950 mb-5">Payment methods</h2>
          {paymentSlices.length === 0 ? (
            <p className="text-sm text-ink-400">No orders yet.</p>
          ) : (
            <DonutChart slices={paymentSlices} />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-ink-950">Top products</h2>
            <span className="text-xs text-ink-400">By revenue</span>
          </div>
          <ProgressList
            items={summary.topProducts.map((p) => ({
              label: p.name,
              value: p.revenue,
              meta: `${formatPeso(p.revenue)} · ${p.qty} sold`,
            }))}
            total={summary.topProducts.length}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display text-lg text-ink-950 mb-5">Payment status</h2>
            <ProgressList
              items={summary.paymentStatusBreakdown
                .filter((p) => p.count > 0)
                .map((p) => ({
                  label: METHOD_LABELS[p.status] ?? p.status,
                  value: p.revenue,
                  meta: `${formatPeso(p.revenue)} · ${p.count}`,
                }))}
              total={summary.allTime.orders}
            />
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg text-ink-950 mb-5">Fulfillment</h2>
            <ProgressList
              items={summary.fulfillmentBreakdown
                .filter((f) => f.count > 0)
                .map((f) => ({
                  label: METHOD_LABELS[f.method] ?? f.method,
                  value: f.count,
                  meta: `${f.count} · ${formatPeso(f.revenue)}`,
                }))}
              total={summary.allTime.orders}
              format={(n) => String(n)}
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Paid revenue (all time)"
          value={formatPeso(summary.allTime.paidRevenue)}
          hint="Marked as paid"
        />
        <StatCard
          label="Unpaid revenue"
          value={formatPeso(summary.allTime.unpaidRevenue)}
          hint="Awaiting payment"
        />
        <StatCard
          label="Avg order value"
          value={formatPeso(summary.avgOrderValue)}
          hint="All active orders"
        />
        <StatCard
          label="Items sold"
          value={String(summary.itemsSold)}
          hint="Units across orders"
        />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg text-ink-950">All-time profit</h2>
          <span className="text-xs text-ink-400">
            {summary.hasCostData ? "From product costs" : "Costs not set"}
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-ink-400 mb-1">Gross revenue</p>
            <p className="font-display text-3xl text-ink-950">
              {formatPeso(summary.allTime.revenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-400 mb-1">Estimated profit</p>
            <p className="font-display text-3xl text-ink-950">
              {formatPeso(summary.allTime.profit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-400 mb-1">Month profit</p>
            <p className="font-display text-3xl text-ink-950">
              {formatPeso(summary.month.profit)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
