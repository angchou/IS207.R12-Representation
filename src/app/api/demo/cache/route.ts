import { NextResponse } from "next/server";
import { unstable_cache, revalidateTag } from "next/cache";

const CACHE_TAG = "demo-isr-product";

const getCachedProduct = unstable_cache(
  async () => {
    // Giả lập truy vấn DB chậm 280ms khi CACHE MISS
    await new Promise((resolve) => setTimeout(resolve, 280));
    return {
      productId: "SP-0001",
      name: "Workstation Pro 16",
      generatedAt: new Date().toISOString(),
      dbQueryCostMs: 280,
    };
  },
  ["demo-isr-product-key"],
  { tags: [CACHE_TAG], revalidate: 60 }
);

export async function GET() {
  const t0 = performance.now();
  const entry = await getCachedProduct();
  const serverElapsedMs = Number((performance.now() - t0).toFixed(2));
  const cacheStatus = serverElapsedMs < 100 ? "HIT" : "MISS (vừa dựng lại từ nguồn)";

  return NextResponse.json({
    cacheStatus,
    serverElapsedMs,
    tag: CACHE_TAG,
    entry,
  });
}

export async function POST() {
  revalidateTag(CACHE_TAG);
  return NextResponse.json({
    revalidated: true,
    tag: CACHE_TAG,
    at: new Date().toISOString(),
  });
}
