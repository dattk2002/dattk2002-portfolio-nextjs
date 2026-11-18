import { z } from "zod";

export function trafficRepositories(value = process.env.GITHUB_TRAFFIC_REPOS ?? "") {
  const repos = [...new Set(value.split(",").map(repo => repo.trim()).filter(Boolean))];
  if (repos.length > 10 || repos.some(repo => !/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(repo) || repo.split("/")[1].startsWith("."))) throw new Error("Invalid repository configuration");
  return repos;
}

const entrySchema = z.object({
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T00:00:00Z$/),
  count: z.number().int().nonnegative(), uniques: z.number().int().nonnegative(),
}).refine(row => row.uniques <= row.count && !Number.isNaN(Date.parse(row.timestamp)) && new Date(row.timestamp).toISOString().slice(0, 10) === row.timestamp.slice(0, 10));
const countSchema = z.object({ count: z.number().int().nonnegative(), uniques: z.number().int().nonnegative() });
export type TrafficDay = { day: string; views: number; visitors: number; clones: number; cloners: number };

function trafficWindow(now: Date) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return { start: end.getTime() - 14 * 86_400_000, end: end.getTime() };
}

export async function fetchRepositoryTraffic(repo: string, token: string, now = new Date()): Promise<TrafficDay[]> {
  if (trafficRepositories(repo).length !== 1) throw new Error("Invalid repository");
  const window = trafficWindow(now);
  const get = async (metric: "views" | "clones") => {
    const response = await fetch(`https://api.github.com/repos/${repo}/traffic/${metric}?per=day`, {
      cache: "no-store", signal: AbortSignal.timeout(5_000), redirect: "error",
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2026-03-10" },
    });
    if (!response.ok) throw new Error("GitHub traffic unavailable");
    // GitHub documents an inclusive 14-day interval: up to 15 UTC date buckets.
    const schema = countSchema.extend({ [metric]: z.array(entrySchema).max(15) });
    const body = schema.parse(await response.json());
    const entries = body[metric] as z.infer<typeof entrySchema>[];
    if (new Set(entries.map(entry => entry.timestamp)).size !== entries.length) throw new Error("Duplicate traffic dates");
    if (entries.some(entry => Date.parse(entry.timestamp) < window.start || Date.parse(entry.timestamp) > window.end)) throw new Error("Traffic outside source window");
    return entries;
  };
  const [views, clones] = await Promise.all([get("views"), get("clones")]);
  const byDay = new Map<string, TrafficDay>();
  for (const [metric, entries] of [["views", views], ["clones", clones]] as const) {
    for (const entry of entries) {
      const day = entry.timestamp.slice(0, 10);
      const row = byDay.get(day) ?? { day, views: 0, visitors: 0, clones: 0, cloners: 0 };
      if (metric === "views") { row.views = entry.count; row.visitors = entry.uniques; }
      else { row.clones = entry.count; row.cloners = entry.uniques; }
      byDay.set(day, row);
    }
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}

export async function syncGithubTraffic() {
  const token = process.env.GITHUB_TRAFFIC_TOKEN;
  const repos = trafficRepositories();
  if (!token || repos.length === 0) return { configured: false, skipped: true, failed: 0 };
  const { databasePool: db } = await import("@/lib/db/index");
  // A shared database lease bounds manual refreshes and overlapping cron runs.
  const lease = await db.query(`INSERT INTO analytics_jobs (name, started_at) VALUES ('github-traffic', now())
    ON CONFLICT (name) DO UPDATE SET started_at = now()
    WHERE analytics_jobs.started_at < now() - interval '5 minutes' RETURNING name`);
  if (!lease.rowCount) return { configured: true, skipped: true, failed: 0 };
  let failed = 0;
  // At most 10 repositories; three per batch keeps source and database work bounded.
  for (let offset = 0; offset < repos.length; offset += 3) {
    const results = await Promise.allSettled(repos.slice(offset, offset + 3).map(async repo => {
      const attemptedAt = new Date();
      try {
        const rows = await fetchRepositoryTraffic(repo, token, attemptedAt);
        const window = trafficWindow(attemptedAt);
        const client = await db.connect();
        try {
          await client.query("BEGIN");
          // Replace the source's rolling window so missing/zero days cannot retain old counts.
          await client.query("DELETE FROM github_traffic_daily WHERE repo = $1 AND day BETWEEN $2::date AND $3::date", [repo, new Date(window.start).toISOString().slice(0, 10), new Date(window.end).toISOString().slice(0, 10)]);
          if (rows.length) await client.query(`INSERT INTO github_traffic_daily (repo, day, views, visitors, clones, cloners)
            SELECT $1, x.day::date, x.views, x.visitors, x.clones, x.cloners
            FROM jsonb_to_recordset($2::jsonb) AS x(day text, views integer, visitors integer, clones integer, cloners integer)
            ON CONFLICT (repo, day) DO UPDATE SET views = excluded.views, visitors = excluded.visitors, clones = excluded.clones, cloners = excluded.cloners`, [repo, JSON.stringify(rows)]);
          await client.query(`INSERT INTO github_traffic_syncs (repo, synced_at, attempted_at, failed) VALUES ($1, now(), $2, false)
            ON CONFLICT (repo) DO UPDATE SET synced_at = now(), attempted_at = excluded.attempted_at, failed = false`, [repo, attemptedAt]);
          await client.query("COMMIT");
        } catch (error) { await client.query("ROLLBACK"); throw error; }
        finally { client.release(); }
      } catch {
        await db.query(`INSERT INTO github_traffic_syncs (repo, attempted_at, failed) VALUES ($1, $2, true)
          ON CONFLICT (repo) DO UPDATE SET attempted_at = excluded.attempted_at, failed = true`, [repo, attemptedAt]);
        throw new Error("Repository traffic sync failed");
      }
    }));
    failed += results.filter(result => result.status === "rejected").length;
  }
  return { configured: true, skipped: false, failed };
}
