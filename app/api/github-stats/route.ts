import { readGithubActivity } from "@/lib/github-activity-store";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    const snapshot = await readGithubActivity();
    if (!snapshot) throw new Error("GitHub activity has not been initialized");
    // Allow the scheduler's one-hour Hobby invocation window before marking late.
    const stale = Date.now() >= Date.parse(snapshot.nextSyncAt) + 60 * 60 * 1_000;
    return Response.json({ ...snapshot, stale }, { headers });
  } catch {
    return Response.json(
      { error: "GitHub activity is temporarily unavailable." },
      { status: 503, headers },
    );
  }
}
