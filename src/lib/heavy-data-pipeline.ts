import { parse } from "@babel/parser";
import * as t from "@babel/types";
import {
  format,
  formatDistanceToNow,
  parseISO,
  subDays,
  subHours,
} from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";

/**
 * Tác vụ nặng dùng chung cho cả /rsc-demo (Server Component) và /client-demo ("use client"):
 * 1. Dùng `@babel/parser` + `@babel/types` để parse AST & tokenize thật các khối code TypeScript/JSX
 *     nhằm thực hiện Syntax Highlighting chuẩn xác theo từng AST token (~500 KB thư viện parser).
 * 2. Dùng `zod` với schema lồng nhau để parse & validate thật danh sách 600 bản ghi kiểm toán hệ thống.
 * 3. Dùng `date-fns` (kèm locale Tiếng Việt) để tính toán và định dạng mốc thời gian của 600 bản ghi.
 *
 * - Khi chạy ở `/rsc-demo` (Server Component): Toàn bộ `@babel/parser`, `@babel/types`, `zod`, `date-fns`
 *   chạy trên Node.js Server và gửi **0 kB** mã nguồn thư viện xuống trình duyệt.
 * - Khi chạy ở `/client-demo` (`"use client"`): Trình duyệt buộc phải tải toàn bộ các thư viện nặng này
 *   trong JS bundle của client (+600–800 kB JS giải nén).
 */

export interface HighlightToken {
  text: string;
  kind: "keyword" | "string" | "number" | "comment" | "jsx" | "punct" | "ident";
}

export interface CodeExampleResult {
  id: string;
  title: string;
  astNodeCount: number;
  tokenCount: number;
  tokens: HighlightToken[];
}

const CODE_SNIPPETS: Array<{ id: string; title: string; code: string }> = [
  {
    id: "rsc-pipeline",
    title: "1. Server Component Data & AST Pipeline (TypeScript + JSX)",
    code: `// Async Server Component chạy hoàn toàn trên Server (0 kB JS xuống Client)
export async function ProductAnalyticsRSC({ categoryId }: { categoryId: string }) {
  const [items, metrics] = await Promise.all([
    db.product.findMany({ where: { categoryId, active: true }, take: 500 }),
    cache.getCategoryMetrics(categoryId, { revalidate: 60 }),
  ]);

  const totalRevenue = items.reduce((sum, item) => sum + item.price * item.sold, 0);
  return (
    <section className="border border-neutral-800 bg-neutral-950 p-4">
      <h2>Doanh thu danh mục: {totalRevenue.toLocaleString("vi-VN")} đ</h2>
      <MetricsSummaryTable rows={items} ttfbMs={metrics.ttfbMs} />
    </section>
  );
}`,
  },
  {
    id: "zod-schema-validator",
    title: "2. Schema Validation & Cache Revalidation Action",
    code: `"use server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const PriceUpdateSchema = z.object({
  sku: z.string().regex(/^SP-\\d{4}$/),
  newPrice: z.number().int().min(100000).max(500000000),
  updatedBy: z.string().email(),
  tags: z.array(z.enum(["flash-sale", "enterprise", "featured"])).min(1),
});

export async function updateProductPriceAction(rawInput: unknown) {
  const payload = PriceUpdateSchema.parse(rawInput);
  await db.product.update({ where: { sku: payload.sku }, data: { price: payload.newPrice } });
  revalidateTag("demo-isr-product");
  return { ok: true, sku: payload.sku, at: new Date().toISOString() };
}`,
  },
];

const JS_KEYWORDS = new Set([
  "async",
  "await",
  "const",
  "let",
  "var",
  "function",
  "return",
  "export",
  "import",
  "from",
  "type",
  "interface",
  "true",
  "false",
  "new",
]);

function highlightCodeWithBabelAst(code: string): {
  tokens: HighlightToken[];
  astNodeCount: number;
  tokenCount: number;
} {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    tokens: true,
  });

  // Đếm tổng số AST node bằng @babel/types visitor keys
  let astNodeCount = 0;
  function walkNode(node: unknown) {
    if (!node || typeof node !== "object") return;
    const n = node as t.Node;
    if (typeof n.type === "string" && t.VISITOR_KEYS[n.type]) {
      astNodeCount += 1;
      for (const key of t.VISITOR_KEYS[n.type]) {
        const child = (n as unknown as Record<string, unknown>)[key];
        if (Array.isArray(child)) {
          child.forEach(walkNode);
        } else if (child && typeof child === "object") {
          walkNode(child);
        }
      }
    }
  }
  walkNode(ast.program);

  const rawTokens = (ast.tokens ?? []) as Array<{
    type: { label: string; keyword?: string };
    start: number;
    end: number;
  }>;

  const segments: HighlightToken[] = [];
  let cursor = 0;

  for (const tok of rawTokens) {
    if (tok.start > cursor) {
      const gap = code.slice(cursor, tok.start);
      const isComment = gap.trim().startsWith("//") || gap.trim().startsWith("/*");
      segments.push({
        text: gap,
        kind: isComment ? "comment" : "punct",
      });
    }
    const text = code.slice(tok.start, tok.end);
    const label = tok.type?.label ?? "";
    let kind: HighlightToken["kind"] = "ident";

    if (tok.type?.keyword || JS_KEYWORDS.has(text)) {
      kind = "keyword";
    } else if (label === "string" || label === "template") {
      kind = "string";
    } else if (label === "num" || label === "regexp") {
      kind = "number";
    } else if (label.startsWith("jsx")) {
      kind = "jsx";
    } else if (/^[{}()[\].,:;=<>/+-]+$/.test(text)) {
      kind = "punct";
    }

    segments.push({ text, kind });
    cursor = tok.end;
  }

  if (cursor < code.length) {
    segments.push({ text: code.slice(cursor), kind: "punct" });
  }

  return {
    tokens: segments,
    astNodeCount,
    tokenCount: rawTokens.length,
  };
}

/**
 * Schema Zod lồng nhau phức tạp để validate 600 bản ghi kiểm toán hiệu năng
 */
const AuditRecordSchema = z.object({
  id: z.string().regex(/^AUD-\d{4}$/),
  service: z.enum(["edge-gateway", "rsc-renderer", "image-optimizer", "isr-cache", "auth-worker"]),
  region: z.enum(["ap-southeast-1", "us-east-1", "eu-central-1", "ap-northeast-1"]),
  status: z.enum(["OK", "WARN", "CRITICAL"]),
  createdAtIso: z.string(),
  metrics: z.object({
    ttfbMs: z.number().min(1).max(5000),
    cpuMs: z.number().min(0.1).max(2000),
    payloadBytes: z.number().int().min(100).max(10_000_000),
  }),
  tags: z.array(z.string()).min(2),
});

export type ValidatedAuditRecord = z.infer<typeof AuditRecordSchema> & {
  formattedDate: string;
  relativeTime: string;
};

const SERVICES = [
  "edge-gateway",
  "rsc-renderer",
  "image-optimizer",
  "isr-cache",
  "auth-worker",
] as const;
const REGIONS = ["ap-southeast-1", "us-east-1", "eu-central-1", "ap-northeast-1"] as const;
const STATUSES = ["OK", "OK", "OK", "WARN", "CRITICAL"] as const;

export interface HeavyPipelineOutput {
  totalValidatedRecords: number;
  totalAstNodes: number;
  totalAstTokens: number;
  computeTimeMs: number;
  codeExamples: CodeExampleResult[];
  sampleRecords: ValidatedAuditRecord[];
  statusBreakdown: { OK: number; WARN: number; CRITICAL: number };
}

export function runHeavyAuditAndAstPipeline(recordCount = 600): HeavyPipelineOutput {
  const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  const anchorDate = parseISO("2025-05-15T09:30:00.000Z");

  // 1. Parse AST & Syntax Highlighting bằng @babel/parser + @babel/types
  const codeExamples: CodeExampleResult[] = CODE_SNIPPETS.map((snip) => {
    const res = highlightCodeWithBabelAst(snip.code);
    return {
      id: snip.id,
      title: snip.title,
      astNodeCount: res.astNodeCount,
      tokenCount: res.tokenCount,
      tokens: res.tokens,
    };
  });

  // 2. Sinh & Validate thật 600 bản ghi qua Zod Schema + Format ngày bằng date-fns
  const rawRecords = Array.from({ length: recordCount }, (_, i) => {
    const createdDate = subHours(subDays(anchorDate, i % 30), i % 24);
    return {
      id: `AUD-${String(i + 1).padStart(4, "0")}`,
      service: SERVICES[i % SERVICES.length],
      region: REGIONS[(i * 3) % REGIONS.length],
      status: STATUSES[(i * 7) % STATUSES.length],
      createdAtIso: createdDate.toISOString(),
      metrics: {
        ttfbMs: 8 + ((i * 17) % 420),
        cpuMs: Number((0.4 + ((i * 13) % 90) * 0.35).toFixed(2)),
        payloadBytes: 1200 + ((i * 4096) % 380000),
      },
      tags: ["nextjs-15", SERVICES[i % SERVICES.length], REGIONS[(i * 3) % REGIONS.length]],
    };
  });

  const parsedRecords = z.array(AuditRecordSchema).parse(rawRecords);

  const statusBreakdown = { OK: 0, WARN: 0, CRITICAL: 0 };
  const enriched: ValidatedAuditRecord[] = parsedRecords.map((rec) => {
    statusBreakdown[rec.status] += 1;
    const d = parseISO(rec.createdAtIso);
    return {
      ...rec,
      formattedDate: format(d, "HH:mm dd/MM/yyyy", { locale: vi }),
      relativeTime: formatDistanceToNow(d, {
        addSuffix: true,
        locale: vi,
      }),
    };
  });

  const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();

  return {
    totalValidatedRecords: enriched.length,
    totalAstNodes: codeExamples.reduce((s, c) => s + c.astNodeCount, 0),
    totalAstTokens: codeExamples.reduce((s, c) => s + c.tokenCount, 0),
    computeTimeMs: Number((t1 - t0).toFixed(2)),
    codeExamples,
    sampleRecords: enriched.slice(0, 18),
    statusBreakdown,
  };
}
