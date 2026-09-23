import type { Order, OrderStatus, PaymentMethod, Product } from "@/lib/types";

export interface DailyPoint {
  date: string;
  label: string;
  revenue: number;
  profit: number;
  orders: number;
  paidRevenue: number;
  paidProfit: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  qty: number;
  revenue: number;
  profit: number;
}

export interface SalesSummary {
  today: {
    revenue: number;
    paidRevenue: number;
    profit: number;
    orders: number;
    paidOrders: number;
  };
  yesterday: {
    revenue: number;
    paidRevenue: number;
    profit: number;
    orders: number;
  };
  week: {
    revenue: number;
    paidRevenue: number;
    profit: number;
    orders: number;
  };
  month: {
    revenue: number;
    paidRevenue: number;
    profit: number;
    orders: number;
  };
  allTime: {
    revenue: number;
    paidRevenue: number;
    unpaidRevenue: number;
    profit: number;
    orders: number;
  };
  daily: DailyPoint[];
  topProducts: TopProduct[];
  statusBreakdown: { status: OrderStatus; count: number; revenue: number }[];
  paymentBreakdown: { method: PaymentMethod; count: number; revenue: number }[];
  fulfillmentBreakdown: { method: string; count: number; revenue: number }[];
  paymentStatusBreakdown: { status: string; count: number; revenue: number }[];
  avgOrderValue: number;
  itemsSold: number;
  hasCostData: boolean;
}

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function labelFor(d: Date): string {
  return d.toLocaleDateString("en-PH", { weekday: "short" });
}

function isCancelled(order: Order): boolean {
  return order.status === "cancelled";
}

function isPaid(order: Order): boolean {
  return (order.paymentStatus ?? "unpaid") === "paid";
}

function productCostMap(products: Product[]): Map<string, number | null> {
  const map = new Map<string, number | null>();
  for (const p of products) {
    map.set(p.id, typeof p.cost === "number" ? p.cost : null);
  }
  return map;
}

function lineProfit(
  order: Order,
  costById: Map<string, number | null>
): number | null {
  let total = 0;
  let anyCost = false;
  for (const item of order.items) {
    const cost = costById.get(item.productId);
    if (cost === null || cost === undefined) continue;
    anyCost = true;
    total += (item.price - cost) * item.qty;
  }
  return anyCost ? total : null;
}

export function buildSalesSummary(orders: Order[], products: Product[]): SalesSummary {
  const costById = productCostMap(products);
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

  const hasCostData = products.some((p) => typeof p.cost === "number");

  const dailyMap = new Map<string, DailyPoint>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    dailyMap.set(key, {
      date: key,
      label: labelFor(d),
      revenue: 0,
      profit: 0,
      orders: 0,
      paidRevenue: 0,
      paidProfit: 0,
    });
  }

  const topMap = new Map<string, TopProduct>();
  const statusMap = new Map<OrderStatus, { count: number; revenue: number }>();
  const paymentMap = new Map<PaymentMethod, { count: number; revenue: number }>();
  const fulfillmentMap = new Map<string, { count: number; revenue: number }>();
  const payStatusMap = new Map<string, { count: number; revenue: number }>();
  let itemsSold = 0;

  for (const status of STATUS_ORDER) {
    statusMap.set(status, { count: 0, revenue: 0 });
  }

  const today = { revenue: 0, paidRevenue: 0, profit: 0, orders: 0, paidOrders: 0 };
  const yesterday = { revenue: 0, paidRevenue: 0, profit: 0, orders: 0 };
  const week = { revenue: 0, paidRevenue: 0, profit: 0, orders: 0 };
  const month = { revenue: 0, paidRevenue: 0, profit: 0, orders: 0 };
  const allTime = {
    revenue: 0,
    paidRevenue: 0,
    unpaidRevenue: 0,
    profit: 0,
    orders: 0,
  };

  for (const order of orders) {
    const created = new Date(order.createdAt);
    const day = startOfDay(created);
    const revenue = order.total;
    const paid = isPaid(order);
    const profit = lineProfit(order, costById);
    const cancelled = isCancelled(order);

    const statusEntry = statusMap.get(order.status);
    if (statusEntry) {
      statusEntry.count += 1;
      statusEntry.revenue += revenue;
    }

    const payEntry = paymentMap.get(order.paymentMethod) ?? { count: 0, revenue: 0 };
    payEntry.count += 1;
    payEntry.revenue += revenue;
    paymentMap.set(order.paymentMethod, payEntry);

    const fulfill = order.fulfillment === "pickup" ? "pickup" : "delivery";
    const fEntry = fulfillmentMap.get(fulfill) ?? { count: 0, revenue: 0 };
    fEntry.count += 1;
    fEntry.revenue += revenue;
    fulfillmentMap.set(fulfill, fEntry);

    const pStatus = order.paymentStatus ?? "unpaid";
    const psEntry = payStatusMap.get(pStatus) ?? { count: 0, revenue: 0 };
    psEntry.count += 1;
    psEntry.revenue += revenue;
    payStatusMap.set(pStatus, psEntry);

    if (cancelled) continue;

    allTime.orders += 1;
    allTime.revenue += revenue;
    if (paid) allTime.paidRevenue += revenue;
    else allTime.unpaidRevenue += revenue;
    if (profit !== null) allTime.profit += profit;

    if (day.getTime() === todayStart.getTime()) {
      today.orders += 1;
      today.revenue += revenue;
      if (paid) {
        today.paidRevenue += revenue;
        today.paidOrders += 1;
      }
      if (profit !== null) today.profit += profit;
    }
    if (day.getTime() === yesterdayStart.getTime()) {
      yesterday.orders += 1;
      yesterday.revenue += revenue;
      if (paid) yesterday.paidRevenue += revenue;
      if (profit !== null) yesterday.profit += profit;
    }
    if (day >= weekStart) {
      week.orders += 1;
      week.revenue += revenue;
      if (paid) week.paidRevenue += revenue;
      if (profit !== null) week.profit += profit;
    }
    if (day >= monthStart) {
      month.orders += 1;
      month.revenue += revenue;
      if (paid) month.paidRevenue += revenue;
      if (profit !== null) month.profit += profit;
    }

    const key = dayKey(day);
    const point = dailyMap.get(key);
    if (point) {
      point.orders += 1;
      point.revenue += revenue;
      if (paid) point.paidRevenue += revenue;
      if (profit !== null) {
        point.profit += profit;
        if (paid) point.paidProfit += profit;
      }
    }

    for (const item of order.items) {
      itemsSold += item.qty;
      const existing = topMap.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        qty: 0,
        revenue: 0,
        profit: 0,
      };
      existing.qty += item.qty;
      existing.revenue += item.price * item.qty;
      const cost = costById.get(item.productId);
      if (cost !== null && cost !== undefined) {
        existing.profit += (item.price - cost) * item.qty;
      }
      topMap.set(item.productId, existing);
    }
  }

  const daily = Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const topProducts = Array.from(topMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  return {
    today,
    yesterday,
    week,
    month,
    allTime,
    daily,
    topProducts,
    statusBreakdown: STATUS_ORDER.map((status) => ({
      status,
      count: statusMap.get(status)?.count ?? 0,
      revenue: statusMap.get(status)?.revenue ?? 0,
    })),
    paymentBreakdown: Array.from(paymentMap.entries()).map(([method, v]) => ({
      method,
      count: v.count,
      revenue: v.revenue,
    })),
    fulfillmentBreakdown: Array.from(fulfillmentMap.entries()).map(([method, v]) => ({
      method,
      count: v.count,
      revenue: v.revenue,
    })),
    paymentStatusBreakdown: Array.from(payStatusMap.entries()).map(([status, v]) => ({
      status,
      count: v.count,
      revenue: v.revenue,
    })),
    avgOrderValue: allTime.orders > 0 ? allTime.revenue / allTime.orders : 0,
    itemsSold,
    hasCostData,
  };
}
