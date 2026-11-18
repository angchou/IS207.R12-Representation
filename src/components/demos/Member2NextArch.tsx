"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { SmartButton } from "@/components/ui/SmartButton";
import { getResources, kb, ms, pct, sum, type Res } from "@/lib/resources";
import { patchMetric, useMetric } from "@/lib/metrics-store";

interface FetchBar {
  name: string;
  label: string;
  delayMs: number;
  startMs: number;
  endMs: number;
  serverElapsedMs?: number;
}

interface StreamChunkItem {
  step: number;
  title: string;
  serverAtMs: number;
  clientReceivedAtMs: number;
}

interface CacheCallLog {
  id: number;
  cacheStatus: string;
  serverElapsedMs: number;
  clientRoundTripMs: number;
  generatedAt: string;
}

export function Member2NextArch({ activeSlide }: { activeSlide: number }) {
  // ===== Slide 1: Đo JS bundle thật của /rsc-demo vs /client-demo qua iframe =====
  const [activeProbeRoute, setActiveProbeRoute] = useState<"/rsc-demo" | "/client-demo" | null>(
    null
  );
  const [probeKey, setProbeKey] = useState(0);
  const [rscJsResources, setRscJsResources] = useState<Res[] | null>(null);
  const [clientJsResources, setClientJsResources] = useState<Res[] | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const bundleMetric = useMetric("m2.bundle");

  const startBundleProbe = (route: "/rsc-demo" | "/client-demo") => {
    setActiveProbeRoute(route);
    setProbeKey((k) => k + 1);
  };

  const handleIframeLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !activeProbeRoute) return;
    setTimeout(() => {
      const list = getResources(win).filter((r) => r.type === "js");
      const totalBytes = sum(list, "decoded") || sum(list, "encoded");
      if (activeProbeRoute === "/rsc-demo") {
        setRscJsResources(list);
        patchMetric("m2.bundle", { rsc: totalBytes });
      } else {
        setClientJsResources(list);
        patchMetric("m2.bundle", { client: totalBytes });
      }
    }, 150);
  };

  // ===== Slide 2: Request Waterfall vs Promise.all gọi API thật (/api/demo/slow) =====
  const [fetchMode, setFetchMode] = useState<"waterfall" | "parallel">("waterfall");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchBars, setFetchBars] = useState<FetchBar[]>([]);
  const [totalFetchMs, setTotalFetchMs] = useState<number | null>(null);
  const fetchMetric = useMetric("m2.fetch");

  const ENDPOINTS = [
    { name: "user", label: "1. GET /api/demo/slow?name=user&delay=250", delayMs: 250 },
    { name: "orders", label: "2. GET /api/demo/slow?name=orders&delay=350", delayMs: 350 },
    { name: "recs", label: "3. GET /api/demo/slow?name=recs&delay=200", delayMs: 200 },
  ];

  const runRealFetchTest = async (mode: "waterfall" | "parallel") => {
    setFetchMode(mode);
    setIsFetching(true);
    setFetchBars([]);
    setTotalFetchMs(null);
    const t0 = performance.now();

    if (mode === "waterfall") {
      const collected: FetchBar[] = [];
      for (const ep of ENDPOINTS) {
        const startMs = Math.round(performance.now() - t0);
        const res = await fetch(`/api/demo/slow?name=${ep.name}&delay=${ep.delayMs}`, {
          cache: "no-store",
        });
        const json = await res.json();
        const endMs = Math.round(performance.now() - t0);
        collected.push({
          ...ep,
          startMs,
          endMs,
          serverElapsedMs: json.serverElapsedMs,
        });
        setFetchBars([...collected]);
      }
      const total = Math.round(performance.now() - t0);
      setTotalFetchMs(total);
      patchMetric("m2.fetch", { seq: total });
    } else {
      const results = await Promise.all(
        ENDPOINTS.map(async (ep) => {
          const startMs = Math.round(performance.now() - t0);
          const res = await fetch(`/api/demo/slow?name=${ep.name}&delay=${ep.delayMs}`, {
            cache: "no-store",
          });
          const json = await res.json();
          const endMs = Math.round(performance.now() - t0);
          return {
            ...ep,
            startMs,
            endMs,
            serverElapsedMs: json.serverElapsedMs,
          };
        })
      );
      const total = Math.round(performance.now() - t0);
      setFetchBars(results);
      setTotalFetchMs(total);
      patchMetric("m2.fetch", { par: total });
    }
    setIsFetching(false);
  };

  // ===== Slide 3: Streaming HTTP thật qua ReadableStream (/api/demo/stream) =====
  const [streamMode, setStreamMode] = useState<"stream" | "blocking">("stream");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamItems, setStreamItems] = useState<StreamChunkItem[]>([]);
  const [firstChunkMs, setFirstChunkMs] = useState<number | null>(null);
  const [allChunksMs, setAllChunksMs] = useState<number | null>(null);
  const streamMetric = useMetric("m2.stream");

  const runRealStream = async (mode: "stream" | "blocking") => {
    setStreamMode(mode);
    setIsStreaming(true);
    setStreamItems([]);
    setFirstChunkMs(null);
    setAllChunksMs(null);

    const t0 = performance.now();
    const res = await fetch(`/api/demo/stream?mode=${mode}`, { cache: "no-store" });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) {
      setIsStreaming(false);
      return;
    }

    let buffer = "";
    let firstRecorded: number | null = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const parsed = JSON.parse(line) as { step: number; title: string; serverAtMs: number };
        const clientAt = Math.round(performance.now() - t0);
        if (firstRecorded === null) {
          firstRecorded = clientAt;
          setFirstChunkMs(clientAt);
        }
        setStreamItems((prev) => [
          ...prev,
          { ...parsed, clientReceivedAtMs: clientAt },
        ]);
      }
    }

    const totalDone = Math.round(performance.now() - t0);
    setAllChunksMs(totalDone);
    if (mode === "stream") {
      patchMetric("m2.stream", { stream: { ttfb: firstRecorded ?? totalDone, done: totalDone } });
    } else {
      patchMetric("m2.stream", { block: { ttfb: firstRecorded ?? totalDone, done: totalDone } });
    }
    setIsStreaming(false);
  };

  // ===== Slide 4: Caching & On-demand Revalidation thật (/api/demo/cache) =====
  const [cacheLogs, setCacheLogs] = useState<CacheCallLog[]>([]);
  const [isCallingCache, setIsCallingCache] = useState(false);

  const readFromServerCache = async () => {
    setIsCallingCache(true);
    const t0 = performance.now();
    const res = await fetch("/api/demo/cache", { cache: "no-store" });
    const json = await res.json();
    const rtt = Number((performance.now() - t0).toFixed(1));
    setCacheLogs((prev) => [
      {
        id: prev.length + 1,
        cacheStatus: json.cacheStatus,
        serverElapsedMs: json.serverElapsedMs,
        clientRoundTripMs: rtt,
        generatedAt: json.entry.generatedAt,
      },
      ...prev.slice(0, 7),
    ]);
    setIsCallingCache(false);
  };

  const triggerRealRevalidateTag = async () => {
    setIsCallingCache(true);
    await fetch("/api/demo/cache", { method: "POST" });
    await readFromServerCache();
  };

  return (
    <div className="space-y-5">
      {/* ==================== SLIDE 1: RSC vs CLIENT BUNDLE THẬT ==================== */}
      {activeSlide === 0 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 2 • Slide 1 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Server Components (RSC) vs Client Components — Đo JS Bundle thật của 2 Route
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Cả 2 route <code>/rsc-demo</code> và <code>/client-demo</code> đều chạy cùng một
                  pipeline nặng: parse AST &amp; Syntax Highlighting code TypeScript/JSX bằng{" "}
                  <code>@babel/parser</code> + <code>@babel/types</code>, validate{" "}
                  <strong>600 bản ghi</strong> bằng <code>zod</code> và format ngày bằng{" "}
                  <code>date-fns</code>. Hãy bấm nạp từng route bên phải để đọc lượng JS thật từ{" "}
                  <code>iframe.contentWindow.performance</code>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SmartButton
                  variant="emerald"
                  size="sm"
                  onClick={() => startBundleProbe("/rsc-demo")}
                >
                  Đo Route RSC (/rsc-demo)
                </SmartButton>
                <SmartButton
                  variant="danger"
                  size="sm"
                  onClick={() => startBundleProbe("/client-demo")}
                >
                  Đo Route Client (/client-demo)
                </SmartButton>
                <Link
                  href="/rsc-demo"
                  className="inline-flex items-center border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-800"
                >
                  Mở /rsc-demo toàn trang &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900 p-4 space-y-3 text-xs">
              <div className="font-bold text-neutral-100">
                Kết quả đo JS tải xuống trình duyệt (Resource Timing API):
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">/rsc-demo (Server Component)</div>
                  <div className="mt-1 text-base font-bold text-emerald-400">
                    {bundleMetric?.rsc != null ? kb(bundleMetric.rsc) : "Chưa đo"}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {rscJsResources ? `${rscJsResources.length} file JS` : "Bấm nút Đo Route RSC"}
                  </div>
                </div>

                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">/client-demo (&quot;use client&quot;)</div>
                  <div className="mt-1 text-base font-bold text-red-400">
                    {bundleMetric?.client != null ? kb(bundleMetric.client) : "Chưa đo"}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {clientJsResources
                      ? `${clientJsResources.length} file JS (kèm @babel/parser + zod + date-fns)`
                      : "Bấm nút Đo Route Client"}
                  </div>
                </div>
              </div>

              {bundleMetric?.rsc != null && bundleMetric?.client != null && (
                <div className="border border-emerald-500 bg-emerald-950/40 p-2.5 font-mono text-xs text-emerald-200">
                  Chênh lệch thực tế: Client route nặng hơn{" "}
                  <strong>{kb(bundleMetric.client - bundleMetric.rsc)}</strong> (RSC{" "}
                  {pct(bundleMetric.client, bundleMetric.rsc)} JS ở phía trình duyệt).
                </div>
              )}

              <div className="space-y-1">
                <div className="font-bold text-neutral-100">
                  Danh sách file JS của route vừa đo ({activeProbeRoute ?? "chưa chọn"}):
                </div>
                <div className="max-h-40 overflow-y-auto border border-neutral-800 bg-neutral-950 p-2 font-mono text-[11px] space-y-1 text-neutral-300">
                  {(activeProbeRoute === "/rsc-demo" ? rscJsResources : clientJsResources)?.map(
                    (r) => (
                      <div key={r.name} className="flex justify-between gap-2">
                        <span className="truncate">{r.file}</span>
                        <span className="shrink-0 font-bold">{kb(r.decoded || r.encoded)}</span>
                      </div>
                    )
                  ) ?? <div className="text-neutral-500">Hãy bấm 1 trong 2 nút đo ở góc trên.</div>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-100">
                  Khung nạp Route thật ({activeProbeRoute ?? "chưa nạp"})
                </span>
                <span className="font-mono text-neutral-400">
                  iframe đọc performance.getEntriesByType(&quot;resource&quot;)
                </span>
              </div>
              {activeProbeRoute ? (
                <iframe
                  key={`${activeProbeRoute}-${probeKey}`}
                  ref={iframeRef}
                  src={activeProbeRoute}
                  onLoad={handleIframeLoad}
                  title="Bundle Probe Frame"
                  className="h-64 w-full border border-neutral-700 bg-neutral-950"
                />
              ) : (
                <div className="flex h-64 items-center justify-center border border-dashed border-neutral-700 bg-neutral-950 p-4 text-center text-xs text-neutral-400">
                  Bấm &ldquo;Đo Route RSC (/rsc-demo)&rdquo; rồi bấm &ldquo;Đo Route Client
                  (/client-demo)&rdquo; để nạp cả hai trang thật và so sánh dung lượng JS.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 2: REQUEST WATERFALL vs PROMISE.ALL THẬT ==================== */}
      {activeSlide === 1 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 2 • Slide 2 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Xử lý nghẽn mạng: Gọi 3 API tuần tự (Waterfall) vs Song song (Promise.all)
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Bấm nút để gửi 3 HTTP request thật tới <code>/api/demo/slow</code> (250ms, 350ms,
                  200ms). Có thể mở tab Network của DevTools để kiểm chứng các request này.
                </p>
              </div>
              <div className="flex gap-2">
                <SmartButton
                  variant="danger"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => runRealFetchTest("waterfall")}
                >
                  Chạy Tuần tự (await nối đuôi)
                </SmartButton>
                <SmartButton
                  variant="emerald"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => runRealFetchTest("parallel")}
                >
                  Chạy Song song (Promise.all)
                </SmartButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-neutral-100">
                  Timeline thực tế ({fetchMode === "waterfall" ? "Tuần tự" : "Promise.all"}):
                </span>
                <span className="font-mono text-neutral-300">
                  Tổng thời gian vừa đo:{" "}
                  <strong>{totalFetchMs !== null ? `${totalFetchMs} ms` : "—"}</strong> (Đã lưu:
                  Tuần tự {ms(fetchMetric?.seq)} / Song song {ms(fetchMetric?.par)})
                </span>
              </div>

              {fetchBars.length === 0 ? (
                <div className="border border-dashed border-neutral-700 bg-neutral-950 p-6 text-center text-xs text-neutral-400">
                  {isFetching
                    ? "Đang gửi request thật tới /api/demo/slow..."
                    : "Bấm 1 trong 2 nút phía trên để gửi 3 request HTTP thật và vẽ biểu đồ Waterfall."}
                </div>
              ) : (
                <div className="space-y-2.5 font-mono text-xs">
                  {fetchBars.map((bar) => {
                    const scaleMax = Math.max(totalFetchMs ?? 900, 900);
                    const leftPct = Math.min(95, (bar.startMs / scaleMax) * 100);
                    const widthPct = Math.max(4, ((bar.endMs - bar.startMs) / scaleMax) * 100);
                    return (
                      <div key={bar.name} className="border border-neutral-800 bg-neutral-950 p-2.5">
                        <div className="flex justify-between mb-1 text-neutral-200">
                          <span className="font-bold">{bar.label}</span>
                          <span>
                            {bar.startMs}ms &rarr; {bar.endMs}ms ({bar.endMs - bar.startMs}ms)
                          </span>
                        </div>
                        <div className="relative h-3 w-full bg-neutral-800">
                          <div
                            className={`absolute top-0 h-full ${
                              fetchMode === "waterfall" ? "bg-red-500" : "bg-emerald-500"
                            }`}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2.5">
              <div className="text-xs font-bold text-neutral-100">
                Đối chiếu Code trên Server Component
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-[11px] leading-relaxed text-neutral-200">
                {`// 1. Tuần tự (Waterfall): tổng thời gian = t1 + t2 + t3
const user   = await fetch("/api/demo/slow?name=user&delay=250");
const orders = await fetch("/api/demo/slow?name=orders&delay=350");
const recs   = await fetch("/api/demo/slow?name=recs&delay=200");`}
              </pre>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-[11px] leading-relaxed text-neutral-200">
                {`// 2. Song song (Promise.all): tổng thời gian = max(t1, t2, t3)
const [user, orders, recs] = await Promise.all([
  fetch("/api/demo/slow?name=user&delay=250"),
  fetch("/api/demo/slow?name=orders&delay=350"),
  fetch("/api/demo/slow?name=recs&delay=200"),
]);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 3: STREAMING HTTP & SUSPENSE THẬT ==================== */}
      {activeSlide === 2 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 2 • Slide 3 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Streaming HTTP &amp; React Suspense — Đọc ReadableStream thật từ /api/demo/stream
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  So sánh trực tiếp trên cùng một endpoint: chế độ <strong>Blocking</strong> đợi đủ
                  4 phần (~960ms) mới trả byte đầu tiên; chế độ <strong>Streaming</strong> đẩy
                  chunk #1 (HTML Shell) ngay ở ~25ms rồi stream tiếp các phần còn lại.
                </p>
              </div>
              <div className="flex gap-2">
                <SmartButton
                  variant="danger"
                  size="sm"
                  disabled={isStreaming}
                  onClick={() => runRealStream("blocking")}
                >
                  Chạy SSR Chặn (Blocking)
                </SmartButton>
                <SmartButton
                  variant="emerald"
                  size="sm"
                  disabled={isStreaming}
                  onClick={() => runRealStream("stream")}
                >
                  Chạy HTTP Streaming
                </SmartButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2 text-xs font-mono text-neutral-300">
                <span>
                  Chế độ: <strong>{streamMode === "stream" ? "HTTP Streaming" : "Blocking"}</strong>
                </span>
                <span>
                  Byte đầu tiên (First Chunk):{" "}
                  <strong>{firstChunkMs !== null ? `${firstChunkMs} ms` : "—"}</strong> | Hoàn tất:{" "}
                  <strong>{allChunksMs !== null ? `${allChunksMs} ms` : "—"}</strong>
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                {[1, 2, 3, 4].map((stepNum) => {
                  const found = streamItems.find((i) => i.step === stepNum);
                  return (
                    <div
                      key={stepNum}
                      className={`border p-3 ${
                        found
                          ? "border-emerald-500/80 bg-neutral-950"
                          : "border-dashed border-neutral-700 bg-neutral-950/60"
                      }`}
                    >
                      <div className="flex justify-between font-mono text-[11px] text-neutral-400">
                        <span className="font-bold text-neutral-200">Chunk #{stepNum}</span>
                        <span>
                          {found
                            ? `Nhận ở ${found.clientReceivedAtMs} ms`
                            : isStreaming
                            ? "Đang chờ stream..."
                            : "Chưa chạy"}
                        </span>
                      </div>
                      <div className="mt-1 font-semibold text-neutral-100">
                        {found ? found.title : `Suspense boundary #${stepNum}`}
                      </div>
                    </div>
                  );
                })}
              </div>

              {(streamMetric?.stream || streamMetric?.block) && (
                <div className="border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs text-neutral-300">
                  Đối chiếu đã đo — Streaming: chunk đầu ở{" "}
                  <strong className="text-emerald-400">{ms(streamMetric?.stream?.ttfb)}</strong>{" "}
                  (xong ở {ms(streamMetric?.stream?.done)}) | Blocking: chunk đầu ở{" "}
                  <strong className="text-red-400">{ms(streamMetric?.block?.ttfb)}</strong>.
                </div>
              )}
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="text-xs font-bold text-neutral-100">
                Cấu trúc &lt;Suspense&gt; trong Next.js App Router
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`export default function DashboardPage() {
  return (
    <main>
      {/* Gửi ngay trong chunk HTML đầu tiên */}
      <HeaderShell />

      {/* Mỗi khối chậm tự stream HTML khi xong */}
      <Suspense fallback={<WalletSkeleton />}>
        <WalletBalanceServer />
      </Suspense>

      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrdersServer />
      </Suspense>
    </main>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 4: CACHING & ISR (UNSTABLE_CACHE + REVALIDATETAG THẬT) ==================== */}
      {activeSlide === 3 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 2 • Slide 4 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Chiến lược Caching &amp; On-demand Revalidation (Gọi unstable_cache + revalidateTag thật)
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Route <code>/api/demo/cache</code> bọc truy vấn DB (280ms) bằng{" "}
                  <code>unstable_cache(..., &#123; tags: [&quot;demo-isr-product&quot;] &#125;)</code>.
                  Khi CACHE HIT, server trả về gần như tức thì (~0–2ms). Khi bấm{" "}
                  <code>revalidateTag</code>, lần đọc kế tiếp là CACHE MISS (~280ms) và sinh mốc{" "}
                  <code>generatedAt</code> mới.
                </p>
              </div>
              <div className="flex gap-2">
                <SmartButton
                  variant="outline"
                  size="sm"
                  disabled={isCallingCache}
                  onClick={readFromServerCache}
                >
                  GET /api/demo/cache (Đọc Cache)
                </SmartButton>
                <SmartButton
                  variant="emerald"
                  size="sm"
                  disabled={isCallingCache}
                  onClick={triggerRealRevalidateTag}
                >
                  POST revalidateTag(&quot;demo-isr-product&quot;)
                </SmartButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="text-xs font-bold text-neutral-100">
                Nhật ký phản hồi thật từ <code>/api/demo/cache</code>:
              </div>
              {cacheLogs.length === 0 ? (
                <div className="border border-dashed border-neutral-700 bg-neutral-950 p-6 text-center text-xs text-neutral-400">
                  Bấm &ldquo;GET /api/demo/cache&rdquo; 2–3 lần để thấy CACHE HIT (~1ms trên server)
                  và cùng một <code>generatedAt</code>; sau đó bấm &ldquo;POST revalidateTag&rdquo;
                  để xóa cache thật.
                </div>
              ) : (
                <table className="w-full border-collapse border border-neutral-800 text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
                      <th className="p-2">#</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2">Server time</th>
                      <th className="p-2">Client RTT</th>
                      <th className="p-2">Dấu thời gian bản ghi (generatedAt)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cacheLogs.map((log) => (
                      <tr key={log.id} className="border-b border-neutral-800">
                        <td className="p-2">{log.id}</td>
                        <td
                          className={`p-2 font-bold ${
                            log.cacheStatus === "HIT" ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {log.cacheStatus}
                        </td>
                        <td className="p-2 font-bold">{log.serverElapsedMs} ms</td>
                        <td className="p-2">{log.clientRoundTripMs} ms</td>
                        <td className="p-2 text-neutral-400">{log.generatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="text-xs font-bold text-neutral-100">
                Code thật tại <code>src/app/api/demo/cache/route.ts</code>:
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`const getCachedProduct = unstable_cache(
  async () => {
    await new Promise((r) => setTimeout(r, 280));
    return { generatedAt: new Date().toISOString() };
  },
  ["demo-isr-product-key"],
  { tags: ["demo-isr-product"], revalidate: 60 }
);

// Xóa cache tức thì theo sự kiện:
export async function POST() {
  revalidateTag("demo-isr-product");
  return NextResponse.json({ revalidated: true });
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 5: MINH HỌA THỰC TẾ CSR vs NEXT.JS RSC + STREAMING ==================== */}
      {activeSlide === 4 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 2 • Slide 5 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Minh họa thực tế: Đối chiếu luồng tải trang CSR vs Next.js (RSC + Parallel + Streaming)
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Tổng hợp các phép đo thật vừa thực hiện ở Slide 1, 2 và 3 trên máy này.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 text-xs">
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-red-400">
                  Mô hình Client-Side Rendering (CSR + Waterfall)
                </span>
                <span className="font-mono text-neutral-400">HTML ban đầu rỗng</span>
              </div>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between border border-neutral-800 bg-neutral-950 p-2">
                  <span className="text-neutral-300">1. Tải toàn bộ thư viện xuống Client (/client-demo):</span>
                  <strong className="text-red-400">
                    {bundleMetric?.client != null ? kb(bundleMetric.client) : "Đo ở Slide 1"}
                  </strong>
                </div>
                <div className="flex justify-between border border-neutral-800 bg-neutral-950 p-2">
                  <span className="text-neutral-300">2. Gọi 3 API tuần tự nối đuôi (Waterfall):</span>
                  <strong className="text-red-400">{ms(fetchMetric?.seq)}</strong>
                </div>
                <div className="flex justify-between border border-neutral-800 bg-neutral-950 p-2">
                  <span className="text-neutral-300">3. Đợi toàn bộ phản hồi xong (Blocking):</span>
                  <strong className="text-red-400">{ms(streamMetric?.block?.ttfb)}</strong>
                </div>
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-[11px] leading-relaxed text-neutral-200">
                {`// CSR: Trình duyệt phải tải xong JS mới chạy useEffect lấy dữ liệu
function PageCSR() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/demo/slow?name=user").then(r => r.json()).then(setData);
  }, []);
  if (!data) return <Spinner />;
  return <View data={data} />;
}`}
              </pre>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-emerald-400">
                  Mô hình Next.js (RSC + Promise.all + Streaming)
                </span>
                <span className="font-mono text-neutral-400">HTML có sẵn nội dung SEO</span>
              </div>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between border border-neutral-800 bg-neutral-950 p-2">
                  <span className="text-neutral-300">1. JS tải ở Client khi chạy RSC (/rsc-demo):</span>
                  <strong className="text-emerald-400">
                    {bundleMetric?.rsc != null ? kb(bundleMetric.rsc) : "Đo ở Slide 1"}
                  </strong>
                </div>
                <div className="flex justify-between border border-neutral-800 bg-neutral-950 p-2">
                  <span className="text-neutral-300">2. Gọi 3 API song song bằng Promise.all:</span>
                  <strong className="text-emerald-400">{ms(fetchMetric?.par)}</strong>
                </div>
                <div className="flex justify-between border border-neutral-800 bg-neutral-950 p-2">
                  <span className="text-neutral-300">3. Thời điểm nhận chunk HTML Shell đầu tiên:</span>
                  <strong className="text-emerald-400">{ms(streamMetric?.stream?.ttfb)}</strong>
                </div>
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-[11px] leading-relaxed text-neutral-200">
                {`// Next.js RSC: Lấy dữ liệu song song trên Server & Stream qua Suspense
export default async function PageRSC() {
  const [user, orders] = await Promise.all([getUser(), getOrders()]);
  return (
    <>
      <SummaryHeader user={user} orders={orders} />
      <Suspense fallback={<Skeleton />}>
        <SlowAnalyticsServer />
      </Suspense>
    </>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
