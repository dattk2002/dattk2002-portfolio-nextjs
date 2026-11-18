import { collectionEnabled, normalizeEvent, readSmallJson, sameOrigin, vietnamDay, visitorHash } from "@/lib/analytics";
import { recordEvent } from "@/lib/analytics-store";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!collectionEnabled()) return new Response(null, { status: 204, headers });
  if (!sameOrigin(request) || request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ error: "Forbidden" }, { status: 403, headers });
  }
  let event;
  try {
    event = normalizeEvent(await readSmallJson(request), request.headers);
  } catch (error) {
    return Response.json({ error: "Invalid analytics event." }, { status: error instanceof RangeError ? 413 : 400, headers });
  }
  if (!event) return new Response(null, { status: 204, headers });
  const day = vietnamDay();
  // Vercel overwrites this header; never retain raw addresses or user agents.
  const ip = (request.headers.get(process.env.VERCEL ? "x-vercel-forwarded-for" : "x-forwarded-for") ?? "").split(",")[0].trim();
  const visitor = visitorHash(ip, request.headers.get("user-agent") ?? "", day, process.env.ANALYTICS_SECRET!);
  try {
    const accepted = await recordEvent({ ...event, day, visitor });
    return new Response(null, { status: accepted ? 204 : 429, headers });
  } catch {
    return Response.json({ error: "Analytics temporarily unavailable." }, { status: 503, headers });
  }
}
