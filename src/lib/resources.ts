/**
 * Đọc Resource Timing API của trình duyệt — số liệu thật về các file đã tải.
 * Lưu ý: kích thước dùng đơn vị kB = 1000 byte để khớp với Chrome DevTools.
 */

export type ResType = "js" | "css" | "font" | "img" | "fetch" | "other";

export interface Res {
  name: string;
  file: string;
  type: ResType;
  /** Kích thước sau giải nén (byte) */
  decoded: number;
  /** Kích thước body truyền qua mạng, đã nén nếu có gzip/br (byte) */
  encoded: number;
  /** Tổng byte truyền (0 nếu lấy từ cache) */
  transfer: number;
  start: number;
  end: number;
  duration: number;
  initiator: string;
}

function classify(e: PerformanceResourceTiming): ResType {
  const url = e.name.split("?")[0].toLowerCase();
  if (url.includes("/_next/image")) return "img";
  if (url.endsWith(".js") || e.initiatorType === "script") return "js";
  if (url.endsWith(".css")) return "css";
  if (/\.(woff2?|ttf|otf)$/.test(url)) return "font";
  if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(url) || e.initiatorType === "img") return "img";
  if (e.initiatorType === "fetch" || e.initiatorType === "xmlhttprequest") return "fetch";
  return "other";
}

function shortName(name: string): string {
  try {
    const u = new URL(name);
    const sameOrigin = typeof window !== "undefined" && u.origin === window.location.origin;
    return (sameOrigin ? "" : u.host) + u.pathname;
  } catch {
    return name;
  }
}

export function getResources(win?: Window): Res[] {
  const w = win ?? window;
  const list = w.performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  return list.map((e) => ({
    name: e.name,
    file: shortName(e.name),
    type: classify(e),
    decoded: e.decodedBodySize,
    encoded: e.encodedBodySize,
    transfer: e.transferSize,
    start: e.startTime,
    end: e.responseEnd,
    duration: e.duration,
    initiator: e.initiatorType,
  }));
}

export function sum(list: Res[], key: "decoded" | "encoded" | "transfer"): number {
  return list.reduce((a, r) => a + r[key], 0);
}

export function kb(bytes: number | null | undefined): string {
  if (bytes == null || Number.isNaN(bytes)) return "—";
  if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(2) + " MB";
  return (bytes / 1000).toFixed(1) + " kB";
}

export function ms(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (value < 10) return value.toFixed(2) + " ms";
  return Math.round(value).toLocaleString("vi-VN") + " ms";
}

export function pct(before: number, after: number): string {
  if (!before) return "—";
  const d = ((before - after) / before) * 100;
  return (d >= 0 ? "giảm " : "tăng ") + Math.abs(d).toFixed(1) + "%";
}

export const IS_DEV = process.env.NODE_ENV === "development";
