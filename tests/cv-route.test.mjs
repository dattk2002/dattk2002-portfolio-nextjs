import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test, { mock } from "node:test";

let fileOverride;
mock.module("node:fs/promises", {
  exports: { readFile: async (...args) => {
    if (fileOverride instanceof Error) throw fileOverride;
    return fileOverride ?? readFile(...args);
  } },
});
const { GET } = await import("../app/api/cv/route.ts");

for (const [query, disposition] of [["", "attachment"], ["?preview=true", "inline"]]) {
  test(`${disposition} serves the approved General CV without external requests`, async (t) => {
    let networkRequests = 0;
    t.mock.method(globalThis, "fetch", async () => {
      networkRequests++;
      throw new Error("CV delivery must work offline");
    });
    const response = await GET(new Request(`https://portfolio.test/api/cv${query}`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Content-Type"), "application/pdf");
    assert.equal(response.headers.get("Content-Disposition"), `${disposition}; filename="CV - Tran Kim Dat - Software Engineer.pdf"`);
    assert.equal(response.headers.get("X-CV-Source"), "bundled-pdf");
    const contents = Buffer.from(await response.arrayBuffer());
    assert.equal(response.headers.get("Content-Length"), String(contents.length));
    // Pins the approved General CV without GPA so an older public document cannot silently return.
    assert.equal(createHash("sha256").update(contents).digest("hex"), "17dae7531bee05e300a40142fc2ed6f33396853b02faf73040b4242f79ccf56f");
    assert.equal(networkRequests, 0);
    assert.match(response.headers.get("Cache-Control"), /must-revalidate/);
  });
}

for (const [name, value] of [
  ["missing file", Object.assign(new Error("Private filesystem path"), { code: "ENOENT" })],
  ["unreadable file", Object.assign(new Error("Private permission details"), { code: "EACCES" })],
  ["empty file", Buffer.alloc(0)],
  ["invalid signature", Buffer.from("<html>Not a PDF</html>")],
  ["oversized PDF", Buffer.concat([Buffer.from("%PDF-"), Buffer.alloc(10 * 1024 * 1024)])],
]) {
  test(`${name} returns a generic uncached error for download and preview`, async () => {
    fileOverride = value;
    try {
      for (const query of ["", "?preview=true"]) {
        const response = await GET(new Request(`https://portfolio.test/api/cv${query}`));
        assert.equal(response.status, 503);
        assert.equal(response.headers.get("Cache-Control"), "no-store");
        assert.equal(response.headers.get("Content-Disposition"), null);
        assert.equal(await response.text(), "CV is temporarily unavailable.");
      }
    } finally { fileOverride = undefined; }
  });
}
