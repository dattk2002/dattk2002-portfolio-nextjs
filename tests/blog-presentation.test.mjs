import "./helpers/register-alias.mjs";
import assert from "node:assert/strict";
import test from "node:test";

const { presentBlogPost } = await import("../lib/blog/presentation.ts");

test("public blog prose uses spaced hyphens while stored records, URLs, slugs, and code stay intact", () => {
  const original = {
    slug: "original\u2014slug",
    title: "One\u2014system",
    excerpt: "Quality \u2014 not headlines.",
    seoTitle: "Engineering\u2014notes",
    seoDescription: "A \u2014 B",
    coverImageAlt: "Flow\u2014diagram",
    coverImageUrl: "https://example.test/image\u2014name.png",
    tags: ["Web\u2014API"],
    content: { type: "doc", content: [
      { type: "paragraph", content: [
        { type: "text", text: "Built\u2014tested", marks: [{ type: "link", attrs: { href: "https://example.test/a\u2014b" } }] },
        { type: "text", text: "literal\u2014value", marks: [{ type: "code" }] },
      ] },
      { type: "codeBlock", content: [{ type: "text", text: 'const separator = "\u2014";' }] },
      { type: "image", attrs: { src: "https://example.test/a\u2014b.png", alt: "API\u2014diagram", title: "Request\u2014response" } },
    ] },
  };
  const saved = structuredClone(original);
  const visible = presentBlogPost(original);

  assert.equal(visible.title, "One - system");
  assert.equal(visible.excerpt, "Quality - not headlines.");
  assert.equal(visible.seoTitle, "Engineering - notes");
  assert.equal(visible.seoDescription, "A - B");
  assert.equal(visible.coverImageAlt, "Flow - diagram");
  assert.deepEqual(visible.tags, ["Web - API"]);
  assert.equal(visible.content.content[0].content[0].text, "Built - tested");
  assert.equal(visible.content.content[0].content[0].marks[0].attrs.href, "https://example.test/a\u2014b");
  assert.equal(visible.content.content[0].content[1].text, "literal\u2014value");
  assert.equal(visible.content.content[1].content[0].text, 'const separator = "\u2014";');
  assert.deepEqual(visible.content.content[2].attrs, { src: "https://example.test/a\u2014b.png", alt: "API - diagram", title: "Request - response" });
  assert.equal(visible.slug, "original\u2014slug");
  assert.equal(visible.coverImageUrl, "https://example.test/image\u2014name.png");
  assert.deepEqual(presentBlogPost(visible), visible);
  assert.deepEqual(original, saved);
});

test("formatting is idempotent and preserves date ranges, ordinary hyphens, null covers, and empty documents", () => {
  const post = {
    title: "2023–2026: full-stack delivery",
    excerpt: "Clear prose.",
    seoTitle: null, seoDescription: null, coverImageAlt: "", coverImageUrl: null,
    tags: [], content: { type: "doc" },
  };
  assert.deepEqual(presentBlogPost(post), post);
  assert.deepEqual(presentBlogPost(presentBlogPost(post)), post);
});
