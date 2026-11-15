import assert from "node:assert/strict";
import test from "node:test";

const { fetchGithubActivity } = await import("../lib/github-activity.ts");
const now = new Date("2026-11-10T12:00:00Z");

function calendar(ending = "2026-11-10") {
  const end = new Date(`${ending}T00:00:00Z`);
  return Array.from({ length: 32 }, (_, index) => ({
    date: new Date(end.getTime() - index * 86_400_000).toISOString().slice(0, 10),
    count: 1,
    level: 1,
  }));
}

function fixture(contributions = calendar()) {
  return { total: { 2025: 1, 2026: 32 }, contributions };
}

test("fetches fresh contributions and schedules the next daily cron at 00:00 UTC", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now });
  let fetchOptions;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    fetchOptions = options;
    return Response.json(fixture());
  });

  const snapshot = await fetchGithubActivity();
  assert.deepEqual(snapshot, {
    totalContributions: 33,
    currentStreak: 32,
    longestStreak: 32,
    syncedAt: "2026-11-10T12:00:00.000Z",
    nextSyncAt: "2026-11-11T00:00:00.000Z",
  });
  assert.equal(fetchOptions.cache, "no-store");
  assert.equal(fetchOptions.next, undefined);
});

test("today with zero contributions preserves yesterday's streak across the UTC+7 date boundary", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-11-10T17:30:00Z") });
  t.mock.method(globalThis, "fetch", async () => Response.json(fixture([
    { date: "2026-11-11", count: 0, level: 0 },
    ...calendar(),
    { date: "2026-11-12", count: 99, level: 4 },
  ])));
  const data = await fetchGithubActivity();
  assert.equal(data.currentStreak, 32);
  assert.equal(data.longestStreak, 32);
});

test("a completed day without contributions ends the current streak", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now });
  t.mock.method(globalThis, "fetch", async () => Response.json(fixture(calendar("2026-11-08"))));
  const data = await fetchGithubActivity();
  assert.equal(data.currentStreak, 0);
  assert.equal(data.longestStreak, 32);
});

for (const [name, upstream] of [
  ["upstream HTTP error", () => new Response("Unavailable", { status: 503 })],
  ["upstream timeout", () => { throw new DOMException("Timed out", "TimeoutError"); }],
  ["invalid JSON", () => new Response("<html>Unavailable</html>")],
  ["invalid total", () => Response.json({ ...fixture(), total: { 2026: "32" } })],
  ["negative count", () => Response.json(fixture([{ date: "2026-11-10", count: -1, level: 0 }]))],
  ["invalid date", () => Response.json(fixture([{ date: "invalid", count: 1, level: 1 }]))],
  ["empty calendar", () => Response.json(fixture([]))],
]) {
  test(`${name} rejects the sync without publishing a snapshot`, async (t) => {
    t.mock.method(globalThis, "fetch", async () => upstream());
    await assert.rejects(fetchGithubActivity());
  });
}
