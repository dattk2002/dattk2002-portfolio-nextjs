INSERT INTO "blog_posts" (
	"id",
	"cover_image_url",
	"featured",
	"created_at",
	"updated_at"
) VALUES (
	'6a1f4c52-bdc8-4d31-9526-c8ee5b5aa120',
	'/images/blog/resilient-document-delivery-cover.webp',
	false,
	'2026-10-13T23:30:00+07:00',
	'2026-10-13T23:30:00+07:00'
)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "blog_post_translations" (
	"id",
	"post_id",
	"locale",
	"slug",
	"title",
	"excerpt",
	"content",
	"cover_image_alt",
	"seo_title",
	"seo_description",
	"status",
	"published_at",
	"created_at",
	"updated_at"
) VALUES (
	'5511f1fa-8946-4dfa-91ab-5157e11d2a54',
	'6a1f4c52-bdc8-4d31-9526-c8ee5b5aa120',
	'en',
	'resilient-document-download-nextjs',
	'Building a Resilient Document Download Route in Next.js',
	'How to proxy a remote document safely in Next.js with a bounded fetch, byte-level PDF validation, deliberate caching, and a static fallback.',
	$content$
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "A download link looks like one of the simplest features on a website. In production, it can depend on a remote document service, network latency, correct file bytes, browser download behavior, cache freshness, and a useful failure path. A plain redirect pushes all of those concerns onto the visitor." }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "The CV endpoint in this portfolio takes a different approach. A Next.js Route Handler acts as a small reliability boundary: it fetches the current document, rejects suspicious responses, serves a bundled PDF when the upstream source fails, and returns one stable download contract to the browser." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Start with the response contract" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Implementation choices become clearer when the route contract is explicit. A successful request must return a valid PDF, a stable filename, the correct content type, and a truthful content length. If neither source can satisfy that contract, the route returns a short 503 response instead of forwarding an upstream error page as if it were a document." }]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              { "type": "text", "marks": [{ "type": "bold" }], "text": "Primary outcome: " },
              { "type": "text", "text": "serve the latest validated PDF from the remote source." }
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              { "type": "text", "marks": [{ "type": "bold" }], "text": "Degraded outcome: " },
              { "type": "text", "text": "serve a validated PDF bundled with the deployment." }
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              { "type": "text", "marks": [{ "type": "bold" }], "text": "Unavailable outcome: " },
              { "type": "text", "text": "return 503 with no-store caching and no upstream implementation details." }
            ]
          }]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Put remote work behind a deadline" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "A route that waits indefinitely for an upstream export is not resilient. The browser is waiting, the server invocation remains occupied, and the fallback never gets a chance to run. The primary fetch uses an eight-second AbortSignal timeout so control returns to the application within a known window." }]
    },
    {
      "type": "codeBlock",
      "content": [{ "type": "text", "text": "const response = await fetch(remoteExportUrl, {\n  next: { revalidate: 300 },\n  signal: AbortSignal.timeout(8_000),\n});" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Eight seconds is a product decision, not a universal constant. It is long enough for the normal export path while still leaving room for the local fallback. The important design property is that the limit is explicit, observable, and shorter than the platform's own execution ceiling." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Validate the bytes before trusting the response" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "A 200 status does not prove that the payload is a PDF. Authentication pages, quota notices, and provider error pages can all arrive as successful HTML responses. The route validates both the delivery envelope and the file itself before sending anything to the visitor." }]
    },
    {
      "type": "orderedList",
      "content": [
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Reject non-success HTTP responses." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Reject a declared content length above the 10 MB limit before buffering." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Buffer the payload and reject empty or oversized content even when the header is missing or inaccurate." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Check that the first five bytes contain the PDF signature %PDF-." }] }]
        }
      ]
    },
    {
      "type": "codeBlock",
      "content": [{ "type": "text", "text": "const pdf = await response.arrayBuffer();\nif (pdf.byteLength === 0 || pdf.byteLength > MAX_PDF_SIZE) {\n  throw new Error(\"Invalid PDF size\");\n}\n\nconst signature = new TextDecoder().decode(pdf.slice(0, 5));\nif (signature !== \"%PDF-\") {\n  throw new Error(\"Response is not a PDF\");\n}" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "The signature check is intentionally small. It does not prove that every object inside the PDF is well formed, but it prevents the most common failure mode: returning a completely different document type under a PDF filename. The size limit also bounds memory use because the route buffers the file before responding." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Make the fallback independent" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "A useful fallback should not depend on the same service, credential, or failure mode as the primary path. This route keeps a PDF in the application's public assets, fetches it from the current deployment origin, and runs it through the same validation function as the remote export." }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Reusing one validator keeps the success contract identical across both sources. It also catches packaging mistakes during verification: a missing, empty, oversized, or corrupted fallback cannot silently pass just because it is local." }]
    },
    {
      "type": "blockquote",
      "content": [{
        "type": "paragraph",
        "content": [{ "type": "text", "text": "A fallback is part of the product path. Validate it with the same care as the primary source." }]
      }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Treat response headers as product behavior" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "The route normalizes both sources into the same browser-facing response. Content-Type identifies the payload as a PDF. Content-Disposition turns navigation into a download with a filename taken from the central site configuration. Content-Length reflects the bytes that were actually validated." }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "A small diagnostic header records whether the response came from the remote document or the static fallback. That makes production checks easier without exposing the source URL, document identifier, credentials, or raw upstream error to the page." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Cache each outcome deliberately" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "The current document changes occasionally, so a successful primary response can be shared briefly. The route uses a five-minute shared-cache lifetime and allows stale content while the cache revalidates in the background. The static fallback receives a shorter shared-cache lifetime so the primary source can recover quickly." }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "The 503 response uses no-store. Caching a transient total failure would extend the outage even after one of the sources recovered. Cache policy belongs to the outcome, not just the URL." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Model the failure matrix" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Nested try/catch blocks are acceptable here because they map directly to a small failure matrix. Keeping the matrix explicit makes the route easier to review and test:" }]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Remote source succeeds and validates: return the current PDF." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Remote source times out, fails, or returns invalid bytes: attempt the static PDF." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Static PDF succeeds and validates: return the degraded but usable response." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Both sources fail validation: return a plain 503 and reveal no internal error details." }] }]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Verify the unhappy paths" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "A happy-path download only proves that the upstream service worked once. The useful verification set covers a valid remote PDF, a non-success upstream status, a timeout, an oversized declared response, oversized actual bytes, a wrong file signature, a missing fallback, a corrupted fallback, and total failure." }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "For every successful case, inspect the downloaded filename, content type, byte count, cache policy, and source header. For the failure case, confirm the 503 status, generic message, and no-store policy. This checks the entire delivery contract instead of only the fetch call." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Small endpoint, complete reliability boundary" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "The final route is short because each responsibility is narrow: bound the external request, validate the payload, normalize the response, and degrade to an independent local asset. That pattern applies beyond CVs to reports, certificates, invoices, exports, and any other file that must remain available when an upstream source is imperfect." }]
    }
  ]
}
	$content$::jsonb,
	'Diagram of a browser request routed to a cloud document source with validation, timeout, and secure local fallback paths',
	'Resilient Document Downloads in Next.js',
	'Build a resilient Next.js download route with timeouts, byte-level PDF validation, deliberate cache headers, and an independent static fallback.',
	'published',
	'2026-10-13T23:30:00+07:00',
	'2026-10-13T23:30:00+07:00',
	'2026-10-13T23:30:00+07:00'
)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "blog_tags" ("slug", "label") VALUES
	('architecture', 'architecture'),
	('nextjs', 'nextjs'),
	('reliability', 'reliability'),
	('security', 'security')
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint
INSERT INTO "blog_post_tags" ("post_id", "tag_id")
SELECT
	'6a1f4c52-bdc8-4d31-9526-c8ee5b5aa120',
	"id"
FROM "blog_tags"
WHERE "slug" IN ('architecture', 'nextjs', 'reliability', 'security')
ON CONFLICT DO NOTHING;
