import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test from "node:test";

const { vietnamDay, nextMidnight, visitorHash, normalizeEvent, toCsv, parseDays } = await import("../lib/analytics.ts");

test("website day resets exactly at midnight Vietnam even if cron runs late", () => {
  assert.equal(vietnamDay(new Date("2026-11-17T16:59:59Z")), "2026-11-17");
  assert.equal(vietnamDay(new Date("2026-11-17T17:00:00Z")), "2026-11-18");
  assert.equal(nextMidnight(new Date("2026-11-17T17:30:00Z")), "2026-11-18T17:00:00.000Z");
});

test("visitor estimates rotate daily and never retain raw identifiers", () => {
  const a = visitorHash("203.0.113.8", "Browser", "2026-11-17", "secret");
  assert.equal(a.length, 64);
  assert.equal(a, visitorHash("203.0.113.8", "Browser", "2026-11-17", "secret"));
  assert.notEqual(a, visitorHash("203.0.113.8", "Browser", "2026-11-18", "secret"));
  assert.equal(visitorHash("", "Browser", "2026-11-17", "secret"), null);
});

const input = { id: "61cc8193-1a48-4115-b608-c3d168b6bcef", kind: "pageview", path: "/blog/vi/hello?token=private#fragment", referrer: "https://www.linkedin.com/in/private?email=private" };
test("collector strips URL secrets and only retains referral hostname and coarse device", () => {
  const data = normalizeEvent(input, new Headers({ "user-agent": "Mozilla/5.0 (iPhone) Version/17.0 Mobile Safari/604.1", "x-vercel-ip-country": "VN" }));
  assert.equal(data.path, "/blog/vi/hello");
  assert.equal(data.referrer, "linkedin.com");
  assert.equal(data.device, "Mobile");
  assert.equal(data.browser, "Safari");
  assert.equal(data.country, "VN");
  assert.equal(JSON.stringify(data).includes("private"), false);
});

for (const path of ["/admin", "/admin/blog", "/api/cv", "//evil.test/", "/unknown", "/projects/../admin", "/projects/a%2fb", "/blog/vi/reset@example.com"]) {
  test(`rejects non-public or malformed page path ${path}`, () => assert.throws(() => normalizeEvent({ ...input, path }, new Headers())));
}
for (const name of ["dnt", "sec-gpc"]) {
  test(`respects ${name} and ignores bots`, () => {
    assert.equal(normalizeEvent(input, new Headers({ [name]: "1" })), null);
    assert.equal(normalizeEvent(input, new Headers({ "user-agent": "Googlebot/2.1" })), null);
  });
}
test("rejects invalid IDs, event types and arbitrary destination payloads", () => {
  for (const patch of [{ id: "bad" }, { kind: "identity" }, { target: "private@example.com" }]) {
    assert.throws(() => normalizeEvent({ ...input, ...patch }, new Headers()));
  }
});
test("ranges are bounded and CSV neutralizes spreadsheet formulas and quotes", () => {
  assert.equal(parseDays(null), 7);
  assert.equal(parseDays("90"), 90);
  assert.throws(() => parseDays("100000"));
  const csv = toCsv([["=WEBSERVICE(\"secret\")", "+1", "@SUM(1)", "line\nbreak", 'a"b', 12]]);
  assert.ok(csv.includes("'=WEBSERVICE"));
  assert.ok(csv.includes("'+1"));
  assert.ok(csv.includes("'@SUM"));
  assert.ok(csv.includes('"a""b"'));
});
