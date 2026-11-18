import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test from "node:test";

const { trafficRepositories, fetchRepositoryTraffic } = await import("../lib/github-traffic.ts");
test("repository configuration is explicit, bounded and cannot become an arbitrary upstream URL", () => {
  assert.deepEqual(trafficRepositories("dattk2002/site, dattk2002/game,dattk2002/site"), ["dattk2002/site", "dattk2002/game"]);
  assert.throws(() => trafficRepositories("https://evil.test/token"));
  assert.throws(() => trafficRepositories("owner/../secrets"));
  assert.throws(() => trafficRepositories(Array.from({ length: 11 }, (_, i) => `owner/r${i}`).join(",")));
});
test("fetches uncached UTC daily traffic with bounded requests and keeps view/clone dates aligned", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-17T12:00:00Z") });
  let calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    const type = String(url).includes("clones") ? "clones" : "views";
    return Response.json({ count: 3, uniques: 2, [type]: [{ timestamp: "2026-11-16T00:00:00Z", count: 3, uniques: 2 }] });
  });
  const rows = await fetchRepositoryTraffic("owner/repo", "test-only-token");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].options.cache, "no-store");
  assert.ok(calls[0].options.signal instanceof AbortSignal);
  assert.deepEqual(rows, [{ day: "2026-11-16", views: 3, visitors: 2, clones: 3, cloners: 2 }]);
});
test("accepts GitHub's documented inclusive 14-day window with 15 daily buckets", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-17T12:00:00Z") });
  const rows = Array.from({ length: 15 }, (_, i) => ({ timestamp: new Date(Date.parse("2026-11-17T00:00:00Z") - i * 86400000).toISOString().replace(".000Z", "Z"), count: 1, uniques: 1 }));
  t.mock.method(globalThis, "fetch", async url => Response.json({ count: 15, uniques: 1, [String(url).includes("clones") ? "clones" : "views"]: rows }));
  assert.equal((await fetchRepositoryTraffic("owner/repo", "test-only-token")).length, 15);
});
for (const timestamp of ["2026-11-18T00:00:00Z", "2026-11-02T00:00:00Z"]) {
  test(`rejects out-of-window GitHub data (${timestamp}) before replacing any history`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-17T12:00:00Z") });
    t.mock.method(globalThis, "fetch", async url => Response.json({ count: 1, uniques: 1, [String(url).includes("clones") ? "clones" : "views"]: [{ timestamp, count: 1, uniques: 1 }] }));
    await assert.rejects(fetchRepositoryTraffic("owner/repo", "test-only-token"));
  });
}
for (const condition of ["403", "timeout", "invalid", "non-midnight", "duplicates", "inconsistent"]) {
  test(`invalid or unavailable GitHub traffic (${condition}) does not produce a partial snapshot`, async t => {
    t.mock.method(globalThis, "fetch", async () => {
      if (condition === "403") return new Response("Secret upstream details", { status: 403 });
      if (condition === "timeout") throw new DOMException("timeout", "TimeoutError");
      if (condition === "invalid") return Response.json({ count: 1, uniques: 1, views: [{ timestamp: "bad", count: -1, uniques: 1 }] });
      const row = { timestamp: condition === "non-midnight" ? "2026-11-16T01:00:00Z" : "2026-11-16T00:00:00Z", count: 1, uniques: condition === "inconsistent" ? 2 : 1 };
      return Response.json({ count: 1, uniques: 1, views: condition === "duplicates" ? [row, row] : [row], clones: [row] });
    });
    await assert.rejects(fetchRepositoryTraffic("owner/repo", "test-only-token"));
  });
}
