import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { buildSalesSummary } from "@/lib/analytics";
import { getOrders, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [orders, products] = await Promise.all([
      getOrders(),
      getProducts({ includeUnlisted: true }),
    ]);
    const summary = buildSalesSummary(orders, products);
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
