import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STAGES = [
  { step: 1, title: "Khung HTML Shell + Header", delayMs: 20 },
  { step: 2, title: "Khối Số dư tài khoản (Suspense #1)", delayMs: 260 },
  { step: 3, title: "Khối Đơn hàng gần đây (Suspense #2)", delayMs: 320 },
  { step: 4, title: "Khối Phân tích gợi ý (Suspense #3)", delayMs: 360 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "blocking" ? "blocking" : "stream";
  const encoder = new TextEncoder();
  const t0 = performance.now();

  if (mode === "blocking") {
    const out: Array<{ step: number; title: string; serverAtMs: number }> = [];
    for (const s of STAGES) {
      await new Promise((r) => setTimeout(r, s.delayMs));
      out.push({
        step: s.step,
        title: s.title,
        serverAtMs: Math.round(performance.now() - t0),
      });
    }
    const body = out.map((item) => JSON.stringify(item)).join("\n") + "\n";
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      for (const s of STAGES) {
        await new Promise((r) => setTimeout(r, s.delayMs));
        const chunk =
          JSON.stringify({
            step: s.step,
            title: s.title,
            serverAtMs: Math.round(performance.now() - t0),
          }) + "\n";
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
