import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test, { mock } from "node:test";
let pruned = 0, synced = 0, fail = false;
mock.module(new URL("../lib/analytics-store.ts", import.meta.url).href, { exports: { pruneAnalytics: async () => { pruned++; } } });
mock.module(new URL("../lib/github-traffic.ts", import.meta.url).href, { exports: { syncGithubTraffic: async () => { synced++; if (fail) throw Error("Private token"); return { configured: false, skipped: true, failed: 0 }; } } });
const { GET } = await import("../app/api/cron/analytics/route.ts");
function setup(t) {
  const original = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "test-only-secret";
  t.after(() => { if (original === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = original; fail = false; });
}
test("daily maintenance requires the exact cron secret", async t => {
  setup(t);
  const before = pruned;
  for (const token of ["", "wrong"]) assert.equal((await GET(new Request("https://portfolio.test/api/cron/analytics", { headers: { authorization: `Bearer ${token}` } }))).status, 401);
  assert.equal(pruned, before);
});
test("daily cron prunes bounded history and runs sync without a browser", async t => {
  setup(t);
  const before = synced;
  const response = await GET(new Request("https://portfolio.test/api/cron/analytics", { headers: { authorization: "Bearer test-only-secret" } }));
  assert.equal(response.status, 200);
  assert.equal(synced, before + 1);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("cron errors are generic and retain historical traffic", async t => {
  setup(t); fail = true;
  const response = await GET(new Request("https://portfolio.test/api/cron/analytics", { headers: { authorization: "Bearer test-only-secret" } }));
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes("Private"), false);
});
