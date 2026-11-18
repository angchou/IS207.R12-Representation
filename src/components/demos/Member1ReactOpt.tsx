"use client";

import React, {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SmartButton } from "@/components/ui/SmartButton";
import { PRODUCTS, type Product } from "@/lib/products";
import { getResources, kb, ms, sum, type Res } from "@/lib/resources";
import { setMetric, updateMetric, useMetric } from "@/lib/metrics-store";

/**
 * [Slide 4 - React.lazy thật, không chèn setTimeout giả lập]
 */
const LazyHeavyChartModal = lazy(() => import("./HeavyChartModal"));

/**
 * Bảng sản phẩm render THẬT N dòng DOM (6 cột/dòng).
 * Không dùng vòng lặp for rỗng đốt CPU giả tạo.
 */
function RealDomProductTable({
  rows,
  mode,
}: {
  rows: Product[];
  mode: "bad" | "good";
}) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div className="border border-neutral-800 bg-neutral-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-950 px-3 py-2 text-xs">
        <span className="font-bold text-neutral-100">
          &lt;RealDomProductTable /&gt; — Render thật {rows.length.toLocaleString("vi-VN")} dòng (
          {(rows.length * 7).toLocaleString("vi-VN")} DOM nodes)
        </span>
        <span
          className={`border px-2 py-0.5 font-mono font-bold ${
            mode === "bad" && renderCountRef.current > 1
              ? "border-red-500 bg-red-950/60 text-red-200"
              : "border-emerald-500 bg-emerald-950/60 text-emerald-200"
          }`}
        >
          Số lần bảng render: {renderCountRef.current}
        </span>
      </div>

      <div className="max-h-56 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-neutral-950 border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="p-1.5 font-mono">Mã</th>
              <th className="p-1.5">Tên sản phẩm</th>
              <th className="p-1.5">Danh mục</th>
              <th className="p-1.5 font-mono">Giá</th>
              <th className="p-1.5 font-mono">Điểm</th>
              <th className="p-1.5 font-mono">Tồn</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b border-neutral-800/80">
                <td className="p-1.5 font-mono text-neutral-400">{item.sku}</td>
                <td className="p-1.5 font-medium text-neutral-100">{item.name}</td>
                <td className="p-1.5 text-neutral-400">{item.category}</td>
                <td className="p-1.5 font-mono text-neutral-200">
                  {item.price.toLocaleString("vi-VN")} ₫
                </td>
                <td className="p-1.5 font-mono text-neutral-300">{item.score}</td>
                <td className="p-1.5 font-mono text-neutral-400">{item.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 *Chế độ CHƯA TỐI ƯU: State searchText đặt ở Component Cha bao lấy cả bảng lớn.
 * Đo thời gian render + commit DOM thật từ lúc bắt đầu hàm render tới khi useLayoutEffect chạy xong,
 * sử dụng ref callback để KHÔNG gọi setState bên trong quá trình commit (tránh vòng lặp render vô hạn).
 */
function UnoptimizedParentSection({
  rows,
  onCommitMeasured,
}: {
  rows: Product[];
  onCommitMeasured: (durationMs: number) => void;
}) {
  const [searchText, setSearchText] = useState("");
  const pendingKeystrokeStartRef = useRef<number | null>(null);
  const onCommitRef = useRef(onCommitMeasured);
  onCommitRef.current = onCommitMeasured;

  // Thời điểm bắt đầu chạy thân hàm render của Component Cha
  const renderStartNow = typeof performance !== "undefined" ? performance.now() : 0;

  useLayoutEffect(() => {
    if (pendingKeystrokeStartRef.current !== null) {
      const start = Math.min(pendingKeystrokeStartRef.current, renderStartNow);
      const elapsed = Number((performance.now() - start).toFixed(2));
      pendingKeystrokeStartRef.current = null;
      onCommitRef.current(elapsed);
    }
  }, [searchText, renderStartNow]);

  return (
    <div className="space-y-3">
      <div className="border border-red-500/80 bg-red-950/30 p-3 space-y-2">
        <div className="flex flex-wrap justify-between gap-2 text-xs">
          <span className="font-bold text-red-200">
            State <code>searchText</code> đặt ở Component Cha — mỗi phím gõ re-render cả bảng{" "}
            {rows.length.toLocaleString("vi-VN")} dòng
          </span>
          <span className="font-mono text-red-300">Độ dài chuỗi: {searchText.length}</span>
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            pendingKeystrokeStartRef.current = performance.now();
            setSearchText(e.target.value);
          }}
          placeholder="Gõ vào đây để đo thời gian React dựng lại toàn bộ bảng bên dưới..."
          className="w-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none"
        />
      </div>
      <RealDomProductTable rows={rows} mode="bad" />
    </div>
  );
}

/**
 * Ô nhập được cô lập state (State Colocation):
 * Khi gõ phím, chỉ component nhỏ này re-render; component cha và bảng lớn đứng yên hoàn toàn.
 */
function IsolatedSearchInput({
  onCommitMeasured,
}: {
  onCommitMeasured: (durationMs: number) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const pendingKeystrokeStartRef = useRef<number | null>(null);
  const onCommitRef = useRef(onCommitMeasured);
  onCommitRef.current = onCommitMeasured;

  const renderStartNow = typeof performance !== "undefined" ? performance.now() : 0;

  useLayoutEffect(() => {
    if (pendingKeystrokeStartRef.current !== null) {
      const start = Math.min(pendingKeystrokeStartRef.current, renderStartNow);
      const elapsed = Number((performance.now() - start).toFixed(2));
      pendingKeystrokeStartRef.current = null;
      onCommitRef.current(elapsed);
    }
  }, [keyword, renderStartNow]);

  return (
    <div className="border border-emerald-500/80 bg-emerald-950/30 p-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-emerald-200">
          &lt;IsolatedSearchInput /&gt; (Giữ state cục bộ — State Colocation)
        </span>
        <span className="border border-emerald-500/80 bg-neutral-950 px-2 py-0.5 font-mono text-emerald-300">
          Input render: {renderCountRef.current} lần
        </span>
      </div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => {
          pendingKeystrokeStartRef.current = performance.now();
          setKeyword(e.target.value);
        }}
        placeholder="Gõ vào đây: chỉ riêng ô input này render, bảng bên dưới đứng yên ở lần render 1..."
        className="w-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none"
      />
    </div>
  );
}

/**
 * Component con bọc React.memo dùng cho Slide 3
 */
const MemoizedChildToolbar = memo(function MemoizedChildToolbar({
  onSelectCategory,
  isMemoEnabled,
}: {
  onSelectCategory: (cat: string) => void;
  isMemoEnabled: boolean;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="border border-neutral-800 bg-neutral-950 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-neutral-100">
          &lt;ChildCategoryToolbar /&gt; ({isMemoEnabled ? "React.memo + useCallback" : "Không dùng useCallback"})
        </span>
        <span
          className={`border px-2 py-0.5 font-mono font-bold ${
            isMemoEnabled
              ? "border-emerald-500 bg-emerald-950/60 text-emerald-200"
              : "border-red-500 bg-red-950/60 text-red-200"
          }`}
        >
          Số lần Child Render: {renderCount.current}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["Tất cả", "Laptop", "Điện thoại", "Màn hình"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className="border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
});

export function Member1ReactOpt({ activeSlide }: { activeSlide: number }) {
  // ===== Slide 1: Số liệu tài nguyên thật của trang từ Performance API =====
  const [pageResources, setPageResources] = useState<Res[]>([]);
  useEffect(() => {
    const refresh = () => setPageResources(getResources());
    refresh();
    const id = setInterval(refresh, 1500);
    return () => clearInterval(id);
  }, [activeSlide]);

  const jsList = pageResources.filter((r) => r.type === "js");
  const cssList = pageResources.filter((r) => r.type === "css");
  const fontList = pageResources.filter((r) => r.type === "font");

  // ===== Slide 2 & 5: State Colocation + Đo thời gian commit thật =====
  const [colocationMode, setColocationMode] = useState<"bad" | "good">("bad");
  const [rowCount, setRowCount] = useState<number>(1500);
  const [lastCommitMs, setLastCommitMs] = useState<number | null>(null);
  const renderHistory = useMetric("m1.render") ?? [];

  const slicedProducts = useMemo(() => PRODUCTS.slice(0, rowCount), [rowCount]);

  const recordSample = useCallback((mode: "bad" | "good", durationMs: number, rows: number) => {
    setLastCommitMs(durationMs);
    updateMetric("m1.render", (prev) => {
      const next = [...(prev ?? []), { mode, ms: durationMs, rows }];
      return next.slice(-24);
    });
  }, []);

  // ===== Slide 3: Memoization đo thật trên 5,000 sản phẩm =====
  const [memoEnabled, setMemoEnabled] = useState(true);
  const [compilerView, setCompilerView] = useState<"manual" | "compiler">("manual");
  const [unrelatedCounter, setUnrelatedCounter] = useState(1);
  const [minScore, setMinScore] = useState(80);
  const [mounted, setMounted] = useState(false);
  const filterCalcCountRef = useRef(0);
  const lastFilterDurationRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runHeavyFilterAndSort = useCallback((threshold: number) => {
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    const out = PRODUCTS.filter((p) => p.score >= threshold).sort((a, b) => b.price - a.price);
    const t1 = typeof performance !== "undefined" ? performance.now() : 0;
    lastFilterDurationRef.current = Number((t1 - t0).toFixed(2));
    filterCalcCountRef.current += 1;
    return out;
  }, []);

  const memoizedFiltered = useMemo(
    () => runHeavyFilterAndSort(minScore),
    [minScore, runHeavyFilterAndSort]
  );

  const displayedProducts = memoEnabled
    ? memoizedFiltered
    : runHeavyFilterAndSort(minScore);

  const stableCallback = useCallback((_cat: string) => {}, []);
  const unstableCallback = (_cat: string) => {};

  // ===== Slide 4: React.lazy + đo chunk mạng thật qua PerformanceResourceTiming =====
  const [showLazyChart, setShowLazyChart] = useState(false);
  const [lazyChunks, setLazyChunks] = useState<Res[]>([]);
  const [lazyLoadElapsedMs, setLazyLoadElapsedMs] = useState<number | null>(null);
  const beforeResourcesRef = useRef<Set<string>>(new Set());
  const lazyClickTimeRef = useRef<number>(0);

  const handleOpenLazyChart = () => {
    beforeResourcesRef.current = new Set(getResources().map((r) => r.name));
    lazyClickTimeRef.current = performance.now();
    setShowLazyChart(true);
  };

  useEffect(() => {
    if (!showLazyChart) return;
    const timer = setInterval(() => {
      const nowList = getResources();
      const added = nowList.filter(
        (r) => !beforeResourcesRef.current.has(r.name) && r.type === "js"
      );
      const heavyAll = nowList.filter(
        (r) =>
          r.type === "js" &&
          (r.file.toLowerCase().includes("heavychart") ||
            r.file.toLowerCase().includes("babel") ||
            r.file.toLowerCase().includes("date-fns") ||
            r.file.toLowerCase().includes("zod") ||
            !beforeResourcesRef.current.has(r.name))
      );
      const list = added.length > 0 ? added : heavyAll;
      if (list.length > 0) {
        const bytes = sum(list, "decoded") || sum(list, "encoded");
        const elapsed =
          lazyLoadElapsedMs ?? Number((performance.now() - lazyClickTimeRef.current).toFixed(1));
        setLazyChunks(list);
        if (lazyLoadElapsedMs === null) setLazyLoadElapsedMs(elapsed);
        setMetric("m1.lazy", {
          files: list.length,
          bytes,
          ms: elapsed,
          cached: added.length === 0,
        });
      }
    }, 200);
    return () => clearInterval(timer);
  }, [showLazyChart, lazyLoadElapsedMs]);

  const badSamples = renderHistory.filter((s) => s.mode === "bad");
  const goodSamples = renderHistory.filter((s) => s.mode === "good");
  const avgBad =
    badSamples.length > 0
      ? Number((badSamples.reduce((a, b) => a + b.ms, 0) / badSamples.length).toFixed(2))
      : null;
  const avgGood =
    goodSamples.length > 0
      ? Number((goodSamples.reduce((a, b) => a + b.ms, 0) / goodSamples.length).toFixed(2))
      : null;

  return (
    <div className="space-y-5">
      {/* ==================== SLIDE 1: ĐẶT VẤN ĐỀ & SỐ ĐO TÀI NGUYÊN THẬT ==================== */}
      {activeSlide === 0 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 1 • Slide 1 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Đặt vấn đề: 3 điểm nghẽn lớn của Frontend &amp; Số đo tài nguyên thật của trang này
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Bảng dưới đây đọc trực tiếp từ <code>performance.getEntriesByType(&quot;resource&quot;)</code>{" "}
              của trình duyệt ngay lúc này — không dùng con số giả định.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Điểm nghẽn #1</span>
                <span>Network &amp; Parse</span>
              </div>
              <h3 className="text-sm font-bold text-neutral-100">1. Tải &amp; biên dịch JavaScript</h3>
              <p className="text-xs text-neutral-300">
                Đóng gói mọi thứ vào một bundle duy nhất khiến trình duyệt phải tải, giải nén và thực
                thi lượng lớn JS trước khi trang có thể tương tác.
              </p>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Số file JS đã tải:</span>
                  <strong>{jsList.length} files</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tổng JS (decoded):</span>
                  <strong>{kb(sum(jsList, "decoded"))}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tổng JS (transfer):</span>
                  <strong>{kb(sum(jsList, "transfer"))}</strong>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Điểm nghẽn #2</span>
                <span>CPU Main Thread</span>
              </div>
              <h3 className="text-sm font-bold text-neutral-100">2. Re-render dây chuyền dư thừa</h3>
              <p className="text-xs text-neutral-300">
                Khi state đặt ở component cha quá cao, mỗi lần gõ phím sẽ kéo theo toàn bộ cây
                component con bên dưới phải dựng và đối chiếu lại hàng ngàn DOM node.
              </p>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">TB chưa tách state (Slide 2):</span>
                  <strong className="text-red-400">
                    {avgBad !== null ? `${avgBad} ms` : "Đo ở Slide 2"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">TB đã tách state (Slide 2):</span>
                  <strong className="text-emerald-400">
                    {avgGood !== null ? `${avgGood} ms` : "Đo ở Slide 2"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Số mẫu đã ghi:</span>
                  <strong>{renderHistory.length} lần commit</strong>
                </div>
              </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Điểm nghẽn #3</span>
                <span>CSS &amp; Font</span>
              </div>
              <h3 className="text-sm font-bold text-neutral-100">3. Dung lượng CSS &amp; Tài nguyên tĩnh</h3>
              <p className="text-xs text-neutral-300">
                CSS truyền thống phình to theo số màn hình hoặc tốn JS runtime (CSS-in-JS). Với
                Tailwind JIT và <code>next/font</code>, trình duyệt chỉ tải file tĩnh đã lọc.
              </p>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">File CSS đang tải:</span>
                  <strong>
                    {cssList.length} file ({kb(sum(cssList, "decoded"))})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Font self-host:</span>
                  <strong>
                    {fontList.length} file ({kb(sum(fontList, "decoded"))})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">JS Runtime cho CSS:</span>
                  <strong className="text-emerald-400">0 kB</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-neutral-800 bg-neutral-900 p-3 text-xs">
            <div className="font-bold text-neutral-100 mb-2">
              Phân bố nội dung 4 thành viên (20 slide đều gắn với phép đo thực tế):
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                <div className="font-bold text-neutral-100">1. React Rendering</div>
                <div className="text-neutral-400 mt-0.5">
                  State Colocation, memo/useMemo/useCallback, React.lazy, đo thời gian commit thật.
                </div>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                <div className="font-bold text-neutral-100">2. Next.js Architecture</div>
                <div className="text-neutral-400 mt-0.5">
                  RSC vs Client Bundle, Waterfall vs Promise.all, HTTP Streaming, ISR Cache.
                </div>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                <div className="font-bold text-neutral-100">3. Web Vitals &amp; SEO</div>
                <div className="text-neutral-400 mt-0.5">
                  PerformanceObserver (LCP/INP/CLS), next/image AVIF, next/font, Metadata.
                </div>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                <div className="font-bold text-neutral-100">4. Tailwind &amp; Tổng kết</div>
                <div className="text-neutral-400 mt-0.5">
                  Đo file CSS thật trong .next, CVA + tailwind-merge, bảng tổng hợp dữ liệu phiên.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 2: KIỂM SOÁT RE-RENDER & STATE COLOCATION ==================== */}
      {activeSlide === 1 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 1 • Slide 2 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Kiểm soát Re-render &amp; State Colocation (Đo thời gian render + commit DOM thật)
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Không dùng vòng lặp <code>for</code> giả tạo. Bảng bên dưới render thật{" "}
                  <strong>{rowCount.toLocaleString("vi-VN")} dòng sản phẩm</strong>. Hãy gõ phím ở cả
                  2 chế độ để ghi lại thời gian commit thật.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SmartButton
                  variant={colocationMode === "bad" ? "danger" : "outline"}
                  size="sm"
                  onClick={() => setColocationMode("bad")}
                >
                  Chưa tối ưu: State đặt ở Cha
                </SmartButton>
                <SmartButton
                  variant={colocationMode === "good" ? "emerald" : "outline"}
                  size="sm"
                  onClick={() => setColocationMode("good")}
                >
                  Đã tối ưu: State Colocation
                </SmartButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-200">Số dòng DOM thật:</span>
                  {[500, 1500, 3000].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRowCount(n)}
                      className={`border px-2 py-0.5 font-mono ${
                        rowCount === n
                          ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-bold"
                          : "border-neutral-700 bg-neutral-950 text-neutral-300"
                      }`}
                    >
                      {n} dòng
                    </button>
                  ))}
                </div>
                <span className="font-mono text-neutral-300">
                  Commit gần nhất:{" "}
                  <strong>{lastCommitMs !== null ? `${lastCommitMs} ms` : "Hãy gõ vào ô tìm kiếm"}</strong>
                </span>
              </div>

              {colocationMode === "bad" ? (
                <UnoptimizedParentSection
                  key={`bad-${rowCount}`}
                  rows={slicedProducts}
                  onCommitMeasured={(msVal) => recordSample("bad", msVal, rowCount)}
                />
              ) : (
                <div key={`good-${rowCount}`} className="space-y-3">
                  <IsolatedSearchInput
                    onCommitMeasured={(msVal) => recordSample("good", msVal, rowCount)}
                  />
                  <RealDomProductTable rows={slicedProducts} mode="good" />
                </div>
              )}
            </div>

            <div className="lg:col-span-4 border border-neutral-800 bg-neutral-900 p-4 space-y-3 text-xs">
              <div className="font-bold text-neutral-100">
                Số liệu Render + Commit DOM ghi nhận trực tiếp
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="text-neutral-400">TB Chưa tách state</div>
                  <div className="mt-1 text-base font-bold text-red-400">
                    {avgBad !== null ? `${avgBad} ms` : "—"}
                  </div>
                  <div className="text-[11px] text-neutral-500">{badSamples.length} mẫu</div>
                </div>
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="text-neutral-400">TB State Colocation</div>
                  <div className="mt-1 text-base font-bold text-emerald-400">
                    {avgGood !== null ? `${avgGood} ms` : "—"}
                  </div>
                  <div className="text-[11px] text-neutral-500">{goodSamples.length} mẫu</div>
                </div>
              </div>

              <div className="border border-neutral-800 bg-neutral-950 p-3 font-mono space-y-1">
                <div className="font-sans font-bold text-neutral-100 mb-1">
                  Phạm vi cây Component render khi gõ phím:
                </div>
                {colocationMode === "bad" ? (
                  <>
                    <div className="text-red-400 font-bold">[RENDER] &lt;ParentSection&gt; (state)</div>
                    <div className="pl-3 text-red-400">├─ [RENDER] &lt;input /&gt;</div>
                    <div className="pl-3 text-red-300 font-bold">
                      └─ [RENDER] &lt;RealDomProductTable rows={rowCount} /&gt;
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-neutral-500">[ĐỨNG YÊN] &lt;ParentSection&gt;</div>
                    <div className="pl-3 text-emerald-400 font-bold">
                      ├─ [RENDER] &lt;IsolatedSearchInput /&gt; (state cục bộ)
                    </div>
                    <div className="pl-3 text-neutral-500">
                      └─ [ĐỨNG YÊN] &lt;RealDomProductTable rows={rowCount} /&gt;
                    </div>
                  </>
                )}
              </div>

              <p className="text-neutral-300 leading-relaxed">
                Nguyên tắc: Đặt state gần nhất với component sử dụng nó. Trước khi bọc{" "}
                <code>React.memo</code> khắp nơi, hãy tách phần state thay đổi liên tục (input,
                hover, timer) xuống component con riêng.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 3: MEMOIZATION & REACT COMPILER ==================== */}
      {activeSlide === 2 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 1 • Slide 3 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Kỹ thuật Memoization (React.memo, useMemo, useCallback) &amp; React Compiler
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Khi Component Cha bắt buộc phải giữ state, ta dùng <code>useMemo</code> để tránh
                  lọc/sắp xếp lại {PRODUCTS.length.toLocaleString("vi-VN")} bản ghi và{" "}
                  <code>useCallback</code> + <code>React.memo</code> để giữ nguyên component con.
                </p>
              </div>
              <SmartButton
                variant={memoEnabled ? "emerald" : "danger"}
                size="sm"
                onClick={() => setMemoEnabled((v) => !v)}
              >
                {memoEnabled ? "Đang BẬT useMemo + useCallback" : "Đang TẮT Memoization"}
              </SmartButton>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs">
            <div className="border border-neutral-800 bg-neutral-900 p-3">
              <div className="font-mono font-bold text-neutral-100">1. React.memo(Component)</div>
              <p className="mt-1 text-neutral-300">
                Bỏ qua render component con nếu tất cả props truyền xuống không thay đổi tham chiếu
                (shallow equality).
              </p>
            </div>
            <div className="border border-neutral-800 bg-neutral-900 p-3">
              <div className="font-mono font-bold text-neutral-100">2. useMemo(() =&gt; val, [deps])</div>
              <p className="mt-1 text-neutral-300">
                Lưu kết quả phép tính tốn CPU (lọc/sắp xếp mảng lớn) và giữ nguyên tham chiếu mảng/đối
                tượng giữa các lần render.
              </p>
            </div>
            <div className="border border-neutral-800 bg-neutral-900 p-3">
              <div className="font-mono font-bold text-neutral-100">3. useCallback(fn, [deps])</div>
              <p className="mt-1 text-neutral-300">
                Giữ cố định tham chiếu hàm callback để không làm mất hiệu lực của{" "}
                <code>React.memo</code> ở component con.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-neutral-100">
                  Thử nghiệm trên {PRODUCTS.length.toLocaleString("vi-VN")} sản phẩm thật:
                </span>
                <SmartButton
                  variant="primary"
                  size="sm"
                  onClick={() => setUnrelatedCounter((c) => c + 1)}
                >
                  Tăng state phụ ở Cha (Count = {unrelatedCounter})
                </SmartButton>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">Số lần hàm Filter+Sort 5,000 SP đã chạy:</div>
                  <div className="mt-1 font-mono text-base font-bold text-neutral-100">
                    {filterCalcCountRef.current} lần (
                    {mounted ? `${lastFilterDurationRef.current} ms/lần` : "—"})
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-400">
                    {memoEnabled
                      ? "Đang bật useMemo: bấm nút state phụ KHÔNG chạy lại hàm lọc."
                      : "Đang tắt useMemo: mỗi lần bấm state phụ đều lọc & sort lại 5,000 SP."}
                  </div>
                </div>

                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">Đổi dependency [minScore]:</div>
                  <div className="mt-1.5 flex gap-1.5">
                    {[70, 80, 90].map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setMinScore(sc)}
                        className={`border px-2 py-0.5 font-mono text-xs ${
                          minScore === sc
                            ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-bold"
                            : "border-neutral-700 bg-neutral-900 text-neutral-300"
                        }`}
                      >
                        &ge; {sc}đ
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] text-neutral-400">
                    Khớp: {displayedProducts.length.toLocaleString("vi-VN")} sản phẩm
                  </div>
                </div>
              </div>

              <MemoizedChildToolbar
                onSelectCategory={memoEnabled ? stableCallback : unstableCallback}
                isMemoEnabled={memoEnabled}
              />
            </div>

            <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-neutral-100">
                  So sánh viết Memo thủ công vs React Compiler (babel-plugin-react-compiler)
                </span>
                <div className="flex border border-neutral-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setCompilerView("manual")}
                    className={`px-2.5 py-1 ${
                      compilerView === "manual"
                        ? "bg-neutral-100 text-neutral-950 font-bold"
                        : "bg-neutral-950 text-neutral-300"
                    }`}
                  >
                    Thủ công
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompilerView("compiler")}
                    className={`px-2.5 py-1 ${
                      compilerView === "compiler"
                        ? "bg-neutral-100 text-neutral-950 font-bold"
                        : "bg-neutral-950 text-neutral-300"
                    }`}
                  >
                    React Compiler
                  </button>
                </div>
              </div>

              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {compilerView === "manual"
                  ? `// Viết thủ công: lập trình viên tự bọc memo, useMemo, useCallback
const FilteredView = React.memo(function FilteredView({ items, minScore }) {
  const visible = useMemo(
    () => items.filter((i) => i.score >= minScore),
    [items, minScore]
  );
  const handleSelect = useCallback((id: number) => {
    selectItem(id);
  }, []);
  return <List data={visible} onSelect={handleSelect} />;
});`
                  : `// Với React Compiler: viết JS thuần, trình biên dịch tự chèn cache slot
function FilteredView({ items, minScore }) {
  const visible = items.filter((i) => i.score >= minScore);
  const handleSelect = (id: number) => selectItem(id);
  return <List data={visible} onSelect={handleSelect} />;
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 4: CODE SPLITTING & LAZY LOADING THẬT ==================== */}
      {activeSlide === 3 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 1 • Slide 4 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Code Splitting &amp; Lazy Loading với React.lazy() và &lt;Suspense&gt; (Không chèn setTimeout)
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Khi bấm nút bên phải, trình duyệt mới gửi request tải chunk{" "}
                  <code>HeavyChartModal</code> (chứa <code>@babel/parser</code> +{" "}
                  <code>@babel/types</code> + <code>zod</code> + <code>date-fns</code>). Bảng bên
                  dưới tự động bắt đúng entry mạng mới sinh ra trong{" "}
                  <code>PerformanceResourceTiming</code>.
                </p>
              </div>
              <div>
                {!showLazyChart ? (
                  <SmartButton variant="emerald" size="sm" onClick={handleOpenLazyChart}>
                    Tải &amp; Mở HeavyChartModal (React.lazy)
                  </SmartButton>
                ) : (
                  <SmartButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLazyChart(false)}
                  >
                    Ẩn Modal (Chunk đã nằm trong bộ nhớ trình duyệt)
                  </SmartButton>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="text-xs font-bold text-neutral-100">
                Code thật tại <code>src/components/demos/Member1ReactOpt.tsx</code>:
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`// Tách HeavyChartModal thành JS chunk riêng (không có setTimeout giả):
const LazyHeavyChartModal = lazy(
  () => import("./HeavyChartModal")
);

{showLazyChart && (
  <Suspense fallback={<Skeleton />}>
    <LazyHeavyChartModal />
  </Suspense>
)}`}
              </pre>

              <div className="border border-neutral-800 bg-neutral-950 p-3 text-xs space-y-1.5">
                <div className="font-bold text-neutral-100">
                  Chunk JS mới ghi nhận từ PerformanceResourceTiming:
                </div>
                {lazyChunks.length === 0 ? (
                  <div className="font-mono text-neutral-400">
                    Chưa nạp chunk. Hãy bấm nút &ldquo;Tải &amp; Mở HeavyChartModal&rdquo;.
                  </div>
                ) : (
                  <>
                    <div className="font-mono text-emerald-400">
                      Số chunk liên quan: {lazyChunks.length} file • Tổng decoded:{" "}
                      <strong>{kb(sum(lazyChunks, "decoded"))}</strong> • Thời gian nạp:{" "}
                      <strong>{ms(lazyLoadElapsedMs)}</strong>
                    </div>
                    <ul className="max-h-28 overflow-y-auto border-t border-neutral-800 pt-1.5 font-mono text-[11px] space-y-1 text-neutral-300">
                      {lazyChunks.map((c) => (
                        <li key={c.name} className="flex justify-between gap-2">
                          <span className="truncate">{c.file}</span>
                          <span className="shrink-0">{kb(c.decoded || c.encoded)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 flex flex-col justify-center">
              {!showLazyChart ? (
                <div className="border border-dashed border-neutral-700 bg-neutral-950 p-8 text-center space-y-2">
                  <div className="text-sm font-bold text-neutral-100">
                    Chunk <code>HeavyChartModal</code> chưa được nạp
                  </div>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Bấm nút bên dưới để kích hoạt <code>import(&quot;./HeavyChartModal&quot;)</code>{" "}
                    và đo kích thước thật của chunk vừa tải qua mạng.
                  </p>
                  <div className="pt-2">
                    <SmartButton variant="emerald" size="md" onClick={handleOpenLazyChart}>
                      Kích hoạt React.lazy() ngay
                    </SmartButton>
                  </div>
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="border border-neutral-700 bg-neutral-950 p-6 font-mono text-xs text-neutral-300">
                      &lt;Suspense fallback&gt;: Đang tải chunk HeavyChartModal...
                    </div>
                  }
                >
                  <LazyHeavyChartModal />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 5: MINH HỌA THỰC TẾ — CODE DIFF & NHẬT KÝ COMMIT ==================== */}
      {activeSlide === 4 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 1 • Slide 5 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Minh họa thực tế: Đối chiếu Code &amp; Biểu đồ thời gian Commit từ dữ liệu bạn vừa gõ ở Slide 2
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Biểu đồ dưới đây vẽ từ các lần commit thật được ghi lại khi bạn gõ phím ở Slide 2.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 text-xs">
                <span className="font-bold text-red-400">
                  TRƯỚC KHI TÁCH STATE (TB: {avgBad !== null ? `${avgBad} ms` : "chưa đo"})
                </span>
                <span className="font-mono text-neutral-400">Cascading Re-render</span>
              </div>
              <pre className="overflow-x-auto bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`function ProductPage() {
  // State đặt ở Cha -> mỗi phím gõ dựng lại toàn bộ bảng
  const [query, setQuery] = useState("");
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <RealDomProductTable rows={products} />
    </div>
  );
}`}
              </pre>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 text-xs">
                <span className="font-bold text-emerald-400">
                  SAU KHI TÁCH STATE (TB: {avgGood !== null ? `${avgGood} ms` : "chưa đo"})
                </span>
                <span className="font-mono text-neutral-400">State Colocation</span>
              </div>
              <pre className="overflow-x-auto bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`function IsolatedSearchInput() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function ProductPage() {
  return (
    <div>
      <IsolatedSearchInput />
      {/* Không bị render lại khi gõ phím */}
      <RealDomProductTable rows={products} />
    </div>
  );
}`}
              </pre>
            </div>
          </div>

          <div className="border border-neutral-700 bg-neutral-900 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2 text-xs">
              <span className="font-bold text-neutral-100">
                Nhật ký commit thực tế ({renderHistory.length} mẫu đã đo)
              </span>
              <span className="font-mono text-neutral-400">
                TB Chưa tối ưu: {avgBad !== null ? `${avgBad} ms` : "—"} | TB Đã tối ưu:{" "}
                {avgGood !== null ? `${avgGood} ms` : "—"}
              </span>
            </div>

            {renderHistory.length === 0 ? (
              <div className="border border-dashed border-neutral-700 bg-neutral-950 p-4 text-xs text-neutral-400">
                Chưa có mẫu đo nào trong phiên này. Hãy chuyển sang <strong>Slide 2</strong> và gõ
                vài ký tự ở cả 2 chế độ để thu thập số đo thật.
              </div>
            ) : (
              <div className="space-y-1.5 font-mono text-xs">
                {renderHistory.slice(-10).map((s, idx) => {
                  const maxMs = Math.max(...renderHistory.map((x) => x.ms), 20);
                  const widthPct = Math.min(100, Math.max(2, (s.ms / maxMs) * 100));
                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center gap-2 border border-neutral-800 bg-neutral-950 px-2.5 py-1.5"
                    >
                      <span className="col-span-3 font-bold text-neutral-200">
                        {s.mode === "bad" ? "[Chưa tách state]" : "[State Colocation]"} ({s.rows}{" "}
                        dòng)
                      </span>
                      <div className="col-span-7 h-3 bg-neutral-800">
                        <div
                          className={`h-full ${
                            s.mode === "bad" ? "bg-red-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      <span className="col-span-2 text-right font-bold text-neutral-100">
                        {s.ms} ms
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
