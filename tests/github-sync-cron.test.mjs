import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test, { mock } from "node:test";

let saved = null;
let writes = 0;
let writeFails = false;
mock.module(new URL("../lib/github-activity-store.ts", import.meta.url).href, {
  exports: { saveGithubActivity: async snapshot => {
    if (writeFails) throw new Error("Private database details");
    saved = snapshot;
    writes++;
  } },
});
const { GET } = await import("../app/api/cron/github-stats/route.ts");
const request = token => new Request("https://portfolio.test/api/cron/github-stats", {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

function configureSecret(t) {
  const previous = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "test-only-cron-secret";
  t.after(() => {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  });
}

for (const token of [undefined, "incorrect", "undefined"]) {
  test(`rejects an unauthorized scheduler (${token}) before any external access`, async (t) => {
    configureSecret(t);
    let requests = 0;
    t.mock.method(globalThis, "fetch", async () => { requests++; throw new Error("Must not fetch"); });
    const previousWrites = writes;
    const response = await GET(request(token));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(requests, 0);
    assert.equal(writes, previousWrites);
  });
}

test("missing scheduler secret fails closed", async (t) => {
  configureSecret(t);
  delete process.env.CRON_SECRET;
  assert.equal((await GET(request("undefined"))).status, 401);
});

test("cron fetches and persists 32-day activity without a browser or public API request", async (t) => {
  configureSecret(t);
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-10T00:20:00Z") });
  const end = Date.parse("2026-11-10T00:00:00Z");
  t.mock.method(globalThis, "fetch", async () => Response.json({ total: { 2026: 32 },
    contributions: Array.from({ length: 32 }, (_, i) => ({ date: new Date(end - i * 86400000).toISOString().slice(0, 10), count: 1, level: 1 })),
  }));
  const previousWrites = writes;
  const response = await GET(request("test-only-cron-secret"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(writes, previousWrites + 1);
  assert.deepEqual(saved, { totalContributions: 32, currentStreak: 32, longestStreak: 32,
    syncedAt: "2026-11-10T00:20:00.000Z", nextSyncAt: "2026-11-11T00:00:00.000Z" });
});

test("transient source failure retries before saving a snapshot", async (t) => {
  configureSecret(t);
  let attempts = 0;
  t.mock.method(globalThis, "fetch", async () => ++attempts === 1
    ? new Response("Temporary failure", { status: 503 })
    : Response.json({ total: { 2026: 1 }, contributions: [{ date: "2026-11-10", count: 1, level: 1 }] }));
  assert.equal((await GET(request("test-only-cron-secret"))).status, 200);
  assert.equal(attempts, 2);
});

for (const failure of ["upstream", "database"]) {
  test(`${failure} failure preserves the previous snapshot and returns uncached 503`, async (t) => {
    configureSecret(t);
    const before = saved;
    writeFails = failure === "database";
    let attempts = 0;
    t.mock.method(globalThis, "fetch", async () => {
      attempts++;
      if (failure === "upstream") throw new DOMException("Timeout", "TimeoutError");
      return Response.json({ total: { 2026: 1 }, contributions: [{ date: "2026-11-10", count: 1, level: 1 }] });
    });
    try {
      const response = await GET(request("test-only-cron-secret"));
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
      assert.equal(saved, before);
      assert.deepEqual(await response.json(), { error: "GitHub activity sync failed." });
      assert.equal(attempts, failure === "upstream" ? 3 : 1);
    } finally { writeFails = false; }
  });
}
