"use client";

import { useSyncExternalStore } from "react";

/**
 * Kho lưu các kết quả ĐO THẬT trong phiên thuyết trình (lưu ở sessionStorage).
 * Slide 4.4 "Tổng kết" đọc lại đúng các số này — không có số liệu cố định nào.
 */

export interface RenderSample {
  mode: "bad" | "good";
  ms: number;
  rows: number;
}

export interface Metrics {
  "m1.render": RenderSample[];
  "m1.lazy": { files: number; bytes: number; ms: number; cached: boolean };
  "m2.bundle": { rsc?: number; client?: number };
  "m2.fetch": { seq?: number; par?: number };
  "m2.stream": {
    stream?: { ttfb: number; done: number };
    block?: { ttfb: number; done: number };
  };
  "m2.csr": {
    csr?: { content: number; seo: boolean };
    ssr?: { content: number; seo: boolean };
  };
  "m3.cls": { img?: number; next?: number };
  "m3.image": { original?: number; optimized?: number; format?: string };
  "m4.css": { purged?: number; full?: number };
}

type Key = keyof Metrics;
type State = Partial<Metrics>;

const STORAGE_KEY = "frontend-opt-demo-metrics-v2";
const listeners = new Set<() => void>();
let state: State = {};
let hydratedFromSession = false;

function read(): State {
  return state;
}

export function hydrateMetricsFromSession() {
  if (hydratedFromSession || typeof window === "undefined") return;
  hydratedFromSession = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw) as State;
      listeners.forEach((l) => l());
    }
  } catch {
    /* ignore */
  }
}

function write(next: State) {
  state = next;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function setMetric<K extends Key>(key: K, value: Metrics[K]) {
  write({ ...read(), [key]: value });
}

export function updateMetric<K extends Key>(
  key: K,
  fn: (prev: Metrics[K] | undefined) => Metrics[K]
) {
  const cur = read();
  write({ ...cur, [key]: fn(cur[key]) });
}

export function patchMetric<K extends Key>(key: K, partial: Partial<Metrics[K]>) {
  updateMetric(key, (prev) => ({ ...(prev as object), ...partial }) as Metrics[K]);
}

export function clearMetric(key: Key) {
  const cur = { ...read() };
  delete cur[key];
  write(cur);
}

export function clearAllMetrics() {
  write({});
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const EMPTY_STATE: State = {};

export function useMetric<K extends Key>(key: K): Metrics[K] | undefined {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window !== "undefined" && !hydratedFromSession) {
        queueMicrotask(hydrateMetricsFromSession);
      }
      return subscribe(cb);
    },
    () => read()[key],
    () => EMPTY_STATE[key]
  );
}
