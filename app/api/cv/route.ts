import { siteConfig } from "@/lib/site";

const GOOGLE_DOC_ID = "19z7gjVRi23MUoXUkYkHTiIS4djH99BNiekJhvQaFAGs";
const GOOGLE_DOC_EXPORT_URL = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=pdf`;
const DOWNLOAD_FILENAME = siteConfig.cvDownloadName;
const STATIC_FALLBACK_PATH = `/documents/${encodeURIComponent(siteConfig.cvDownloadName)}`;
const MAX_PDF_SIZE = 10 * 1024 * 1024;

async function readPdf(response: Response) {
  if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);

  const declaredSize = Number(response.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_PDF_SIZE) throw new Error("PDF is larger than the export limit");

  const pdf = await response.arrayBuffer();
  if (pdf.byteLength === 0 || pdf.byteLength > MAX_PDF_SIZE) throw new Error("Invalid PDF size");

  const signature = new TextDecoder().decode(pdf.slice(0, 5));
  if (signature !== "%PDF-") throw new Error("Response is not a PDF");

  return pdf;
}

function pdfResponse(pdf: ArrayBuffer, source: "google-docs" | "static-fallback", preview: boolean) {
  return new Response(pdf, {
    headers: {
      "Cache-Control": source === "google-docs"
        ? "public, s-maxage=300, stale-while-revalidate=86400"
        : "public, s-maxage=60",
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${DOWNLOAD_FILENAME}"`,
      "Content-Length": String(pdf.byteLength),
      "Content-Type": "application/pdf",
      "X-CV-Source": source,
    },
  });
}

export async function GET(request: Request) {
  const preview = new URL(request.url).searchParams.get("preview") === "true";

  try {
    const response = await fetch(GOOGLE_DOC_EXPORT_URL, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8_000),
    });

    return pdfResponse(await readPdf(response), "google-docs", preview);
  } catch {
    try {
      const fallbackUrl = new URL(STATIC_FALLBACK_PATH, request.url);
      const response = await fetch(fallbackUrl, { cache: "no-store" });
      return pdfResponse(await readPdf(response), "static-fallback", preview);
    } catch {
      return new Response("CV is temporarily unavailable.", {
        status: 503,
        headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }
}
