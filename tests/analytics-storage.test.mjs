// Optional real Postgres checks. Only a disposable loopback database on port 55438 is accepted.
// TEST_ANALYTICS_DATABASE_URL=postgresql://postgres@127.0.0.1:55438/postgres corepack yarn test
import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import test, { mock } from "node:test";
import { Pool } from "pg";

const url = process.env.TEST_ANALYTICS_DATABASE_URL;
test("disposable PostgreSQL analytics storage and sync integration", { skip: !url }, async t => {
  const parsed = new URL(url);
  assert.ok(["127.0.0.1", "localhost"].includes(parsed.hostname) && parsed.port === "55438", "Refusing a non-disposable database target");
  const schema = `analytics_test_${randomUUID().replaceAll("-", "")}`;
  const pool = new Pool({ connectionString: url, options: `-c search_path=${schema}`, max: 5 });
  await pool.query(`CREATE SCHEMA ${schema}`);
  t.after(async () => { await pool.query(`DROP SCHEMA ${schema} CASCADE`); await pool.end(); });
  const sql = await readFile(new URL("../drizzle/0003_portfolio_analytics.sql", import.meta.url), "utf8");
  await pool.query(sql); await pool.query(sql); // Scoped migration is safely repeatable.
  mock.module(new URL("../lib/db/index.ts", import.meta.url).href, { exports: { databasePool: pool } });
  const { recordEvent, readAnalytics, pruneAnalytics } = await import("../lib/analytics-store.ts");
  const { vietnamDay } = await import("../lib/analytics.ts");
  const { syncGithubTraffic } = await import("../lib/github-traffic.ts");
  const today = vietnamDay();
  const event = (patch = {}) => ({ id: randomUUID(), day: today, visitor: "daily-anonymous-test-hash", kind: "pageview", path: "/", referrer: "Direct / unknown", device: "Desktop", browser: "Chrome", country: "Unknown", ...patch });

  await t.test("duplicate collection does not increase counters and readers see new events immediately", async () => {
    const first = event();
    assert.equal(await recordEvent(first), true);
    assert.equal(await recordEvent(first), false);
    await recordEvent(event({ kind: "cv_click" }));
    const report = await readAnalytics(7);
    assert.equal(report.daily.length, 7);
    assert.equal(report.totals.pageviews, 1); assert.equal(report.totals.visitors, 1); assert.equal(report.totals.cvClicks, 1);
    assert.equal(report.todayCollected, 2);
    assert.deepEqual(report.pages, [{ label: "/", count: 1 }]);
  });
  await t.test("concurrent requests cannot exceed the daily storage budget", async () => {
    await pool.query("UPDATE analytics_budgets SET events = 1999 WHERE day = $1", [today]);
    const results = await Promise.all(Array.from({ length: 15 }, (_, i) => recordEvent(event({ visitor: `visitor-${i}` }))));
    assert.equal(results.filter(Boolean).length, 1);
    assert.equal((await readAnalytics(7)).todayCollected, 2000);
    assert.equal(await recordEvent(event()), false);
    await pool.query("UPDATE analytics_budgets SET events = 0 WHERE day = $1", [today]);
  });
  await t.test("short-window throttle limits repeat visitor writes", async () => {
    let recorded = 0;
    for (let i = 0; i < 25; i++) if (await recordEvent(event({ visitor: "repeat-visitor" }))) recorded++;
    assert.equal(recorded, 20);
  });
  await t.test("parallel requests from one visitor cannot bypass the short-window throttle", async () => {
    const results = await Promise.all(Array.from({ length: 40 }, () => recordEvent(event({ visitor: "parallel-repeat-visitor" }))));
    assert.equal(results.filter(Boolean).length, 20);
  });

  const beforeEnv = { token: process.env.GITHUB_TRAFFIC_TOKEN, repos: process.env.GITHUB_TRAFFIC_REPOS };
  process.env.GITHUB_TRAFFIC_TOKEN = "test-only-token"; process.env.GITHUB_TRAFFIC_REPOS = "owner/site,owner/game";
  t.after(() => { for (const [key, value] of [["GITHUB_TRAFFIC_TOKEN", beforeEnv.token], ["GITHUB_TRAFFIC_REPOS", beforeEnv.repos]]) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
  const utcDay = (await pool.query("SELECT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day")).rows[0].day;
  let count = 5, failRepo = "";
  t.mock.method(globalThis, "fetch", async source => {
    if (String(source).includes(failRepo) && failRepo) return new Response("Forbidden", { status: 403 });
    const metric = String(source).includes("clones") ? "clones" : "views";
    return Response.json({ count, uniques: 1, [metric]: [{ timestamp: `${utcDay}T00:00:00Z`, count, uniques: 1 }] });
  });
  await t.test("GitHub reruns use a lease and upsert daily values instead of summing duplicates", async () => {
    assert.equal((await syncGithubTraffic()).failed, 0);
    assert.equal((await syncGithubTraffic()).skipped, true);
    let report = await readAnalytics(7);
    assert.equal(report.github.repositories[0].views, 5);
    count = 7;
    await pool.query("UPDATE analytics_jobs SET started_at = now() - interval '6 minutes'");
    await syncGithubTraffic(); report = await readAnalytics(7);
    assert.equal(report.github.repositories[0].views, 7);
    assert.equal((await pool.query("SELECT count(*)::int AS n FROM github_traffic_daily")).rows[0].n, 2);
  });
  await t.test("one failed repository preserves good history while another still updates", async () => {
    await pool.query("UPDATE analytics_jobs SET started_at = now() - interval '6 minutes'");
    count = 9; failRepo = "owner/site";
    assert.equal((await syncGithubTraffic()).failed, 1);
    const report = await readAnalytics(7);
    assert.equal(report.github.repositories.find(repo => repo.repo === "owner/site").views, 7);
    assert.equal(report.github.repositories.find(repo => repo.repo === "owner/site").failed, true);
    assert.equal(report.github.repositories.find(repo => repo.repo === "owner/game").views, 9);
  });
  await t.test("retention removes only records beyond 90 days and preserves yesterday", async () => {
    await pool.query("INSERT INTO analytics_events (id, day, visitor, kind, path, referrer, device, browser, country) SELECT $1, $2::date - 90, null, 'pageview', '/', '', '', '', ''", [randomUUID(), today]);
    await pool.query("INSERT INTO analytics_budgets VALUES ($1::date - 1, 1), ($1::date - 90, 1)", [today]);
    await pruneAnalytics(); await pruneAnalytics();
    assert.equal((await pool.query("SELECT count(*)::int AS n FROM analytics_events WHERE day < $1::date - 89", [today])).rows[0].n, 0);
    assert.equal((await pool.query("SELECT events FROM analytics_budgets WHERE day = $1::date - 1", [today])).rows[0].events, 1);
  });
});
