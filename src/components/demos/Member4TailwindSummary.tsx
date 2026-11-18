"use client";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SmartButton } from "@/components/ui/SmartButton";
import { cn } from "@/lib/utils";
import { getResources, kb, ms, pct, sum, type Res } from "@/lib/resources";
import { clearAllMetrics, patchMetric, useMetric } from "@/lib/metrics-store";
import { useVitals } from "@/lib/vitals";

interface CssStatsResponse {
  nodeEnv: string;
  scannedSourceFiles: number;
  distinctClassTokensInSource: number;
  cssFiles: Array<{
    file: string;
    rawBytes: number;
    gzipBytes: number;
    classRuleCount?: number;
  }>;
  totalCssRawBytes: number;
  totalCssGzipBytes: number;
}

export function Member4TailwindSummary({ activeSlide }: { activeSlide: number }) {
  const vitals = useVitals();

  // ===== Slide 1 & 2: Đọc thông số file CSS thật từ /api/demo/css-stats =====
  const [cssStats, setCssStats] = useState<CssStatsResponse | null>(null);
  const [allResources, setAllResources] = useState<Res[]>([]);

  useEffect(() => {
    setAllResources(getResources());
    fetch("/api/demo/css-stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: CssStatsResponse) => {
        setCssStats(data);
        patchMetric("m4.css", { purged: data.totalCssRawBytes });
      })
      .catch(() => {});
  }, [activeSlide]);

  // ===== Slide 3: Live Playground cho CVA + clsx + tailwind-merge =====
  const [selectedVariant, setSelectedVariant] = useState<
    "primary" | "emerald" | "danger" | "outline"
  >("primary");
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md");
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [customOverrideClass, setCustomOverrideClass] = useState(
    "bg-amber-500 hover:bg-amber-400 px-8 text-neutral-950"
  );

  const rawClsxOutput = clsx(
    "px-3.5 py-2 bg-neutral-100 text-neutral-950",
    isLoadingState && "opacity-60 cursor-wait",
    customOverrideClass
  );

  const mergedCleanOutput = twMerge(
    clsx(
      "px-3.5 py-2 bg-neutral-100 text-neutral-950",
      isLoadingState && "opacity-60 cursor-wait",
      customOverrideClass
    )
  );

  // ===== Slide 4: Đọc lại các kết quả đã đo thật trong toàn bộ phiên =====
  const m1Render = useMetric("m1.render") ?? [];
  const m1Lazy = useMetric("m1.lazy");
  const m2Bundle = useMetric("m2.bundle");
  const m2Fetch = useMetric("m2.fetch");
  const m2Stream = useMetric("m2.stream");
  const m3Cls = useMetric("m3.cls");
  const m3Image = useMetric("m3.image");
  const m4Css = useMetric("m4.css");

  const badRenders = m1Render.filter((s) => s.mode === "bad");
  const goodRenders = m1Render.filter((s) => s.mode === "good");
  const avgBadMs =
    badRenders.length > 0
      ? Number((badRenders.reduce((a, b) => a + b.ms, 0) / badRenders.length).toFixed(2))
      : null;
  const avgGoodMs =
    goodRenders.length > 0
      ? Number((goodRenders.reduce((a, b) => a + b.ms, 0) / goodRenders.length).toFixed(2))
      : null;

  const jsResources = allResources.filter((r) => r.type === "js");
  const cssResources = allResources.filter((r) => r.type === "css");
  const fontResources = allResources.filter((r) => r.type === "font");

  return (
    <div className="space-y-5">
      {/* ==================== SLIDE 1: ZERO-RUNTIME CSS & SỐ ĐO FILE CSS THẬT ==================== */}
      {activeSlide === 0 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 4 • Slide 1 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Zero-runtime CSS &amp; Cơ chế Purge / JIT — Đo trực tiếp file CSS trong .next/static/css
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Dữ liệu bên dưới được server đọc thật từ thư mục <code>.next/static/css</code> và quét
              trực tiếp các file <code>.ts/.tsx</code> trong <code>src/</code> qua API{" "}
              <code>/api/demo/css-stats</code>.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12 text-xs">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="font-bold text-neutral-100">
                Thông số file CSS thật của dự án này:
              </div>

              <div className="grid gap-3 sm:grid-cols-3 font-mono">
                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">Số file nguồn đã quét</div>
                  <div className="mt-1 text-lg font-bold text-neutral-100">
                    {cssStats ? `${cssStats.scannedSourceFiles} files` : "..."}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {cssStats ? `${cssStats.distinctClassTokensInSource} class token riêng biệt` : ""}
                  </div>
                </div>

                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">Tổng CSS (Raw)</div>
                  <div className="mt-1 text-lg font-bold text-neutral-100">
                    {cssStats ? kb(cssStats.totalCssRawBytes) : "..."}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {cssStats
                      ? `${cssStats.totalCssRawBytes.toLocaleString("vi-VN")} bytes`
                      : ""}
                  </div>
                </div>

                <div className="border border-neutral-800 bg-neutral-950 p-3">
                  <div className="text-neutral-400">Tổng CSS (Nén Gzip)</div>
                  <div className="mt-1 text-lg font-bold text-emerald-400">
                    {cssStats ? kb(cssStats.totalCssGzipBytes) : "..."}
                  </div>
                  <div className="text-[11px] text-neutral-400">0 kB JS Runtime</div>
                </div>
              </div>

              {cssStats && cssStats.cssFiles.length > 0 && (
                <table className="w-full border-collapse border border-neutral-800 text-left font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
                      <th className="p-2">File CSS thực tế trên đĩa</th>
                      <th className="p-2">Số rule CSS</th>
                      <th className="p-2">Raw size</th>
                      <th className="p-2">Gzip size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cssStats.cssFiles.map((f) => (
                      <tr key={f.file} className="border-b border-neutral-800">
                        <td className="p-2 font-bold text-neutral-200">{f.file}</td>
                        <td className="p-2 text-neutral-300">{f.classRuleCount} rules</td>
                        <td className="p-2 text-neutral-300">{kb(f.rawBytes)}</td>
                        <td className="p-2 font-bold text-emerald-400">{kb(f.gzipBytes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2.5">
              <div className="font-bold text-neutral-100">
                So sánh cơ chế Runtime CSS-in-JS vs Zero-runtime Tailwind
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-3 space-y-1">
                <div className="font-bold text-red-400">CSS-in-JS (Runtime):</div>
                <p className="text-neutral-300">
                  Phải tải thêm thư viện JS xuống trình duyệt, parse style object khi component
                  render và chèn thẻ <code>&lt;style&gt;</code> động vào DOM. Không chạy trực tiếp
                  trên React Server Components.
                </p>
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-3 space-y-1">
                <div className="font-bold text-emerald-400">Tailwind CSS (Build-time JIT):</div>
                <p className="text-neutral-300">
                  Quét mã nguồn lúc build để chỉ sinh ra các rule CSS thực sự có mặt trong{" "}
                  <code>src/</code>. Xuất ra file <code>.css</code> tĩnh hoàn toàn, không tốn 1 ms
                  CPU JavaScript nào khi render.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 2: TỐC ĐỘ PHÁT TRIỂN (DX) & TÁI SỬ DỤNG CLASS ==================== */}
      {activeSlide === 1 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 4 • Slide 2 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Tối ưu tốc độ phát triển (DX) &amp; Bảo trì: Tái sử dụng Utility Class trên toàn dự án
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Vì sao thêm nhiều màn hình mới nhưng file CSS của Tailwind gần như không tăng dung
              lượng? Vì mọi component đều dùng lại chung các utility nguyên tử (<code>flex</code>,{" "}
              <code>border</code>, <code>p-4</code>, <code>text-xs</code>...).
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12 text-xs">
            <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="font-bold text-neutral-100">
                Thống kê tái sử dụng thật trên {cssStats?.scannedSourceFiles ?? "—"} file nguồn của
                dự án này:
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-3 font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tổng số slide &amp; route trong dự án:</span>
                  <strong>20 slides + 3 routes + 4 API</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Số class token duy nhất trong toàn bộ code:</span>
                  <strong>{cssStats?.distinctClassTokensInSource ?? "—"} classes</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Dung lượng CSS Gzip cho toàn bộ ứng dụng:</span>
                  <strong className="text-emerald-400">
                    {cssStats ? kb(cssStats.totalCssGzipBytes) : "—"}
                  </strong>
                </div>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                Một class như <code>border-neutral-800</code> hay <code>p-4</code> dù được dùng ở
                100 component khác nhau thì trong file CSS đầu ra cũng chỉ được định nghĩa đúng{" "}
                <strong>1 lần duy nhất</strong>.
              </p>
            </div>

            <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900 p-4 space-y-2.5">
              <div className="font-bold text-neutral-100">
                3 lợi ích bảo trì cho làm việc nhóm
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-300">
                <strong className="text-neutral-100">1. Thống nhất Design Tokens:</strong> Cả nhóm
                dùng chung hệ quy chiếu trong <code>tailwind.config.ts</code> (ví dụ đặt{" "}
                <code>borderRadius = 0</code> một chỗ là toàn bộ dự án chuyển sang khối vuông).
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-300">
                <strong className="text-neutral-100">2. Không xung đột phạm vi CSS:</strong> Không sợ
                sửa file CSS của trang A làm hỏng bố cục của trang B.
              </div>
              <div className="border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-300">
                <strong className="text-neutral-100">3. Xóa Component là sạch luôn CSS:</strong> Khi
                xóa một component không còn dùng, các utility riêng của nó tự động được loại khỏi bản
                build kế tiếp.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 3: QUẢN LÝ CLASS ĐỘNG VỚI CLSX + TAILWIND-MERGE + CVA ==================== */}
      {activeSlide === 2 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 4 • Slide 3 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Quản lý Class động với clsx, tailwind-merge (hàm cn) và CVA
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Thử nghiệm trực tiếp hàm <code>twMerge(clsx(...))</code> đang chạy thật: nhập thêm
              class ghi đè vào ô bên dưới để xem <code>tailwind-merge</code> tự loại bỏ class xung
              đột.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12 text-xs">
            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="font-bold text-neutral-100">
                Bảng thử nghiệm trực tiếp Component &lt;SmartButton /&gt;
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="mb-1.5 text-neutral-400">1. Chọn variant (CVA):</div>
                  <div className="flex flex-wrap gap-1">
                    {(["primary", "emerald", "danger", "outline"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`border px-2 py-0.5 font-mono ${
                          selectedVariant === v
                            ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-bold"
                            : "border-neutral-700 bg-neutral-900 text-neutral-300"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="mb-1.5 text-neutral-400">2. Chọn size &amp; state:</div>
                  <div className="flex flex-wrap items-center gap-1">
                    {(["sm", "md", "lg"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`border px-2 py-0.5 font-mono ${
                          selectedSize === s
                            ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-bold"
                            : "border-neutral-700 bg-neutral-900 text-neutral-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsLoadingState((v) => !v)}
                      className={`ml-auto border px-2 py-0.5 font-mono ${
                        isLoadingState
                          ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-bold"
                          : "border-neutral-700 bg-neutral-900 text-neutral-300"
                      }`}
                    >
                      isLoading={String(isLoadingState)}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-800 bg-neutral-950 p-2.5 space-y-1">
                <label className="block text-neutral-300">
                  3. Truyền thêm <code>className</code> ghi đè từ bên ngoài:
                </label>
                <input
                  type="text"
                  value={customOverrideClass}
                  onChange={(e) => setCustomOverrideClass(e.target.value)}
                  className="w-full border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 font-mono text-xs text-neutral-100 focus:border-neutral-300 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border border-neutral-700 bg-neutral-950 p-3">
                <span className="font-bold text-neutral-100">
                  Nút &lt;SmartButton /&gt; render thật với class đã gộp:
                </span>
                <SmartButton
                  variant={selectedVariant}
                  size={selectedSize}
                  className={cn(isLoadingState && "opacity-60 cursor-wait", customOverrideClass)}
                >
                  Nút thử nghiệm CVA + twMerge
                </SmartButton>
              </div>
            </div>

            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="font-bold text-neutral-100">
                Đối chiếu chuỗi class đầu ra thật:
              </div>

              <div className="border border-red-500/80 bg-red-950/30 p-2.5 space-y-1">
                <div className="font-bold text-red-300">
                  Chỉ dùng clsx() (Bị trùng class xung đột):
                </div>
                <div className="border border-neutral-800 bg-neutral-950 p-2 font-mono text-[11px] text-red-200 break-words">
                  class=&quot;{rawClsxOutput}&quot;
                </div>
                <p className="text-[11px] text-red-300">
                  Tồn tại đồng thời cả <code>px-3.5</code> lẫn <code>px-8</code>, cả{" "}
                  <code>bg-neutral-100</code> lẫn <code>bg-amber-500</code>.
                </p>
              </div>

              <div className="border border-emerald-500/80 bg-emerald-950/30 p-2.5 space-y-1">
                <div className="font-bold text-emerald-300">
                  Dùng cn() = twMerge(clsx(...)) (Đã loại bỏ class cũ):
                </div>
                <div className="border border-neutral-800 bg-neutral-950 p-2 font-mono text-[11px] text-emerald-200 break-words">
                  class=&quot;{mergedCleanOutput}&quot;
                </div>
                <p className="text-[11px] text-emerald-300">
                  <code>tailwind-merge</code> đã tự xóa <code>px-3.5</code> và{" "}
                  <code>bg-neutral-100</code>, chỉ giữ lại class ghi đè sau cùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 4: BẢNG TỔNG KẾT TỪ SỐ LIỆU ĐO THẬT TRONG PHIÊN ==================== */}
      {activeSlide === 3 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-neutral-400">
                  Thành viên 4 • Slide 4 / 5
                </div>
                <h2 className="mt-1 text-lg font-bold text-neutral-100">
                  Tổng kết bằng số liệu đo thật trong phiên thuyết trình này
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Mọi hàng dưới đây lấy trực tiếp từ các phép đo bạn đã bấm chạy ở các slide trước.
                  Nếu hạng mục nào chưa chạy, bảng sẽ ghi rõ &ldquo;Chưa chạy ở Slide ...&rdquo;
                  thay vì điền sẵn số giả.
                </p>
              </div>
              <SmartButton variant="outline" size="sm" onClick={clearAllMetrics}>
                Xóa dữ liệu đã lưu để đo lại từ đầu
              </SmartButton>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-700 bg-neutral-900">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-700 bg-neutral-950 text-neutral-400">
                  <th className="p-3">Hạng mục &amp; Nguồn đo</th>
                  <th className="p-3">Slide thực hiện</th>
                  <th className="p-3">Chưa tối ưu (Đo thật)</th>
                  <th className="p-3">Đã tối ưu (Đo thật)</th>
                  <th className="p-3">Chênh lệch thực tế</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono">
                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    1. Thời gian Commit khi gõ phím (Render + DOM Commit)
                  </td>
                  <td className="p-3 text-neutral-300">TV1 • Slide 2</td>
                  <td className="p-3 text-red-400">
                    {avgBadMs !== null ? `${avgBadMs} ms (${badRenders.length} mẫu)` : "Chưa đo"}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {avgGoodMs !== null
                      ? `${avgGoodMs} ms (${goodRenders.length} mẫu)`
                      : "Chưa đo"}
                  </td>
                  <td className="p-3 font-bold text-neutral-100">
                    {avgBadMs !== null && avgGoodMs !== null ? pct(avgBadMs, avgGoodMs) : "—"}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    2. Tách chunk với React.lazy (Resource Timing)
                  </td>
                  <td className="p-3 text-neutral-300">TV1 • Slide 4</td>
                  <td className="p-3 text-neutral-400">Nạp ngay từ đầu nếu không tách</td>
                  <td className="p-3 font-bold text-emerald-400">
                    {m1Lazy
                      ? `Chỉ nạp khi bấm: ${kb(m1Lazy.bytes)} (${m1Lazy.files} file, ${m1Lazy.ms} ms)`
                      : "Chưa bấm mở ở TV1 Slide 4"}
                  </td>
                  <td className="p-3 font-bold text-neutral-100">
                    {m1Lazy ? `Hoãn ${kb(m1Lazy.bytes)} khỏi lần tải đầu` : "—"}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    3. JS Bundle ở Client: Route Client vs Route RSC
                  </td>
                  <td className="p-3 text-neutral-300">TV2 • Slide 1</td>
                  <td className="p-3 text-red-400">
                    {m2Bundle?.client != null ? kb(m2Bundle.client) : "Chưa đo /client-demo"}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {m2Bundle?.rsc != null ? kb(m2Bundle.rsc) : "Chưa đo /rsc-demo"}
                  </td>
                  <td className="p-3 font-bold text-neutral-100">
                    {m2Bundle?.client && m2Bundle?.rsc
                      ? pct(m2Bundle.client, m2Bundle.rsc)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    4. Gọi 3 API: Tuần tự (Waterfall) vs Song song (Promise.all)
                  </td>
                  <td className="p-3 text-neutral-300">TV2 • Slide 2</td>
                  <td className="p-3 text-red-400">
                    {m2Fetch?.seq != null ? `${m2Fetch.seq} ms` : "Chưa chạy Tuần tự"}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {m2Fetch?.par != null ? `${m2Fetch.par} ms` : "Chưa chạy Song song"}
                  </td>
                  <td className="p-3 font-bold text-neutral-100">
                    {m2Fetch?.seq && m2Fetch?.par ? pct(m2Fetch.seq, m2Fetch.par) : "—"}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    5. Thời điểm nhận Chunk HTML đầu tiên: Blocking vs Streaming
                  </td>
                  <td className="p-3 text-neutral-300">TV2 • Slide 3</td>
                  <td className="p-3 text-red-400">
                    {m2Stream?.block ? `TTFB ${m2Stream.block.ttfb} ms` : "Chưa chạy Blocking"}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {m2Stream?.stream ? `TTFB ${m2Stream.stream.ttfb} ms` : "Chưa chạy Streaming"}
                  </td>
                  <td className="p-3 font-bold text-neutral-100">
                    {m2Stream?.block && m2Stream?.stream
                      ? pct(m2Stream.block.ttfb, m2Stream.stream.ttfb)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    6. Layout Shift (CLS) &amp; Nén ảnh 4K qua /_next/image
                  </td>
                  <td className="p-3 text-neutral-300">TV3 • Slide 2 &amp; 5</td>
                  <td className="p-3 text-red-400">
                    {m3Image?.original ? kb(m3Image.original) : "Ảnh gốc: chưa đo"} • CLS:{" "}
                    {m3Cls?.img != null ? m3Cls.img.toFixed(4) : "—"}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {m3Image?.optimized
                      ? `${kb(m3Image.optimized)} (${m3Image.format})`
                      : "next/image: chưa đo"}{" "}
                    • CLS: {m3Cls?.next != null ? m3Cls.next.toFixed(4) : "—"}
                  </td>
                  <td className="p-3 font-bold text-neutral-100">
                    {m3Image?.original && m3Image?.optimized
                      ? pct(m3Image.original, m3Image.optimized)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-sans font-bold text-neutral-100">
                    7. Dung lượng File CSS tĩnh của dự án (.next/static/css)
                  </td>
                  <td className="p-3 text-neutral-300">TV4 • Slide 1</td>
                  <td className="p-3 text-neutral-300">
                    Raw:{" "}
                    {cssStats
                      ? kb(cssStats.totalCssRawBytes)
                      : m4Css?.purged
                      ? kb(m4Css.purged)
                      : "—"}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    Gzip: {cssStats ? kb(cssStats.totalCssGzipBytes) : "—"} (0 ms JS Runtime)
                  </td>
                  <td className="p-3 font-bold text-neutral-100">Zero-runtime CSS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== SLIDE 5: MINH HỌA THỰC TẾ — CODE CN() & KIỂM TOÁN TÀI NGUYÊN PHIÊN ==================== */}
      {activeSlide === 4 && (
        <div className="space-y-4">
          <div className="border border-neutral-700 bg-neutral-900 p-4">
            <div className="text-xs font-mono uppercase text-neutral-400">
              Thành viên 4 • Slide 5 / 5
            </div>
            <h2 className="mt-1 text-lg font-bold text-neutral-100">
              Minh họa thực tế: Code hàm cn() trong dự án &amp; Bảng kiểm toán tài nguyên thật của trang
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Không hiển thị điểm Lighthouse giả định. Phía bên phải là chỉ số Web Vitals thật và
              danh sách toàn bộ chunk JS/CSS/Font trình duyệt đã tải trong phiên này.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12 text-xs">
            <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900 p-4 space-y-2.5">
              <div className="font-bold text-neutral-100">
                Code thật tại <code>src/lib/utils.ts</code> &amp;{" "}
                <code>src/components/ui/SmartButton.tsx</code>:
              </div>
              <pre className="overflow-x-auto border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-neutral-200">
                {`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SmartButton = React.forwardRef<
  HTMLButtonElement,
  SmartButtonProps
>(({ className, variant, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(smartButtonVariants({ variant, size }), className)}
    {...props}
  />
));`}
              </pre>
            </div>

            <div className="lg:col-span-7 border border-neutral-800 bg-neutral-900 p-4 space-y-3">
              <div className="font-bold text-neutral-100">
                Kiểm toán trực tiếp phiên trình duyệt hiện tại (PerformanceObserver &amp; Resource Timing):
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono">
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="text-neutral-400">TTFB / LCP</div>
                  <div className="mt-1 font-bold text-neutral-100">
                    {ms(vitals.ttfb)} / {ms(vitals.lcp)}
                  </div>
                </div>
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="text-neutral-400">INP / CLS</div>
                  <div className="mt-1 font-bold text-neutral-100">
                    {vitals.inp != null ? `${Math.round(vitals.inp)} ms` : "<16 ms"} /{" "}
                    {vitals.cls.toFixed(4)}
                  </div>
                </div>
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="text-neutral-400">Tổng JS ({jsResources.length} files)</div>
                  <div className="mt-1 font-bold text-neutral-100">
                    {kb(sum(jsResources, "decoded"))}
                  </div>
                </div>
                <div className="border border-neutral-800 bg-neutral-950 p-2.5">
                  <div className="text-neutral-400">
                    CSS ({cssResources.length}) + Font ({fontResources.length})
                  </div>
                  <div className="mt-1 font-bold text-emerald-400">
                    {kb(sum(cssResources, "decoded") + sum(fontResources, "decoded"))}
                  </div>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto border border-neutral-800">
                <table className="w-full border-collapse text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
                      <th className="p-2">Loại</th>
                      <th className="p-2">Tài nguyên đã tải trong phiên</th>
                      <th className="p-2">Decoded</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResources.map((r, i) => (
                      <tr key={`${r.name}-${i}`} className="border-b border-neutral-800">
                        <td className="p-2 uppercase font-bold text-neutral-300">{r.type}</td>
                        <td className="p-2 truncate max-w-xs text-neutral-200">{r.file}</td>
                        <td className="p-2 font-bold text-neutral-100">
                          {kb(r.decoded || r.encoded)}
                        </td>
                        <td className="p-2 text-neutral-400">{Math.round(r.duration)} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
