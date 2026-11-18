import { requireAdmin } from "@/lib/auth/admin";
import { parseDays, sameOrigin, toCsv } from "@/lib/analytics";
import { readAnalytics } from "@/lib/analytics-store";
import { syncGithubTraffic } from "@/lib/github-traffic";

export const runtime = "nodejs";
export const maxDuration = 60;
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try { await requireAdmin(); }
  catch { return Response.json({ error: "Unauthorized" }, { status: 401, headers }); }
  const url = new URL(request.url);
  let days;
  try { days = parseDays(url.searchParams.get("days")); }
  catch { return Response.json({ error: "Choose 7, 30, or 90 days." }, { status: 400, headers }); }
  try {
    const report = await readAnalytics(days);
    if (url.searchParams.get("format") !== "csv") return Response.json(report, { headers });
    const rows: (string | number | null)[][] = [["section", "date_or_range", "label", "metric", "value"]];
    for (const row of report.daily) {
      for (const [metric, value] of Object.entries(row)) if (metric !== "day") rows.push(["website (Vietnam time)", row.day, "", metric, value]);
    }
    for (const dimension of ["pages", "referrers", "devices", "browsers", "countries"] as const) {
      for (const row of report[dimension]) rows.push([dimension, `last ${days} days`, row.label, "pageviews", row.count]);
    }
    for (const repo of report.github.repositories) {
      for (const metric of ["views", "visitorDays", "clones", "clonerDays"] as const) rows.push(["GitHub repositories (UTC)", `last ${days} days`, repo.repo, metric, repo[metric]]);
      rows.push(["GitHub sync", "", repo.repo, "last successful sync", repo.syncedAt]);
    }
    return new Response(toCsv(rows), { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="portfolio-analytics-${days}d.csv"`, "X-Content-Type-Options": "nosniff" } });
  } catch {
    return Response.json({ error: "Analytics are temporarily unavailable. Check database configuration and the analytics migration." }, { status: 503, headers });
  }
}

export async function POST(request: Request) {
  try { await requireAdmin(); }
  catch { return Response.json({ error: "Unauthorized" }, { status: 401, headers }); }
  if (!sameOrigin(request)) return Response.json({ error: "Forbidden" }, { status: 403, headers });
  try {
    const result = await syncGithubTraffic();
    return Response.json(result, { status: result.failed ? 503 : 200, headers });
  } catch {
    return Response.json({ error: "GitHub sync failed. Previous successful data is preserved." }, { status: 503, headers });
  }
}
