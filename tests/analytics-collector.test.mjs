import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test, { mock } from "node:test";

let writes = [];
let fails = false;
mock.module(new URL("../lib/analytics-store.ts", import.meta.url).href, { exports: {
  recordEvent: async (event) => { if (fails) throw Error("Private DB URL"); writes.push(event); return true; },
} });
const { POST } = await import("../app/api/analytics/route.ts");
const body = { id: "61cc8193-1a48-4115-b608-c3d168b6bcef", kind: "pageview", path: "/" };
function setup(t) {
  const original = { ...process.env };
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
  process.env.ANALYTICS_SECRET = "a".repeat(32);
  t.after(() => { process.env = original; writes = []; fails = false; });
}
const request = (data = body, headers = {}) => new Request("https://portfolio.test/api/analytics", {
  method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json", "x-forwarded-for": "203.0.113.9", ...headers }, body: typeof data === "string" ? data : JSON.stringify(data),
});
test("records one anonymous event with server-controlled day and no response caching", async t => {
  setup(t);
  const response = await POST(request());
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(writes.length, 1);
  assert.equal(writes[0].visitor.length, 64);
  assert.equal(JSON.stringify(writes).includes("203.0.113.9"), false);
});
test("disabled or missing configuration never writes", async t => {
  setup(t);
  delete process.env.ANALYTICS_SECRET;
  assert.equal((await POST(request())).status, 204);
  assert.equal(writes.length, 0);
});
test("cross-origin writes are rejected before database access", async t => {
  setup(t);
  assert.equal((await POST(request(body, { origin: "https://evil.test" }))).status, 403);
  assert.equal(writes.length, 0);
});
test("accepts the actual public origin when Next reconstructs an internal localhost request URL", async t => {
  setup(t);
  const response = await POST(new Request("http://localhost:3106/api/analytics", {
    method: "POST", headers: { host: "127.0.0.1:3106", origin: "http://127.0.0.1:3106", "x-forwarded-proto": "http" }, body: JSON.stringify(body),
  }));
  assert.equal(response.status, 204);
  assert.equal(writes.length, 1);
});
test("privacy opt-out, bots and prefetches do not write", async t => {
  setup(t);
  for (const headers of [{ dnt: "1" }, { "sec-gpc": "1" }, { "user-agent": "crawler" }, { purpose: "prefetch" }]) {
    assert.equal((await POST(request(body, headers))).status, 204);
  }
  assert.equal(writes.length, 0);
});
test("malformed and oversized payloads are rejected", async t => {
  setup(t);
  assert.equal((await POST(request("not-json"))).status, 400);
  assert.equal((await POST(request("a".repeat(2049)))).status, 413);
  assert.equal(writes.length, 0);
});
test("database errors stay generic and uncached", async t => {
  setup(t); fails = true;
  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes("Private"), false);
});
