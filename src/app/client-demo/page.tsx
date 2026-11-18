"use client";

import React, { useMemo, useState } from "react";
import {
  runHeavyAuditAndAstPipeline,
  type HighlightToken,
} from "@/lib/heavy-data-pipeline";

/**
 * Route đối chứng dùng "use client":
 * Chạy CÙNG pipeline nặng `runHeavyAuditAndAstPipeline(600)` như `/rsc-demo`:
 * - Parse AST & Syntax Highlighting TypeScript/JSX bằng `@babel/parser` + `@babel/types`
 * - Validate 600 bản ghi bằng `zod`
 * - Format ngày tháng tiếng Việt bằng `date-fns`
 * Vì đánh dấu `"use client"`, toàn bộ 4 thư viện này bị đóng gói vào JS bundle gửi xuống trình duyệt!
 */

function tokenColorClass(kind: HighlightToken["kind"]): string {
  switch (kind) {
    case "keyword":
      return "text-sky-400 font-semibold";
    case "string":
      return "text-emerald-400";
    case "number":
      return "text-amber-300";
    case "comment":
      return "text-neutral-500 italic";
    case "jsx":
      return "text-purple-300";
    default:
      return "text-neutral-200";
  }
}

export default function ClientBundleDemoPage() {
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OK" | "WARN" | "CRITICAL">("ALL");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pipeline = useMemo(() => runHeavyAuditAndAstPipeline(600), []);

  const visible = pipeline.sampleRecords.filter(
    (r) => filterStatus === "ALL" || r.status === filterStatus
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <span className="text-sm font-bold text-neutral-100">
          Route Client Component (&quot;use client&quot;) — đóng gói cả @babel/parser + @babel/types + zod + date-fns xuống trình duyệt
        </span>
        <span className="border border-red-500/80 bg-red-950/40 px-2 py-0.5 font-mono text-xs text-red-300">
          CPU xử lý ở Client: {mounted ? `${pipeline.computeTimeMs} ms` : "—"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-xs font-mono">
        <div className="border border-neutral-800 bg-neutral-950 p-3">
          <div className="text-neutral-400">Bản ghi Zod đã validate</div>
          <div className="mt-1 text-base font-bold text-neutral-100">
            {pipeline.totalValidatedRecords} records
          </div>
        </div>
        <div className="border border-neutral-800 bg-neutral-950 p-3">
          <div className="text-neutral-400">Babel AST Syntax Highlight</div>
          <div className="mt-1 text-base font-bold text-neutral-100">
            {pipeline.totalAstNodes} AST nodes ({pipeline.totalAstTokens} tokens)
          </div>
        </div>
        <div className="border border-neutral-800 bg-neutral-950 p-3">
          <div className="text-neutral-400">Thư viện phải tải xuống trình duyệt</div>
          <div className="mt-1 text-sm font-bold text-red-400">
            @babel/parser + @babel/types + zod + date-fns
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {pipeline.codeExamples.map((ex) => (
          <div key={ex.id} className="border border-neutral-800 bg-neutral-950 p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 text-xs">
              <span className="font-bold text-neutral-200">{ex.title}</span>
              <span className="font-mono text-[11px] text-red-400">
                {ex.astNodeCount} AST nodes • {ex.tokenCount} tokens
              </span>
            </div>
            <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed">
              <code>
                {ex.tokens.map((tok, idx) => (
                  <span key={idx} className={tokenColorClass(tok.kind)}>
                    {tok.text}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-300">Lọc trạng thái (600 bản ghi):</span>
        {(["ALL", "OK", "WARN", "CRITICAL"] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`border px-2.5 py-1 font-mono ${
              filterStatus === st
                ? "border-neutral-200 bg-neutral-100 text-neutral-950 font-bold"
                : "border-neutral-700 bg-neutral-900 text-neutral-300"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="max-h-48 overflow-y-auto border border-neutral-800">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-neutral-950 border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="p-2 font-semibold">Mã</th>
              <th className="p-2 font-semibold">Service &amp; Region</th>
              <th className="p-2 font-semibold">Thời gian</th>
              <th className="p-2 font-semibold">TTFB / CPU</th>
              <th className="p-2 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-b border-neutral-800">
                <td className="p-2 font-mono text-neutral-300">{r.id}</td>
                <td className="p-2 font-mono text-neutral-200">
                  {r.service} ({r.region})
                </td>
                <td className="p-2 font-mono text-neutral-300">
                  {r.formattedDate} ({r.relativeTime})
                </td>
                <td className="p-2 font-mono text-neutral-300">
                  {r.metrics.ttfbMs} ms / {r.metrics.cpuMs} ms
                </td>
                <td className="p-2 font-mono font-bold text-neutral-200">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
