import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import {
  getOrderById,
  getOrders,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/lib/store";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

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

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  return NextResponse.json({ orders: await getOrders() });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  try {
    const body = (await request.json()) as {
      id?: string;
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      note?: string;
    };
    if (!body.id) {
      return NextResponse.json({ error: "Order id required" }, { status: 400 });
    }

    if (body.paymentStatus && PAYMENT_STATUSES.includes(body.paymentStatus)) {
      const order = await updateOrderPaymentStatus(
        body.id,
        body.paymentStatus,
        body.note
      );
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json({ order });
    }

    if (!body.status || !STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Valid id and status required" }, { status: 400 });
    }
    const order = await updateOrderStatus(body.id, body.status, body.note);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
