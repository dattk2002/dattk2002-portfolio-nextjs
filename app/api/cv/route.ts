const GOOGLE_DOC_ID = "1TADPEoNptmcp0wyZEzEa29w6VFK7Pu7ZIpWr5NtAw1Q";
const GOOGLE_DOC_EXPORT_URL = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=pdf`;
const DOWNLOAD_FILENAME = "CV-Tran Kim Dat-Full-stack Developer.pdf";
const STATIC_FALLBACK_PATH = "/documents/CV-Tran%20Kim%20Dat-Full-stack%20Developer.pdf";
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

function downloadResponse(pdf: ArrayBuffer, source: "google-docs" | "static-fallback") {
  return new Response(pdf, {
    headers: {
      "Cache-Control": source === "google-docs"
        ? "public, s-maxage=300, stale-while-revalidate=86400"
        : "public, s-maxage=60",
      "Content-Disposition": `attachment; filename="${DOWNLOAD_FILENAME}"`,
      "Content-Length": String(pdf.byteLength),
      "Content-Type": "application/pdf",
      "X-CV-Source": source,
    },
  });
}

export async function GET(request: Request) {
  try {
    const response = await fetch(GOOGLE_DOC_EXPORT_URL, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8_000),
    });

    return downloadResponse(await readPdf(response), "google-docs");
  } catch {
    try {
      const fallbackUrl = new URL(STATIC_FALLBACK_PATH, request.url);
      const response = await fetch(fallbackUrl, { cache: "no-store" });
      return downloadResponse(await readPdf(response), "static-fallback");
    } catch {
      return new Response("CV is temporarily unavailable.", {
        status: 503,
        headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }
}
