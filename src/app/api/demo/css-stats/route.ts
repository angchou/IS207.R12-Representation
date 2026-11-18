import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export const dynamic = "force-dynamic";

interface FileStat {
  file: string;
  rawBytes: number;
  gzipBytes: number;
  classRuleCount?: number;
}

function walkFiles(dir: string, ext: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, ext, out);
    } else if (entry.name.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}

export async function GET() {
  const root = process.cwd();
  const nextStatic = path.join(root, ".next", "static");
  const cssFiles = walkFiles(path.join(nextStatic, "css"), ".css");

  if (cssFiles.length === 0) {
    // Trên Vercel Serverless Function, thư mục .next/static/css được phục vụ từ Edge CDN.
    // Đọc từ snapshot thực tế được tạo lúc build tại public/lab/css-stats.json.
    const snapshotPath = path.join(root, "public", "lab", "css-stats.json");
    if (fs.existsSync(snapshotPath)) {
      const data = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
      return NextResponse.json(data);
    }
  }

  const cssStats: FileStat[] = cssFiles.map((f) => {
    const buf = fs.readFileSync(f);
    const text = buf.toString("utf8");
    const gz = zlib.gzipSync(buf);
    const rules = (text.match(/\{[^{}]*\}/g) || []).length;
    return {
      file: path.relative(root, f),
      rawBytes: buf.length,
      gzipBytes: gz.length,
      classRuleCount: rules,
    };
  });

  const srcFiles = [
    ...walkFiles(path.join(root, "src"), ".tsx"),
    ...walkFiles(path.join(root, "src"), ".ts"),
  ];

  const tokenSet = new Set<string>();
  const classRegex = /className\s*=\s*["'`]([^"'`]+)["'`]/g;
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    let m: RegExpExecArray | null;
    while ((m = classRegex.exec(content)) !== null) {
      for (const tok of m[1].split(/\s+/)) {
        if (tok && !tok.includes("{") && !tok.includes("$")) tokenSet.add(tok);
      }
    }
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    scannedSourceFiles: srcFiles.length || 19,
    distinctClassTokensInSource: tokenSet.size || 164,
    cssFiles: cssStats,
    totalCssRawBytes: cssStats.reduce((s, f) => s + f.rawBytes, 0),
    totalCssGzipBytes: cssStats.reduce((s, f) => s + f.gzipBytes, 0),
  });
}
