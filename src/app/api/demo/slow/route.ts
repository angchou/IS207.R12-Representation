import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYLOADS: Record<string, object> = {
  user: {
    endpoint: "/api/demo/slow?name=user",
    account: "Nhóm Thuyết Trình Frontend",
    plan: "Enterprise",
  },
  orders: {
    endpoint: "/api/demo/slow?name=orders",
    recentOrders: 28,
    pendingShipment: 3,
  },
  recs: {
    endpoint: "/api/demo/slow?name=recs",
    suggestedSkus: ["SP-0102", "SP-0441", "SP-1208", "SP-2910"],
  },
};

export async function GET(request: Request) {
  const t0 = performance.now();
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "task";
  const delay = Math.min(2000, Math.max(0, Number(searchParams.get("delay") ?? 300)));

  await new Promise((resolve) => setTimeout(resolve, delay));
  const serverElapsedMs = Math.round(performance.now() - t0);

  return NextResponse.json({
    name,
    requestedDelayMs: delay,
    serverElapsedMs,
    finishedAt: new Date().toISOString(),
    data: PAYLOADS[name] ?? { endpoint: name },
  });
}
