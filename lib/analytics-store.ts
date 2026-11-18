import { ANALYTICS_DAILY_LIMIT, ANALYTICS_TIME_ZONE, type AnalyticsReport, type Breakdown, type DailyAnalytics, type GithubRepositoryAnalytics } from "@/lib/analytics-shared";
import { collectionEnabled, nextMidnight, vietnamDay, type AnalyticsEvent } from "@/lib/analytics";

// Lazy loading keeps optional analytics configuration from breaking static pages.
async function pool() { return (await import("@/lib/db/index")).databasePool; }

export async function recordEvent(event: AnalyticsEvent) {
  const db = await pool();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    // Acquire the visitor lock before starting the statement that reads its rate.
    // A single CTE would retain a pre-lock MVCC snapshot under concurrent requests.
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [event.visitor ?? "unknown-visitor"]);
    const result = await client.query(`
    WITH budget AS (
      INSERT INTO analytics_budgets (day, events) SELECT $1::date, 1
      WHERE NOT EXISTS (SELECT 1 FROM analytics_events WHERE id = $2::uuid)
        AND (SELECT count(*) FROM analytics_events WHERE visitor IS NOT DISTINCT FROM $3
             AND created_at > now() - interval '1 minute') < 20
      ON CONFLICT (day) DO UPDATE SET events = analytics_budgets.events + 1
        WHERE analytics_budgets.events < $10
      RETURNING day
    )
    INSERT INTO analytics_events (id, day, visitor, kind, path, referrer, device, browser, country)
    SELECT $2::uuid, day, $3, $4, $5, $6, $7, $8, $9 FROM budget
    ON CONFLICT (id) DO NOTHING RETURNING id
  `, [event.day, event.id, event.visitor, event.kind, event.path, event.referrer, event.device, event.browser, event.country, ANALYTICS_DAILY_LIMIT]);
    await client.query("COMMIT");
    return result.rowCount === 1;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

export async function readAnalytics(days: number): Promise<AnalyticsReport> {
  const db = await pool();
  const today = vietnamDay();
  const [dailyResult, breakdownResult, repositories, budget] = await Promise.all([
    db.query<DailyAnalytics>(`
      SELECT to_char(d.day, 'YYYY-MM-DD') AS day,
        count(e.id) FILTER (WHERE e.kind = 'pageview')::int AS pageviews,
        count(DISTINCT e.visitor) FILTER (WHERE e.kind = 'pageview')::int AS visitors,
        count(e.id) FILTER (WHERE e.kind = 'cv_click')::int AS "cvClicks",
        count(e.id) FILTER (WHERE e.kind = 'github_click')::int AS "githubClicks",
        count(e.id) FILTER (WHERE e.kind = 'contact_click')::int AS "contactClicks"
      FROM generate_series($1::date - ($2::int - 1), $1::date, '1 day') AS d(day)
      LEFT JOIN analytics_events e ON e.day = d.day::date
      GROUP BY d.day ORDER BY d.day
    `, [today, days]),
    db.query<Breakdown & { dimension: string }>(`
      WITH counts AS (
        SELECT dimension, label, count(*)::int AS count FROM analytics_events e
        CROSS JOIN LATERAL (VALUES ('pages', e.path), ('referrers', e.referrer),
          ('devices', e.device), ('browsers', e.browser), ('countries', e.country)) AS d(dimension, label)
        WHERE e.day BETWEEN $1::date - ($2::int - 1) AND $1::date AND e.kind = 'pageview'
        GROUP BY dimension, label
      ), ranked AS (SELECT *, row_number() OVER (PARTITION BY dimension ORDER BY count DESC, label) AS rank FROM counts)
      SELECT dimension, label, count FROM ranked WHERE rank <= 20 ORDER BY dimension, count DESC, label
    `, [today, days]),
    db.query<GithubRepositoryAnalytics>(`
      SELECT s.repo, s.synced_at AS "syncedAt", s.attempted_at AS "attemptedAt", s.failed,
        coalesce(sum(t.views), 0)::int AS views, coalesce(sum(t.visitors), 0)::int AS "visitorDays",
        coalesce(sum(t.clones), 0)::int AS clones, coalesce(sum(t.cloners), 0)::int AS "clonerDays"
      FROM github_traffic_syncs s LEFT JOIN github_traffic_daily t ON t.repo = s.repo
        AND t.day BETWEEN (now() AT TIME ZONE 'UTC')::date - ($1::int - 1) AND (now() AT TIME ZONE 'UTC')::date
      GROUP BY s.repo ORDER BY s.repo
    `, [days]),
    db.query<{ events: number }>("SELECT events FROM analytics_budgets WHERE day = $1::date", [today]),
  ]);
  const breakdown = (dimension: string) => breakdownResult.rows.filter(row => row.dimension === dimension).map(({ label, count }) => ({ label, count }));
  return {
    generatedAt: new Date().toISOString(), days, timeZone: ANALYTICS_TIME_ZONE, nextResetAt: nextMidnight(),
    collectionEnabled: collectionEnabled(), dailyLimit: ANALYTICS_DAILY_LIMIT, todayCollected: budget.rows[0]?.events ?? 0,
    daily: dailyResult.rows,
    totals: dailyResult.rows.reduce((a, row) => ({ pageviews: a.pageviews + row.pageviews, visitors: a.visitors + row.visitors, cvClicks: a.cvClicks + row.cvClicks, githubClicks: a.githubClicks + row.githubClicks, contactClicks: a.contactClicks + row.contactClicks }), { pageviews: 0, visitors: 0, cvClicks: 0, githubClicks: 0, contactClicks: 0 }),
    pages: breakdown("pages"), referrers: breakdown("referrers"), devices: breakdown("devices"), browsers: breakdown("browsers"), countries: breakdown("countries"),
    github: { configured: !!process.env.GITHUB_TRAFFIC_TOKEN && !!process.env.GITHUB_TRAFFIC_REPOS, repositories: repositories.rows, nextSyncAt: nextMidnight() },
  };
}

export async function pruneAnalytics() {
  const db = await pool();
  // Preserve 90 calendar days, including today. Repeated maintenance is harmless.
  await db.query("DELETE FROM analytics_events WHERE day < $1::date - 89", [vietnamDay()]);
  await db.query("DELETE FROM analytics_budgets WHERE day < $1::date - 89", [vietnamDay()]);
  await db.query("DELETE FROM github_traffic_daily WHERE day < (now() AT TIME ZONE 'UTC')::date - 89");
}
