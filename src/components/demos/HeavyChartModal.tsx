"use client";

import React, { useState } from "react";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";
import { PRODUCTS } from "@/lib/products";

const BucketSchema = z.object({
  category: z.string(),
  count: z.number(),
  avgPrice: z.number(),
  avgScore: z.number(),
  reportDate: z.string(),
});

type Bucket = z.infer<typeof BucketSchema>;

function computeBuckets(): { buckets: Bucket[]; computeMs: number } {
  const t0 = performance.now();
  const map = new Map<string, { count: number; totalPrice: number; totalScore: number }>();
  for (const p of PRODUCTS) {
    const cur = map.get(p.category) ?? { count: 0, totalPrice: 0, totalScore: 0 };
    cur.count += 1;
    cur.totalPrice += p.price;
    cur.totalScore += p.score;
    map.set(p.category, cur);
  }
  const now = new Date();
  const raw = Array.from(map.entries()).map(([category, v], idx) => ({
    category,
    count: v.count,
    avgPrice: Math.round(v.totalPrice / v.count),
    avgScore: Number((v.totalScore / v.count).toFixed(1)),
    reportDate: format(subDays(now, idx), "dd/MM/yyyy", { locale: vi }),
  }));
  const buckets = z.array(BucketSchema).parse(raw);
  return { buckets, computeMs: Number((performance.now() - t0).toFixed(2)) };
}

export default function HeavyChartModal() {
  const [{ buckets, computeMs }] = useState(computeBuckets);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="border border-neutral-700 bg-neutral-950 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <div>
          <div className="text-sm font-bold text-neutral-100">
            HeavyChartModal.tsx — Đã nạp qua React.lazy() + import() động
          </div>
          <div className="text-xs text-neutral-400">
            Chunk này đóng gói kèm <code>date-fns</code> + <code>zod</code> và thống kê{" "}
            {PRODUCTS.length.toLocaleString("vi-VN")} bản ghi trong {computeMs} ms.
          </div>
        </div>
        <span className="border border-emerald-500 bg-emerald-950/60 px-2 py-0.5 font-mono text-xs font-bold text-emerald-300">
          Lazy Chunk Loaded
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-8 space-y-1.5">
          {buckets.map((b, idx) => {
            const active = idx === selectedIdx;
            const widthPct = Math.round((b.count / maxCount) * 100);
            return (
              <button
                key={b.category}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-full border p-2 text-left text-xs ${
                  active
                    ? "border-neutral-300 bg-neutral-800"
                    : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800/60"
                }`}
              >
                <div className="flex justify-between font-mono text-neutral-200">
                  <span className="font-bold text-neutral-100">{b.category}</span>
                  <span>
                    {b.count} SP • ĐTB: {b.avgScore} • Ngày: {b.reportDate}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full bg-neutral-800">
                  <div className="h-full bg-emerald-500" style={{ width: `${widthPct}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="md:col-span-4 border border-neutral-800 bg-neutral-900 p-3 text-xs space-y-1.5">
          <div className="font-bold text-neutral-100">
            Nhóm đang chọn: {buckets[selectedIdx]?.category}
          </div>
          <div className="font-mono text-neutral-300">
            Số lượng: {buckets[selectedIdx]?.count} sản phẩm
          </div>
          <div className="font-mono text-neutral-300">
            Giá TB: {buckets[selectedIdx]?.avgPrice.toLocaleString("vi-VN")} ₫
          </div>
          <div className="font-mono text-neutral-300">
            Điểm TB: {buckets[selectedIdx]?.avgScore} / 100
          </div>
          <div className="pt-1 text-[11px] text-neutral-400">
            Dữ liệu đã được validate bằng schema <code>zod</code> và format ngày bằng{" "}
            <code>date-fns</code> bên trong chunk lười tải này.
          </div>
        </div>
      </div>
    </div>
  );
}
