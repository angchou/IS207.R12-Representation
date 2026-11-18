"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import {
  runHeavyAuditAndAstPipeline,
  type HighlightToken,
} from "@/lib/heavy-data-pipeline";

/**
 * Component nặng được tách chunk qua React.lazy(() => import("./HeavyChartModal")).
 * Sử dụng trực tiếp pipeline `@babel/parser` + `@babel/types` + `zod` (600 records) + `date-fns`
 * cùng thống kê 5,000 sản phẩm nên tạo ra một lazy chunk lớn (~700+ kB decoded / ~180+ kB gzipped),
 * chỉ tải khi người dùng bấm mở ở Thành viên 1 • Slide 4.
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

export default function HeavyChartModal() {
  const [pipeline] = useState(() => runHeavyAuditAndAstPipeline(600));
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);

  const activeSnippet = pipeline.codeExamples[selectedSnippetIdx];

  return (
    <div className="border border-neutral-700 bg-neutral-950 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <div>
          <div className="text-sm font-bold text-neutral-100">
            HeavyChartModal.tsx — Đã nạp qua React.lazy() + import() động
          </div>
          <div className="text-xs text-neutral-400">
            Chunk này đóng gói <code>@babel/parser</code>, <code>@babel/types</code>,{" "}
            <code>zod</code> và <code>date-fns</code>: vừa parse{" "}
            <strong>{pipeline.totalAstNodes} AST nodes</strong> và validate{" "}
            <strong>{pipeline.totalValidatedRecords} bản ghi</strong> (+{" "}
            {PRODUCTS.length.toLocaleString("vi-VN")} sản phẩm) trong {pipeline.computeTimeMs} ms.
          </div>
        </div>
        <span className="border border-emerald-500 bg-emerald-950/60 px-2 py-0.5 font-mono text-xs font-bold text-emerald-300">
          Lazy Chunk Loaded
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-12 text-xs">
        <div className="md:col-span-5 space-y-2">
          <div className="font-bold text-neutral-200">
            Kết quả Validate 600 bản ghi bằng Zod &amp; date-fns:
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <div className="border border-neutral-800 bg-neutral-900 p-2">
              <div className="text-neutral-400">OK</div>
              <div className="text-sm font-bold text-emerald-400">
                {pipeline.statusBreakdown.OK}
              </div>
            </div>
            <div className="border border-neutral-800 bg-neutral-900 p-2">
              <div className="text-neutral-400">WARN</div>
              <div className="text-sm font-bold text-amber-400">
                {pipeline.statusBreakdown.WARN}
              </div>
            </div>
            <div className="border border-neutral-800 bg-neutral-900 p-2">
              <div className="text-neutral-400">CRITICAL</div>
              <div className="text-sm font-bold text-red-400">
                {pipeline.statusBreakdown.CRITICAL}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-neutral-400">Chọn đoạn code đã highlight bằng Babel AST:</div>
            {pipeline.codeExamples.map((ex, idx) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedSnippetIdx(idx)}
                className={`w-full border p-2 text-left font-mono ${
                  selectedSnippetIdx === idx
                    ? "border-neutral-200 bg-neutral-800 text-neutral-100"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400"
                }`}
              >
                <div className="truncate font-bold">{ex.title}</div>
                <div className="text-[11px]">
                  {ex.astNodeCount} AST nodes • {ex.tokenCount} tokens
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 border border-neutral-800 bg-neutral-900 p-3 space-y-1.5">
          <div className="flex justify-between font-mono text-[11px] text-neutral-400 border-b border-neutral-800 pb-1">
            <span>Babel AST Syntax Highlighter (@babel/parser)</span>
            <span>{activeSnippet?.tokenCount} tokens</span>
          </div>
          <pre className="max-h-48 overflow-auto font-mono text-[11px] leading-relaxed">
            <code>
              {activeSnippet?.tokens.map((tok, idx) => (
                <span key={idx} className={tokenColorClass(tok.kind)}>
                  {tok.text}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
