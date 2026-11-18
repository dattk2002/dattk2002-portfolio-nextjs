import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test, { mock } from "node:test";
let authorized = false, reads = 0, fail = false, syncs = 0;
mock.module(new URL("../lib/auth/admin.ts", import.meta.url).href, { exports: { requireAdmin: async () => { if (!authorized) throw Error("Unauthorized"); return { id: "owner" }; } } });
mock.module(new URL("../lib/analytics-store.ts", import.meta.url).href, { exports: { readAnalytics: async days => {
  reads++; if (fail) throw Error("Private database connection string");
  return { days, generatedAt: new Date().toISOString(), daily: [{ day: "2026-11-17", pageviews: 2, visitors: 1, cvClicks: 1, githubClicks: 0, contactClicks: 0 }], pages: [{ label: "=formula", count: 1 }], referrers: [], devices: [], browsers: [], countries: [], github: { repositories: [] } };
} } });
mock.module(new URL("../lib/github-traffic.ts", import.meta.url).href, { exports: { syncGithubTraffic: async () => { syncs++; return { configured: true, skipped: false, failed: 1 }; } } });
const { GET, POST } = await import("../app/api/admin/analytics/route.ts");
const req = (query = "", method = "GET", origin = "https://portfolio.test") => new Request(`https://portfolio.test/api/admin/analytics${query}`, { method, headers: { origin } });
test("analytics JSON, CSV and sync require owner authorization before access", async () => {
  authorized = false;
  const before = reads;
  assert.equal((await GET(req())).status, 401);
  assert.equal((await GET(req("?format=csv"))).status, 401);
  assert.equal((await POST(req("", "POST"))).status, 401);
  assert.equal(reads, before); assert.equal(syncs, 0);
});
test("every dashboard read is fresh, uncached and range bounded", async () => {
  authorized = true;
  const before = reads;
  for (let i = 0; i < 2; i++) {
    const response = await GET(req("?days=30"));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await response.json()).days, 30);
  }
  assert.equal(reads, before + 2);
  assert.equal((await GET(req("?days=99999"))).status, 400);
});
test("CSV is an authenticated attachment with safe values and dates", async () => {
  authorized = true;
  const response = await GET(req("?format=csv&days=7"));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-disposition"), /attachment/);
  const text = await response.text();
  assert.ok(text.includes("2026-11-17")); assert.ok(text.includes("'=formula"));
});
test("admin sync rejects cross-origin submissions and reports partial GitHub failure", async () => {
  authorized = true;
  assert.equal((await POST(req("", "POST", "https://evil.test"))).status, 403);
  const response = await POST(req("", "POST"));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).failed, 1);
});
test("admin sync uses the external host and protocol behind the Next server", async () => {
  authorized = true;
  const before = syncs;
  const response = await POST(new Request("http://localhost:3106/api/admin/analytics", {
    method: "POST", headers: { host: "portfolio.test", origin: "https://portfolio.test", "x-forwarded-proto": "https" },
  }));
  assert.equal(response.status, 503); // The configured fixture repository fails; authorization and origin pass.
  assert.equal(syncs, before + 1);
});
test("database failure is generic and not cached", async () => {
  authorized = true; fail = true;
  try {
    const response = await GET(req()); assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.ok(!(await response.text()).includes("Private"));
  } finally { fail = false; }
});
