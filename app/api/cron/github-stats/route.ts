import { fetchGithubActivity } from "@/lib/github-activity";
import { saveGithubActivity } from "@/lib/github-activity-store";

export const maxDuration = 60;

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  try {
    // Vercel does not retry failed cron runs. Bound source retries to 3 × 8s.
    let snapshot;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        snapshot = await fetchGithubActivity();
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    if (!snapshot) throw new Error("No GitHub activity snapshot");
    await saveGithubActivity(snapshot);
    return Response.json({ ok: true, syncedAt: snapshot.syncedAt }, { headers });
  } catch {
    return Response.json({ error: "GitHub activity sync failed." }, { status: 503, headers });
  }
}
