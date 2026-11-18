import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  runHeavyAuditAndAstPipeline,
  type HighlightToken,
} from "@/lib/heavy-data-pipeline";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Route Server Component (RSC) Thực tế — @babel/parser + zod + date-fns trên Server",
    description:
      "Trang thực tế chạy 100% trên Next.js Server Component: parse AST & Syntax Highlighting bằng @babel/parser + @babel/types và validate 600 bản ghi bằng zod hoàn toàn trên Server (0 kB thư viện gửi xuống Client).",
  };
}

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

async function queryServerPipeline() {
  await new Promise((r) => setTimeout(r, 40));
  return runHeavyAuditAndAstPipeline(600);
}

async function querySystemSummary() {
  await new Promise((r) => setTimeout(r, 50));
  return {
    nodeVersion: process.version,
    renderedOnServerAt: format(new Date(), "HH:mm:ss dd/MM/yyyy", { locale: vi }),
  };
}

async function SlowStreamingAnalyticsBlock() {
  await new Promise((r) => setTimeout(r, 220));
  const serverTime = format(new Date(), "HH:mm:ss.SSS", { locale: vi });

  return (
    <div className="border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <span className="text-xs font-bold text-neutral-100">
          Khối async Server Component được stream qua &lt;Suspense&gt;
        </span>
        <span className="font-mono text-xs text-neutral-400">
          Server finish: {serverTime}
        </span>
      </div>
      <p className="mt-2 text-xs text-neutral-300">
        Component <code>SlowStreamingAnalyticsBlock</code> chạy trên Server. Trình duyệt chỉ nhận về
        HTML đã render, không tải mã nguồn của <code>@babel/parser</code>,{" "}
        <code>@babel/types</code>, <code>zod</code> hay <code>date-fns</code> xuống Client.
      </p>
    </div>
  );
}

export default async function RscLiveDemoPage() {
  const t0 = performance.now();
  const [pipeline, summary] = await Promise.all([
    queryServerPipeline(),
    querySystemSummary(),
  ]);
  const elapsedMs = Math.round(performance.now() - t0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <Link
          href="/"
          className="border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-100 hover:bg-neutral-800"
        >
          &larr; Quay lại trang Slide
        </Link>
        <span className="border border-emerald-500/80 bg-emerald-950/40 px-2.5 py-1 font-mono text-xs text-emerald-300">
          src/app/rsc-demo/page.tsx (100% Server Component — 0 kB thư viện ở Client)
        </span>
      </div>

      <div className="border border-neutral-700 bg-neutral-900 p-4 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-base font-bold text-neutral-100">
            Server Component (RSC): Parse AST (@babel/parser) + Validate 600 bản ghi (Zod) + Format (date-fns) trên Server
          </h1>
          <span className="font-mono text-xs text-emerald-400">
            CPU xử lý trên Server: {pipeline.computeTimeMs} ms (Tổng Promise.all: {elapsedMs} ms)
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 text-xs font-mono">
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Bản ghi Zod đã validate</div>
            <div className="mt-1 text-base font-bold text-neutral-100">
              {pipeline.totalValidatedRecords} records
            </div>
            <div className="text-[11px] text-neutral-500">
              OK: {pipeline.statusBreakdown.OK} • WARN: {pipeline.statusBreakdown.WARN} • CRIT:{" "}
              {pipeline.statusBreakdown.CRITICAL}
            </div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Babel AST Syntax Highlight</div>
            <div className="mt-1 text-base font-bold text-neutral-100">
              {pipeline.totalAstNodes} AST nodes
            </div>
            <div className="text-[11px] text-neutral-500">
              {pipeline.totalAstTokens} lexical tokens
            </div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Runtime thực thi</div>
            <div className="mt-1 text-base font-bold text-neutral-100">
              Node {summary.nodeVersion}
            </div>
            <div className="text-[11px] text-neutral-500">{summary.renderedOnServerAt}</div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Bundle thư viện gửi xuống Client</div>
            <div className="mt-1 text-base font-bold text-emerald-400">0 kB</div>
            <div className="text-[11px] text-neutral-500">
              @babel/parser + @babel/types + zod + date-fns ở lại Server
            </div>
          </div>
        </div>

        {/* Khối Code đã được Syntax Highlight bằng @babel/parser ngay trên Server */}
        <div className="grid gap-3 lg:grid-cols-2">
          {pipeline.codeExamples.map((ex) => (
            <div key={ex.id} className="border border-neutral-800 bg-neutral-950 p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 text-xs">
                <span className="font-bold text-neutral-200">{ex.title}</span>
                <span className="font-mono text-[11px] text-emerald-400">
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

        {/* Bảng hiển thị mẫu từ 600 bản ghi đã được Zod validate và date-fns format */}
        <div className="max-h-56 overflow-y-auto border border-neutral-800">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-neutral-950 border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="p-2 font-semibold">Mã (Zod Regex)</th>
                <th className="p-2 font-semibold">Service &amp; Region</th>
                <th className="p-2 font-semibold">Thời gian (date-fns/vi)</th>
                <th className="p-2 font-semibold">TTFB / CPU</th>
                <th className="p-2 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.sampleRecords.map((r) => (
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
      </div>

      <Suspense
        fallback={
          <div className="border border-neutral-800 bg-neutral-900 p-4 font-mono text-xs text-neutral-400">
            Đang stream khối dữ liệu từ Server qua &lt;Suspense&gt;...
          </div>
        }
      >
        <SlowStreamingAnalyticsBlock />
      </Suspense>
    </main>
  );
}
