import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/store";
import type { FulfillmentMethod, OrderCustomer, PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAYMENTS: PaymentMethod[] = ["gcash", "maya", "bank", "cod"];
const FULFILLMENTS: FulfillmentMethod[] = ["pickup", "delivery"];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      items?: { productId?: string; qty?: number; variantId?: string | null }[];
      customer?: Partial<OrderCustomer>;
      paymentMethod?: PaymentMethod;
      fulfillment?: FulfillmentMethod;
    };

    if (!Array.isArray(body.items) || !body.items || !body.customer) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const paymentMethod = PAYMENTS.includes(body.paymentMethod as PaymentMethod)
      ? (body.paymentMethod as PaymentMethod)
      : "gcash";
    const fulfillment = FULFILLMENTS.includes(body.fulfillment as FulfillmentMethod)
      ? (body.fulfillment as FulfillmentMethod)
      : "delivery";

    const result = await createOrder({
      items: body.items
        .filter((item) => item && typeof item.productId === "string")
        .map((item) => ({
          productId: item.productId as string,
          qty: Number(item.qty) || 1,
          variantId: item.variantId ?? null,
        })),
      customer: {
        name: body.customer.name ?? "",
        email: body.customer.email ?? "",
        phone: body.customer.phone ?? "",
        address: body.customer.address ?? "",
        city: body.customer.city ?? "",
        province: body.customer.province ?? "",
        zip: body.customer.zip ?? "",
        notes: body.customer.notes ?? "",
      },
      paymentMethod,
      fulfillment,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        status: result.order.status,
        items: result.order.items,
        subtotal: result.order.subtotal,
        total: result.order.total,
        paymentMethod: result.order.paymentMethod,
        fulfillment: result.order.fulfillment,
        createdAt: result.order.createdAt,
        customer: result.order.customer,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
