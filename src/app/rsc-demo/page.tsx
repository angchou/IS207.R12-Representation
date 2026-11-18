import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { format, formatDistanceToNow, parseISO, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Route Server Component (RSC) Thực tế — date-fns & zod chạy trên Server",
    description:
      "Trang thực tế chạy 100% trên Next.js Server Component: import date-fns và zod trên server nên không phát sinh JS bundle của 2 thư viện này ở phía client.",
  };
}

const ReportItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  latencyMs: z.number(),
  status: z.enum(["OK", "WARN"]),
});

async function queryPrimaryReports() {
  await new Promise((r) => setTimeout(r, 80));
  const now = new Date();
  const raw = [
    {
      id: "RPT-01",
      title: "Kiểm tra đóng gói Server Component",
      createdAt: subDays(now, 1).toISOString(),
      latencyMs: 14,
      status: "OK",
    },
    {
      id: "RPT-02",
      title: "Đồng bộ dữ liệu danh mục sản phẩm",
      createdAt: subDays(now, 4).toISOString(),
      latencyMs: 32,
      status: "OK",
    },
    {
      id: "RPT-03",
      title: "Phân tích chỉ số Web Vitals định kỳ",
      createdAt: subDays(now, 9).toISOString(),
      latencyMs: 48,
      status: "WARN",
    },
  ];
  return z.array(ReportItemSchema).parse(raw);
}

async function querySystemSummary() {
  await new Promise((r) => setTimeout(r, 95));
  return {
    nodeVersion: process.version,
    renderedOnServerAt: format(new Date(), "HH:mm:ss dd/MM/yyyy", { locale: vi }),
  };
}

async function SlowStreamingAnalyticsBlock() {
  await new Promise((r) => setTimeout(r, 260));
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
        Component <code>SlowStreamingAnalyticsBlock</code> là một async function chạy trên Server.
        Trình duyệt chỉ nhận về HTML đã render, không tải mã nguồn của hàm này hay thư viện{" "}
        <code>date-fns</code> / <code>zod</code> xuống Client.
      </p>
    </div>
  );
}

export default async function RscLiveDemoPage() {
  const t0 = performance.now();
  const [reports, summary] = await Promise.all([
    queryPrimaryReports(),
    querySystemSummary(),
  ]);
  const elapsedMs = Math.round(performance.now() - t0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <Link
          href="/"
          className="border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-100 hover:bg-neutral-800"
        >
          &larr; Quay lại trang Slide
        </Link>
        <span className="border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono text-xs text-neutral-300">
          src/app/rsc-demo/page.tsx (Server Component — không có &quot;use client&quot;)
        </span>
      </div>

      <div className="border border-neutral-700 bg-neutral-900 p-5 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-lg font-bold text-neutral-100">
            Route Server Component (RSC): chạy date-fns + zod hoàn toàn trên Server
          </h1>
          <span className="font-mono text-xs text-emerald-400">
            Promise.all trên Server: {elapsedMs} ms
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Runtime trên Server</div>
            <div className="mt-1 font-mono font-bold text-neutral-100">
              Node {summary.nodeVersion}
            </div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Thời điểm render (date-fns/locale/vi)</div>
            <div className="mt-1 font-mono font-bold text-neutral-100">
              {summary.renderedOnServerAt}
            </div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-3">
            <div className="text-neutral-400">Thư viện xử lý trên Server</div>
            <div className="mt-1 font-mono font-bold text-emerald-400">
              date-fns + zod (0 kB ở Client)
            </div>
          </div>
        </div>

        <table className="w-full border-collapse border border-neutral-800 text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
              <th className="p-2 font-semibold">Mã</th>
              <th className="p-2 font-semibold">Tiêu đề (đã validate bằng Zod trên Server)</th>
              <th className="p-2 font-semibold">Thời gian (format bởi date-fns trên Server)</th>
              <th className="p-2 font-semibold">Độ trễ</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-neutral-800">
                <td className="p-2 font-mono text-neutral-300">{r.id}</td>
                <td className="p-2 text-neutral-100">{r.title}</td>
                <td className="p-2 font-mono text-neutral-300">
                  {formatDistanceToNow(parseISO(r.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </td>
                <td className="p-2 font-mono text-neutral-300">{r.latencyMs} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
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
