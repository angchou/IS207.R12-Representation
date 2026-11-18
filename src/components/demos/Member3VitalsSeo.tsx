"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SmartButton } from "@/components/ui/SmartButton";
import { startVitals, useVitals } from "@/lib/vitals";
import { getResources, kb, ms, pct, type Res } from "@/lib/resources";
import { patchMetric, useMetric } from "@/lib/metrics-store";

interface ImageCompareResult {
  rawBytes: number;
  rawContentType: string;
  rawTimeMs: number;
  optBytes: number;
  optContentType: string;
  optTimeMs: number;
}

interface HeadMetaTag {
  tag: string;
  attr: string;
  value: string;
}

export function Member3VitalsSeo({ activeSlide }: { activeSlide: number }) {
  const vitals = useVitals();

  useEffect(() => {
    startVitals();
  }, []);

  // ===== Slide 2: Đo Layout Shift thật bằng PerformanceObserver("layout-shift") =====
  const [clsTestMode, setClsTestMode] = useState<"bad-img" | "next-image">("next-image");
  const [showInjectedBanner, setShowInjectedBanner] = useState(false);
  const [measuredShiftDelta, setMeasuredShiftDelta] = useState<number>(0);
  const clsMetric = useMetric("m3.cls");

  const runRealLayoutShiftTest = (mode: "bad-img" | "next-image") => {
    setClsTestMode(mode);
    setShowInjectedBanner(false);
    setMeasuredShiftDelta(0);

    let accumulated = 0;
    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) {
            accumulated = Number((accumulated + entry.value).toFixed(4));
            setMeasuredShiftDelta(accumulated);
          }
        }
      });
      observer.observe({ type: "layout-shift", buffered: false });
    } catch {
      /* ignore */
    }

    setTimeout(() => {
      setShowInjectedBanner(true);
      setTimeout(() => {
        observer?.disconnect();
        if (mode === "bad-img") {
          patchMetric("m3.cls", { img: accumulated });
        } else {
          patchMetric("m3.cls", { next: accumulated });
        }
      }, 450);
    }, 620);
  };

  // ===== Slide 3: Đọc font self-hosted & thời điểm chạy next/script thật =====
  const [fontResources, setFontResources] = useState<Res[]>([]);
  const [analyticsTiming, setAnalyticsTiming] = useState<{
    executedAt?: number;
    loadEventEnd?: number | null;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      setFontResources(getResources().filter((r) => r.type === "font"));
      const w = window as unknown as {
        __DEMO_ANALYTICS__?: { executedAt?: number; loadEventEnd?: number | null };
      };
      if (w.__DEMO_ANALYTICS__) setAnalyticsTiming(w.__DEMO_ANALYTICS__);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [activeSlide]);

  // ===== Slide 4: Đọc trực tiếp các thẻ <meta> trong document.head đang có =====
  const [headTags, setHeadTags] = useState<HeadMetaTag[]>([]);
  const [liveTitle, setLiveTitle] = useState("");

  useEffect(() => {
    const readHead = () => {
      setLiveTitle(document.title);
      const metas = Array.from(document.head.querySelectorAll("meta"));
      const collected: HeadMetaTag[] = [];
      for (const m of metas) {
        const name = m.getAttribute("name") || m.getAttribute("property");
        const content = m.getAttribute("content");
        if (name && content) {
          collected.push({
            tag: "<meta>",
            attr: m.hasAttribute("property") ? `property="${name}"` : `name="${name}"`,
            value: content,
          });
        }
      }
      setHeadTags(collected);
    };
    readHead();
  }, [activeSlide]);

  // ===== Slide 5: Fetch thật ảnh gốc 4K vs endpoint tối ưu /_next/image =====
  const [imgCompare, setImgCompare] = useState<ImageCompareResult | null>(null);
  const [isProbingImg, setIsProbingImg] = useState(false);
  const imageMetric = useMetric("m3.image");

  const runRealImageComparison = async () => {
    setIsProbingImg(true);
    const rawUrl = "/lab/hero-4k.jpg";
    const optUrl = "/_next/image?url=%2Flab%2Fhero-4k.jpg&w=1200&q=75";

    const tRaw0 = performance.now();
    const rawRes = await fetch(rawUrl, { cache: "no-store" });
    const rawBlob = await rawRes.blob();
    const rawTimeMs = Math.round(performance.now() - tRaw0);

    const tOpt0 = performance.now();
    const optRes = await fetch(optUrl, {
      cache: "no-store",
      headers: { Accept: "image/avif,image/webp,*/*" },
    });
    const optBlob = await optRes.blob();
    const optTimeMs = Math.round(performance.now() - tOpt0);

    const result: ImageCompareResult = {
      rawBytes: rawBlob.size,
      rawContentType: rawRes.headers.get("content-type") || rawBlob.type || "image/jpeg",
      rawTimeMs,
      optBytes: optBlob.size,
      optContentType: optRes.headers.get("content-type") || optBlob.type || "image/avif",
      optTimeMs,
    };
    setImgCompare(result);
    patchMetric("m3.image", {
      original: result.rawBytes,
      optimized: result.optBytes,
      format: result.optContentType,
    });
    setIsProbingImg(false);
  };

  return (
    <div className="space-y-5">
      {/* ==================== SLIDE 1: CORE WEB VITALS ĐO THẬT TRÊN TRANG NÀY ==================== */}
      {activeSlide === 0 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 3 • Slide 1 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Thước đo Core Web Vitals (LCP, INP, CLS) — Đo trực tiếp phiên hiện tại bằng PerformanceObserver
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Các con số dưới đây là chỉ số thật của chính trang trình duyệt bạn đang mở, thu thập
              qua <code>PerformanceObserver</code> cho <code>largest-contentful-paint</code>,{" "}
              <code>event</code> và <code>layout-shift</code>.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-neutral-100">LCP (Largest Contentful Paint)</span>
                <span className="text-neutral-400">Chuẩn tốt &le; 2,500 ms</span>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-3 font-mono">
                <div className="text-2xl font-bold text-emerald-400">
                  {vitals.lcp != null ? ms(vitals.lcp) : "Đang thu thập..."}
                </div>
                <div className="mt-1 text-[11px] text-neutral-400 truncate">
                  Phần tử LCP: {vitals.lcpElement ?? "—"} | TTFB: {ms(vitals.ttfb)} | FCP:{" "}
                  {ms(vitals.fcp)}
                </div>
              </div>
              <p className="text-xs text-neutral-300">
                Đo thời điểm phần tử nội dung lớn nhất trong khung nhìn đầu tiên được vẽ xong.
              </p>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-neutral-100">INP (Interaction to Next Paint)</span>
                <span className="text-neutral-400">Chuẩn tốt &le; 200 ms</span>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-3 font-mono">
                <div className="text-2xl font-bold text-emerald-400">
                  {vitals.inp != null ? `${Math.round(vitals.inp)} ms` : "< 16 ms (Mượt)"}
                </div>
                <div className="mt-1 text-[11px] text-neutral-400">
                  Số tương tác &ge;16ms: {vitals.interactions}{" "}
                  {vitals.inpEvent ? `(${vitals.inpEvent})` : ""}
                </div>
              </div>
              <p className="text-xs text-neutral-300">
                Đo độ trễ từ lúc người dùng click/gõ phím tới khi khung hình kế tiếp được vẽ ra.
              </p>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-neutral-100">CLS (Cumulative Layout Shift)</span>
                <span className="text-neutral-400">Chuẩn tốt &le; 0.10</span>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-3 font-mono">
                <div className="text-2xl font-bold text-emerald-400">{vitals.cls.toFixed(4)}</div>
                <div className="mt-1 text-[11px] text-neutral-400">
                  Cửa sổ phiên (Session Window) theo chuẩn Google
                </div>
              </div>
              <p className="text-xs text-neutral-300">
                Đo tổng mức độ nhảy bố cục ngoài ý muốn khi trang đang tải ảnh, font hoặc chèn khối
                động.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 2: NEXT/IMAGE & ĐO LAYOUT SHIFT THẬT ==================== */}
      {activeSlide === 1 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 3 • Slide 2 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Tối ưu hình ảnh với next/image &amp; Đo Layout Shift (CLS) thật bằng PerformanceObserver
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Sau khi bấm nút 620ms (ngoài cửa sổ <code>hadRecentInput</code> 500ms), ảnh mới
                  hoàn tất nạp vào khung bên dưới.{" "}
                  <code>PerformanceObserver(&quot;layout-shift&quot;)</code> sẽ đo điểm CLS thật phát
                  sinh trên trình duyệt.
                </p>
              </div>
              <div className="flex gap-2">
                <SmartButton
                  variant={clsTestMode === "bad-img" ? "danger" : "outline"}
                  size="sm"
                  onClick={() => runRealLayoutShiftTest("bad-img")}
                >
                  Thử &lt;img&gt; không giữ khung (Đo CLS)
                </SmartButton>
                <SmartButton
                  variant={clsTestMode === "next-image" ? "emerald" : "outline"}
                  size="sm"
                  onClick={() => runRealLayoutShiftTest("next-image")}
                >
                  Thử next/image giữ khung tỷ lệ (Đo CLS)
                </SmartButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-300">
                <span>
                  Chế độ đang đo:{" "}
                  <strong>
                    {clsTestMode === "bad-img"
                      ? "<img> không khai báo khung"
                      : "next/image có khung cố định"}
                  </strong>
                </span>
                <span>
                  Layout shift vừa đo:{" "}
                  <strong className={measuredShiftDelta > 0 ? "text-red-400" : "text-emerald-400"}>
                    {measuredShiftDelta.toFixed(4)}
                  </strong>{" "}
                  (Đã lưu: &lt;img&gt; {clsMetric?.img?.toFixed(4) ?? "—"} | next/image{" "}
                  {clsMetric?.next?.toFixed(4) ?? "—"})
                </span>
              </div>

              <div className="border border-neutral-800 bg-neutral-950 p-3 space-y-3">
                {clsTestMode === "bad-img" ? (
                  showInjectedBanner ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/lab/hero-1200.jpg"
                      alt="Unreserved img"
                      className="w-full h-44 object-cover border border-red-500"
                    />
                  ) : (
                    <div className="text-xs font-mono text-red-400">
                      [Đang tải ảnh... Không giữ chỗ trước nên chiều cao hiện tại = 0px]
                    </div>
                  )
                ) : (
                  <div className="relative h-44 w-full border border-emerald-500 bg-neutral-900">
                    {showInjectedBanner ? (
                      <Image
                        src="/lab/hero-1200.jpg"
                        alt="Reserved next/image"
                        fill
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-xs text-neutral-300">
                        [next/image giữ sẵn khung h-44 (176px) ngay từ đầu — văn bản bên dưới không bị đẩy]
                      </div>
                    )}
                  </div>
                )}

                <div className="border border-neutral-700 bg-neutral-900 p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-neutral-100">
                      Khối nội dung &amp; Nút thao tác nằm ngay dưới ảnh
                    </div>
                    <div className="text-neutral-400">
                      Nếu khối này bị đẩy tụt xuống khi ảnh xuất hiện, trình duyệt sẽ ghi nhận điểm
                      layout-shift &gt; 0.
                    </div>
                  </div>
                  <span className="border border-neutral-300 bg-neutral-100 px-3 py-1.5 font-bold text-neutral-950 shrink-0">
                    Xác nhận đơn hàng
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2.5 text-xs">
              <div className="font-bold text-neutral-100">
                Cơ chế hoạt động của <code>next/image</code>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-300">
                <strong className="text-neutral-100">1. Khóa tỷ lệ khung hình (Aspect Ratio):</strong>{" "}
                Bắt buộc khai báo <code>width/height</code> hoặc <code>fill</code> để trình duyệt
                dành sẵn đúng diện tích trước khi ảnh tải xong.
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-300">
                <strong className="text-neutral-100">
                  2. Chuyển đổi sang AVIF/WebP bằng Sharp trên Server:
                </strong>{" "}
                Giảm 80–95% dung lượng byte truyền qua mạng (kiểm chứng trực tiếp ở Slide 5).
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-300">
                <strong className="text-neutral-100">3. Sinh srcset theo kích thước màn hình:</strong>{" "}
                Trình duyệt chỉ tải kích thước phù hợp với viewport thay vì tải ảnh 4K gốc.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 3: NEXT/FONT & NEXT/SCRIPT THẬT ==================== */}
      {activeSlide === 2 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 3 • Slide 3 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Tối ưu Font (next/font) &amp; Script bên thứ ba (next/script) đang chạy trong layout.tsx
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Kiểm tra trực tiếp các file font self-hosted và thời điểm thực thi của{" "}
              <code>/analytics-mock.js</code> (nạp với <code>strategy=&quot;lazyOnload&quot;</code>).
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 text-xs">
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-neutral-100">
                  1. File Font do next/font/local đóng gói trên trang này
                </span>
                <span className="font-mono text-emerald-400">0 request tới fonts.googleapis.com</span>
              </div>

              <div className="border border-neutral-800 bg-neutral-950 p-2.5 font-mono space-y-1 text-neutral-300">
                {fontResources.length === 0 ? (
                  <div className="text-neutral-400">
                    Font đã được cache hoặc khai báo qua biến CSS{" "}
                    <code>--font-inter / --font-jetbrains</code> trong <code>&lt;html&gt;</code>.
                  </div>
                ) : (
                  fontResources.map((f) => (
                    <div key={f.name} className="flex justify-between gap-2">
                      <span className="truncate">{f.file}</span>
                      <span className="shrink-0 font-bold">
                        {kb(f.decoded || f.encoded)} ({Math.round(f.duration)} ms)
                      </span>
                    </div>
                  ))
                )}
              </div>

              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`// src/app/layout.tsx
import localFont from "next/font/local";

const sansFont = localFont({
  src: "./fonts/AdwaitaSans-Regular.ttf",
  display: "swap",
  variable: "--font-inter",
});`}
              </pre>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-neutral-100">
                  2. Thời điểm thực thi next/script (strategy=&quot;lazyOnload&quot;)
                </span>
                <span className="font-mono text-neutral-400">/analytics-mock.js</span>
              </div>

              <div className="border border-neutral-800 bg-neutral-950 p-3 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Trạng thái window.__DEMO_ANALYTICS__:</span>
                  <strong className="text-emerald-400">
                    {analyticsTiming ? "Đã nạp sau khi trang rảnh" : "Đang chờ idle..."}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Thời điểm script chạy (executedAt):</span>
                  <strong>{ms(analyticsTiming?.executedAt)}</strong>
                </div>
              </div>

              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`// src/app/layout.tsx
import Script from "next/script";

<Script
  id="demo-third-party-analytics"
  src="/analytics-mock.js"
  strategy="lazyOnload"
/>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 4: METADATA API & ĐỌC TRỰC TIẾP DOCUMENT.HEAD ==================== */}
      {activeSlide === 3 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 3 • Slide 4 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Metadata API &amp; Dynamic SEO — Đọc trực tiếp các thẻ &lt;meta&gt; thật trong document.head
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Bảng bên trái đọc từ <code>document.head.querySelectorAll(&quot;meta&quot;)</code> của
              chính trang hiện tại, được sinh từ đối tượng <code>export const metadata</code> trong{" "}
              <code>src/app/layout.tsx</code>.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12 text-xs">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="font-bold text-neutral-100">
                Các thẻ &lt;title&gt; và &lt;meta&gt; đang tồn tại trong DOM của trang này:
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2 font-mono text-emerald-300">
                &lt;title&gt;{liveTitle}&lt;/title&gt;
              </div>
              <div className="max-h-60 overflow-y-auto border border-neutral-800">
                <table className="w-full border-collapse text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
                      <th className="p-2">Thuộc tính</th>
                      <th className="p-2">Giá trị content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headTags.map((t, i) => (
                      <tr key={i} className="border-b border-neutral-800">
                        <td className="p-2 font-bold text-neutral-200 whitespace-nowrap">
                          {t.attr}
                        </td>
                        <td className="p-2 text-neutral-300 break-all">{t.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="font-bold text-neutral-100">
                Khai báo tại <code>src/app/layout.tsx</code>:
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`export const metadata: Metadata = {
  title: {
    default: "Tối ưu hiệu năng Frontend: React • Next.js • Tailwind CSS",
    template: "%s | Demo tối ưu Frontend",
  },
  description: "Slide thuyết trình kèm demo đo đạc thực tế...",
  openGraph: {
    title: "Tối ưu hiệu năng Frontend...",
    type: "website",
    locale: "vi_VN",
    images: [{ url: "/lab/hero-1200.jpg", width: 1200, height: 675 }],
  },
};`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 5: SO SÁNH FILE ẢNH GỐC 4K vs /_NEXT/IMAGE THẬT ==================== */}
      {activeSlide === 4 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 3 • Slide 5 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Minh họa thực tế: Đo trực tiếp dung lượng file JPEG 4K gốc vs Endpoint /_next/image
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Bấm nút bên phải để trình duyệt gọi <code>fetch()</code> tải cả file gốc{" "}
                  <code>/lab/hero-4k.jpg</code> (3840x2160) và đường dẫn tối ưu{" "}
                  <code>/_next/image?url=%2Flab%2Fhero-4k.jpg&amp;w=1200&amp;q=75</code> rồi đọc{" "}
                  <code>blob.size</code> và header <code>Content-Type</code> thật.
                </p>
              </div>
              <SmartButton
                variant="emerald"
                size="sm"
                disabled={isProbingImg}
                onClick={runRealImageComparison}
              >
                {isProbingImg ? "Đang tải & nén ảnh qua Sharp..." : "Chạy phép đo <img> vs next/image thật"}
              </SmartButton>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 text-xs">
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="font-bold text-red-400">1. Thẻ &lt;img&gt; tải trực tiếp ảnh 4K gốc</div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-neutral-200">
                {`<img src="/lab/hero-4k.jpg" alt="Hero 4K" />`}
              </pre>
            </div>
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="font-bold text-emerald-400">
                2. Component &lt;Image /&gt; nén tự động qua /_next/image
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-neutral-200">
                {`<Image src="/lab/hero-4k.jpg" alt="Hero" width={1200} height={675} quality={75} />`}
              </pre>
            </div>
          </div>

          <div className="border border-neutral-700 bg-neutral-900 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2 text-xs">
              <span className="font-bold text-neutral-100">
                Bảng kết quả HTTP Response thật (Đọc từ fetch Blob &amp; Response Headers)
              </span>
              {imageMetric?.original && imageMetric?.optimized && (
                <span className="font-mono text-emerald-400 font-bold">
                  Kết quả: {kb(imageMetric.original)} &rarr; {kb(imageMetric.optimized)} (
                  {pct(imageMetric.original, imageMetric.optimized)})
                </span>
              )}
            </div>

            {!imgCompare ? (
              <div className="border border-dashed border-neutral-700 bg-neutral-950 p-6 text-center text-xs text-neutral-400">
                Bấm nút &ldquo;Chạy phép đo &lt;img&gt; vs next/image thật&rdquo; ở trên để thực hiện
                2 HTTP request thật và đo kích thước byte trả về.
              </div>
            ) : (
              <table className="w-full border-collapse border border-neutral-800 text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
                    <th className="p-2.5">URL Request thực tế</th>
                    <th className="p-2.5">Content-Type</th>
                    <th className="p-2.5">Kích thước thật (Bytes)</th>
                    <th className="p-2.5">Thời gian tải</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-800 bg-red-950/30">
                    <td className="p-2.5 font-bold text-red-300">/lab/hero-4k.jpg (Gốc 3840x2160)</td>
                    <td className="p-2.5">{imgCompare.rawContentType}</td>
                    <td className="p-2.5 font-bold text-red-400">
                      {kb(imgCompare.rawBytes)} ({imgCompare.rawBytes.toLocaleString("vi-VN")} B)
                    </td>
                    <td className="p-2.5">{imgCompare.rawTimeMs} ms</td>
                  </tr>
                  <tr className="border-b border-neutral-800 bg-emerald-950/30">
                    <td className="p-2.5 font-bold text-emerald-300">
                      /_next/image?url=%2Flab%2Fhero-4k.jpg&amp;w=1200&amp;q=75
                    </td>
                    <td className="p-2.5 font-bold text-emerald-400">
                      {imgCompare.optContentType}
                    </td>
                    <td className="p-2.5 font-bold text-emerald-400">
                      {kb(imgCompare.optBytes)} ({imgCompare.optBytes.toLocaleString("vi-VN")} B —{" "}
                      {pct(imgCompare.rawBytes, imgCompare.optBytes)})
                    </td>
                    <td className="p-2.5">{imgCompare.optTimeMs} ms</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
