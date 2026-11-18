"use client";

import React, { useMemo, useState } from "react";
import { format, formatDistanceToNow, parseISO, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";

const ReportItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  latencyMs: z.number(),
  status: z.enum(["OK", "WARN"]),
});

export default function ClientBundleDemoPage() {
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OK" | "WARN">("ALL");
  const [renderedAt, setRenderedAt] = useState<string>("—");

  React.useEffect(() => {
    setRenderedAt(format(new Date(), "HH:mm:ss dd/MM/yyyy", { locale: vi }));
  }, []);

  const reports = useMemo(() => {
    const baseDate = parseISO("2025-05-15T08:00:00.000Z");
    const raw = [
      {
        id: "RPT-01",
        title: "Kiểm tra đóng gói Client Component",
        createdAt: subDays(baseDate, 1).toISOString(),
        latencyMs: 14,
        status: "OK",
      },
      {
        id: "RPT-02",
        title: "Đồng bộ dữ liệu danh mục sản phẩm",
        createdAt: subDays(baseDate, 4).toISOString(),
        latencyMs: 32,
        status: "OK",
      },
      {
        id: "RPT-03",
        title: "Phân tích chỉ số Web Vitals định kỳ",
        createdAt: subDays(baseDate, 9).toISOString(),
        latencyMs: 48,
        status: "WARN",
      },
    ];
    return z.array(ReportItemSchema).parse(raw);
  }, []);

  const visible = reports.filter((r) => filterStatus === "ALL" || r.status === filterStatus);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <span className="text-sm font-bold text-neutral-100">
          Route Client Component (&quot;use client&quot;) — đóng gói cả date-fns + zod xuống trình duyệt
        </span>
        <span className="font-mono text-xs text-neutral-400">
          Render lúc: {renderedAt}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-300">Lọc trạng thái:</span>
        {(["ALL", "OK", "WARN"] as const).map((st) => (
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

      <table className="w-full border-collapse border border-neutral-800 text-left text-xs">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
            <th className="p-2 font-semibold">Mã</th>
            <th className="p-2 font-semibold">Tiêu đề</th>
            <th className="p-2 font-semibold">Thời gian</th>
            <th className="p-2 font-semibold">Độ trễ</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id} className="border-b border-neutral-800">
              <td className="p-2 font-mono text-neutral-300">{r.id}</td>
              <td className="p-2 text-neutral-100">{r.title}</td>
              <td className="p-2 font-mono text-neutral-300">
                {format(parseISO(r.createdAt), "dd/MM/yyyy", { locale: vi })} (
                {renderedAt !== "—"
                  ? formatDistanceToNow(parseISO(r.createdAt), { addSuffix: true, locale: vi })
                  : "date-fns"}
                )
              </td>
              <td className="p-2 font-mono text-neutral-300">{r.latencyMs} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
