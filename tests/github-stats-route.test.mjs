import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test, { mock } from "node:test";

let stored = null;
let databaseFails = false;
mock.module(new URL("../lib/github-activity-store.ts", import.meta.url).href, {
  exports: { readGithubActivity: async () => {
    if (databaseFails) throw new Error("Private database details");
    return stored;
  } },
});
const { GET } = await import("../app/api/github-stats/route.ts");
const snapshot = {
  totalContributions: 2761, currentStreak: 32, longestStreak: 32,
  syncedAt: "2026-11-10T00:20:00.000Z", nextSyncAt: "2026-11-11T00:00:00.000Z",
};

test("public reads use the cron snapshot without contacting GitHub", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-10T12:00:00Z") });
  stored = snapshot;
  let upstreamRequests = 0;
  t.mock.method(globalThis, "fetch", async () => { upstreamRequests++; throw new Error("No upstream reads allowed"); });
  const response = await GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ...snapshot, stale: false });
  assert.equal(upstreamRequests, 0);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("a missed cron keeps the last successful snapshot and marks it stale", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-11T01:01:00Z") });
  stored = snapshot;
  const response = await GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ...snapshot, stale: true });
});

test("the Hobby schedule's one-hour invocation window is not a failed sync", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-11T00:30:00Z") });
  stored = snapshot;
  assert.equal((await (await GET()).json()).stale, false);
});

for (const name of ["not initialized", "database unavailable"]) {
  test(`${name} returns a generic uncached 503`, async () => {
    stored = null;
    databaseFails = name === "database unavailable";
    try {
      const response = await GET();
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
      assert.deepEqual(await response.json(), { error: "GitHub activity is temporarily unavailable." });
    } finally { databaseFails = false; }
  });
}
