import { readFile } from "node:fs/promises";
import path from "node:path";

import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

const PDF_PATH = path.join(process.cwd(), "public", "documents", siteConfig.cvDownloadName);
const MAX_PDF_SIZE = 10 * 1024 * 1024;

export async function GET(request: Request) {
  const preview = new URL(request.url).searchParams.get("preview") === "true";

  try {
    const pdf = await readFile(PDF_PATH);
    if (pdf.byteLength === 0 || pdf.byteLength > MAX_PDF_SIZE || pdf.subarray(0, 5).toString() !== "%PDF-") {
      throw new Error("Invalid bundled PDF");
    }

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${siteConfig.cvDownloadName}"`,
        "Content-Length": String(pdf.byteLength),
        "Content-Type": "application/pdf",
        "X-CV-Source": "bundled-pdf",
      },
    });
  } catch {
    return new Response("CV is temporarily unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
