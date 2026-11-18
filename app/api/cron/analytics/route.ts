import { pruneAnalytics } from "@/lib/analytics-store";
import { syncGithubTraffic } from "@/lib/github-traffic";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  try {
    await pruneAnalytics();
    const result = await syncGithubTraffic();
    return Response.json({ ok: result.failed === 0, github: result, completedAt: new Date().toISOString() }, { status: result.failed ? 503 : 200, headers });
  } catch {
    return Response.json({ error: "Analytics maintenance failed." }, { status: 503, headers });
  }
}
