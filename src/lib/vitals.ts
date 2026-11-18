"use client";

import { useSyncExternalStore } from "react";

/**
 * Đo Core Web Vitals của CHÍNH trang đang mở bằng PerformanceObserver (API gốc của trình duyệt).
 * - LCP: largest-contentful-paint (ngừng cập nhật sau tương tác đầu tiên của người dùng — đúng chuẩn).
 * - CLS: tính theo "session window" (cửa sổ tối đa 5s, khoảng nghỉ 1s) như định nghĩa của Google.
 * - INP: lấy tương tác chậm nhất (khi số tương tác < 50 thì INP chính là giá trị lớn nhất).
 * Hỗ trợ đầy đủ trên Chrome/Edge. Trình duyệt khác có thể thiếu một số chỉ số.
 */

export interface Vitals {
  ttfb?: number;
  fcp?: number;
  lcp?: number;
  lcpElement?: string;
  cls: number;
  inp?: number;
  inpEvent?: string;
  interactions: number;
  supported: { lcp: boolean; cls: boolean; inp: boolean };
}

let vitals: Vitals = {
  cls: 0,
  interactions: 0,
  supported: { lcp: false, cls: false, inp: false },
};
let started = false;
const listeners = new Set<() => void>();

function emit(patch: Partial<Vitals>) {
  vitals = { ...vitals, ...patch };
  listeners.forEach((l) => l());
}

function describe(el: Element | null | undefined): string | undefined {
  if (!el) return undefined;
  const tag = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().slice(0, 40);
  return text ? `<${tag}> "${text}${text.length >= 40 ? "…" : ""}"` : `<${tag}>`;
}

function observe(
  type: string,
  cb: (entries: PerformanceEntry[]) => void,
  extra: Record<string, unknown> = {}
): boolean {
  try {
    const po = new PerformanceObserver((list) => cb(list.getEntries()));
    po.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
    return true;
  } catch {
    return false;
  }
}

export function startVitals() {
  if (started || typeof window === "undefined") return;
  started = true;

  try {
    performance.setResourceTimingBufferSize(1000);
  } catch {
    /* ignore */
  }

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav) emit({ ttfb: nav.responseStart });

  observe("paint", (es) => {
    const fcp = es.find((e) => e.name === "first-contentful-paint");
    if (fcp) emit({ fcp: fcp.startTime });
  });

  const lcpOk = observe("largest-contentful-paint", (es) => {
    const last = es[es.length - 1] as PerformanceEntry & { element?: Element };
    if (last) emit({ lcp: last.startTime, lcpElement: describe(last.element) });
  });

  let sessionValue = 0;
  let sessionFirst = 0;
  let sessionLast = 0;
  let maxSession = 0;
  const clsOk = observe("layout-shift", (es) => {
    for (const e of es as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
      if (e.hadRecentInput) continue;
      if (
        sessionValue > 0 &&
        e.startTime - sessionLast < 1000 &&
        e.startTime - sessionFirst < 5000
      ) {
        sessionValue += e.value;
      } else {
        sessionValue = e.value;
        sessionFirst = e.startTime;
      }
      sessionLast = e.startTime;
      maxSession = Math.max(maxSession, sessionValue);
    }
    emit({ cls: maxSession });
  });

  const seen = new Map<number, number>();
  const inpOk = observe(
    "event",
    (es) => {
      let worst = vitals.inp ?? 0;
      let worstName = vitals.inpEvent;
      for (const e of es as (PerformanceEntry & { interactionId?: number })[]) {
        if (!e.interactionId) continue;
        const prev = seen.get(e.interactionId) ?? 0;
        seen.set(e.interactionId, Math.max(prev, e.duration));
        if (e.duration > worst) {
          worst = e.duration;
          worstName = e.name;
        }
      }
      emit({ inp: seen.size ? worst : undefined, inpEvent: worstName, interactions: seen.size });
    },
    { durationThreshold: 16 }
  );

  emit({ supported: { lcp: lcpOk, cls: clsOk, inp: inpOk } });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const SERVER: Vitals = { cls: 0, interactions: 0, supported: { lcp: false, cls: false, inp: false } };

export function useVitals(): Vitals {
  return useSyncExternalStore(
    subscribe,
    () => vitals,
    () => SERVER
  );
}
