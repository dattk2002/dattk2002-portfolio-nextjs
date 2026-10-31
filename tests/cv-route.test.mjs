import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// Resolve the application's TypeScript alias without adding a test dependency.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});

const { GET } = await import("../app/api/cv/route.ts");
const pdf = "%PDF-1.7\nCV fixture";

for (const source of ["google-docs", "static-fallback"]) {
  for (const [query, disposition] of [["", "attachment"], ["?preview=true", "inline"]]) {
    test(`${source}: serves ${disposition} PDF for ${query || "download"}`, async (t) => {
      t.mock.method(globalThis, "fetch", async (url) => {
        if (String(url).startsWith("https://docs.google.com/") && source === "static-fallback") {
          throw new DOMException("Export timed out", "TimeoutError");
        }
        return new Response(pdf, { headers: { "Content-Type": "application/pdf" } });
      });

      const response = await GET(new Request(`https://portfolio.test/api/cv${query}`));

      assert.equal(response.status, 200);
      assert.equal(response.headers.get("Content-Type"), "application/pdf");
      assert.equal(response.headers.get("X-CV-Source"), source);
      assert.equal(response.headers.get("Content-Disposition"), `${disposition}; filename="CV-Tran Kim Dat-Full-stack Engineer.pdf"`);
      assert.equal(await response.text(), pdf);
    });
  }
}

test("preview rejects an invalid upstream export and serves the fallback inline", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => new Response(
    String(url).startsWith("https://docs.google.com/") ? "<html>Sign in</html>" : pdf,
  ));
  const response = await GET(new Request("https://portfolio.test/api/cv?preview=true"));
  assert.equal(response.headers.get("X-CV-Source"), "static-fallback");
  assert.match(response.headers.get("Content-Disposition"), /^inline;/);
  assert.equal(await response.text(), pdf);
});

test("preview returns an uncached 503 when neither source supplies a valid PDF", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("Not a PDF"));
  const response = await GET(new Request("https://portfolio.test/api/cv?preview=true"));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("Content-Disposition"), null);
});
