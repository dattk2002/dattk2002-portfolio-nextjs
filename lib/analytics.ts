import { createHmac } from "node:crypto";
import { z } from "zod";

import { ANALYTICS_TIME_ZONE, eventKinds, isTrackablePath } from "@/lib/analytics-shared";

export function vietnamDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ANALYTICS_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function nextMidnight(now = new Date()) {
  const midnight = new Date(`${vietnamDay(now)}T00:00:00+07:00`);
  return new Date(midnight.getTime() + 86_400_000).toISOString();
}

export function collectionEnabled() {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && (process.env.ANALYTICS_SECRET?.length ?? 0) >= 32;
}

export function sameOrigin(request: Request) {
  // Next may reconstruct request.url with localhost while retaining the public Host.
  const url = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-proto");
  const protocol = forwarded === "https" || forwarded === "http" ? `${forwarded}:` : url.protocol;
  return request.headers.get("origin") === `${protocol}//${request.headers.get("host") ?? url.host}`;
}

export function visitorHash(ip: string, agent: string, day: string, secret: string) {
  if (!ip) return null;
  return createHmac("sha256", secret).update(JSON.stringify([day, ip.slice(0, 64), agent.slice(0, 512)])).digest("hex");
}

const eventSchema = z.object({
  id: z.uuid(), kind: z.enum(eventKinds), path: z.string().max(500), referrer: z.string().max(1000).optional(),
}).strict();

export function normalizeEvent(input: unknown, headers: Headers) {
  const agent = headers.get("user-agent") ?? "";
  if (headers.get("dnt") === "1" || headers.get("sec-gpc") === "1" || /bot|crawler|spider|headless|preview|lighthouse/i.test(agent) || headers.get("purpose") === "prefetch" || headers.get("sec-purpose")?.includes("prefetch")) return null;
  const value = eventSchema.parse(input);
  const path = value.path.split(/[?#]/, 1)[0];
  if (!isTrackablePath(path)) throw new Error("Invalid path");
  let referrer = "Direct / unknown";
  try {
    const url = new URL(value.referrer ?? "");
    if (/^https?:$/.test(url.protocol)) referrer = url.hostname.replace(/^www\./, "").slice(0, 200);
  } catch { /* Missing or suppressed referrer stays unknown. */ }
  const device = /ipad|tablet/i.test(agent) ? "Tablet" : /mobile|iphone|android/i.test(agent) ? "Mobile" : agent ? "Desktop" : "Unknown";
  const browser = /edg\//i.test(agent) ? "Edge" : /firefox|fxios/i.test(agent) ? "Firefox" : /chrome|crios/i.test(agent) ? "Chrome" : /safari/i.test(agent) ? "Safari" : "Other";
  const country = headers.get("x-vercel-ip-country") ?? "";
  return { id: value.id, kind: value.kind, path, referrer, device, browser, country: /^[A-Z]{2}$/.test(country) ? country : "Unknown" };
}

export type AnalyticsEvent = NonNullable<ReturnType<typeof normalizeEvent>> & {
  day: string; visitor: string | null;
};

export function parseDays(value: string | null): 7 | 30 | 90 {
  if (value === null) return 7;
  if (value === "7" || value === "30" || value === "90") return Number(value) as 7 | 30 | 90;
  throw new Error("Invalid range");
}

export function toCsv(rows: (string | number | null)[][]) {
  return "\uFEFF" + rows.map(row => row.map(value => {
    let cell = String(value ?? "");
    if (/^[\s\u0000-\u001f]*[=+@-]/.test(cell) || /^[\t\r]/.test(cell)) cell = `'${cell}`;
    return `"${cell.replaceAll('"', '""')}"`;
  }).join(",")).join("\r\n") + "\r\n";
}

export async function readSmallJson(request: Request) {
  if (Number(request.headers.get("content-length")) > 2048) throw new RangeError("Body too large");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 2048) { await reader.cancel(); throw new RangeError("Body too large"); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}
