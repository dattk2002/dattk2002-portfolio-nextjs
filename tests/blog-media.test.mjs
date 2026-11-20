import './helpers/register-alias.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';

const { presentBlogPost } = await import('../lib/blog/presentation.ts');
const legacyCover = 'https://h1lvhovxchgkpuum.public.blob.vercel-storage.com/blog/1790083805937-jev-system-one-cover-PfngLXHK7h6JSj3d6lGsdy6m0U18Rt.webp';
const legacyInline = 'https://h1lvhovxchgkpuum.public.blob.vercel-storage.com/blog/1790087510943-mcp-production-architecture-5DIpFX8tPAaGqjNdWOcEgeeyS0Lh1I.webp';
const post = overrides => ({
  title: 'An existing article', excerpt: 'Original prose.', seoTitle: null, seoDescription: null,
  coverImageUrl: legacyCover, coverImageAlt: 'Generated cover', tags: [],
  content: { type: 'doc', content: [] }, ...overrides,
});

test('known generated covers use sourced local media and visible provenance without mutating editor records', () => {
  const original = post({slug:'unchanged-slug',publishedAt:'2026-09-22T00:00:00Z'});
  const saved = structuredClone(original);
  const visible = presentBlogPost(original);
  assert.equal(visible.coverImageUrl, '/images/blog/sourced/jev-benchmarks.webp');
  assert.equal(visible.coverImageCredit.publisher, 'TypeSafe AI');
  assert.equal(visible.coverImageCredit.sourcePage, 'https://typesafe.ai/blog/introducing-system-one-models-and-jev');
  assert.match(visible.coverImageAlt, /TypeSafe/);
  assert.equal(visible.slug, original.slug);
  assert.equal(visible.publishedAt, original.publishedAt);
  assert.deepEqual(original, saved);
  assert.deepEqual(presentBlogPost(visible), visible);
});

test('known inline illustrations retain intrinsic sizing and get one caption and linked source', () => {
  const original = post({coverImageUrl:null, content:{type:'doc',content:[
    {type:'paragraph',content:[{type:'text',text:'Keep this paragraph.'}]},
    {type:'image',attrs:{src:legacyInline,alt:'Generated diagram',width:null,height:null}},
    {type:'paragraph',content:[{type:'text',text:'Keep the next paragraph.'}]},
  ]}});
  const saved = structuredClone(original);
  const visible = presentBlogPost(original);
  const nodes = visible.content.content;
  assert.equal(nodes[1].attrs.src, '/images/blog/sourced/mcp-inspector.webp');
  assert(nodes[1].attrs.width > 0 && nodes[1].attrs.height > 0);
  assert.match(nodes[1].attrs.title,/Model Context Protocol/);
  assert.equal(nodes[2].type,'paragraph');
  assert(nodes[2].content.some(n=>n.marks?.some(m=>m.type==='link'&&m.attrs.href==='https://modelcontextprotocol.io/docs/tools/inspector')));
  assert.deepEqual(nodes[3],original.content.content[2]);
  assert.deepEqual(presentBlogPost(visible),visible);
  assert.deepEqual(original,saved);
});

test('later owner-selected covers and unknown images keep their authored sources and captions', () => {
  const original = post({coverImageUrl:'https://example.test/owner-photo.webp',coverImageAlt:'Owner photo',content:{type:'doc',content:[{type:'image',attrs:{src:'https://example.test/new.webp',alt:'New photo',title:'Owner caption'}}]}});
  assert.deepEqual(presentBlogPost(original),original);
});


test('readers can open sourced figures at full resolution and inspect the applicable MCP documentation license', () => {
  const visible = presentBlogPost(post({coverImageUrl:null,content:{type:'doc',content:[{type:'image',attrs:{src:legacyInline,alt:'Old illustration'}}]}}));
  const links=visible.content.content[1].content.filter(n=>n.marks?.some(m=>m.type==='link'));
  assert(links.some(n=>n.text==='Full-size image'&&n.marks.some(m=>m.attrs.href==='/images/blog/sourced/mcp-inspector.webp')));
  assert(links.some(n=>n.text==='License'&&n.marks.some(m=>m.attrs.href==='https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/LICENSE')));
});
