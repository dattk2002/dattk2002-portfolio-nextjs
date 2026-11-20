# Blog imagery and news authoring

The portfolio bundles real publisher screenshots and figures under `public/images/blog/sourced/`. `lib/blog/media-sources.json` records original assets, source articles, accurate captions/alt text, dimensions, modifications and available license evidence. `lib/blog/media.ts` replaces only the 17 exact historical generated-image URLs (10 covers and seven inline images) in public presentation. `presentBlogPost` applies this after cached database loading, so the index, articles and metadata use the same images. There is no live database mutation or media upload. Deployment is required for these repository changes to become public.

Stored editor records retain their original images. Newly selected owner images are authoritative because they do not match a legacy URL. Removing or replacing a generated image in the admin takes effect normally. The public adapter is idempotent and does not change article prose, slugs, publication dates, status, code or source links. It adds source paragraphs beside replaced inline images and a figure caption beneath replaced covers. Covers contain the whole image rather than crop chart labels. Cover captions and inline source paragraphs include direct full-size image links for reading dense figures on smaller screens. JSON-LD resolves local images against the canonical origin.

## Image provenance

Sources are TypeSafe AI's Jev announcement, official MCP Inspector documentation, Anthropic's Building effective agents article, Langfuse documentation, Qwen's Qwen3-Coder announcement, Vercel's AI Gateway logs and AI SDK articles, and Neon's pgrag article. Vendor benchmark charts are attributed vendor claims; archival interface captures and the July 2025 Qwen figures are labeled with their original context.

Langfuse documentation retains its recorded MIT notice. The MCP Inspector screenshot comes from the active `modelcontextprotocol/modelcontextprotocol` documentation repository and uses its CC BY 4.0 documentation license, with creator, source and resizing/WebP changes credited. License evidence and notices are retained in `public/images/blog/sourced/licenses/`. Other publisher figures remain the publisher's copyrighted material: their entries state a limited editorial illustration rationale and do not assert a Creative Commons license, explicit publisher permission or unrestricted reuse. Attribution is not a blanket reproduction license. Review the recorded rights basis before reusing these assets elsewhere.

The RAG diagram's transparent background is flattened to dark so its original pale explanations remain legible; the other assets are resized proportionately and encoded as WebP. Images are not generated or reconstructed.

## Reusable personal skill

The version-controlled source is `.agents/skills/blog-news/`; an identical personal copy is installed at `/home/bia/.codex/skills/blog-news/SKILL.md`:

```text
$blog-news 5
$blog-news 3 bằng tiếng Việt
$blog-news 2 song ngữ Anh - Việt
```

The number means distinct stories, not translations. The default language is English, matching the portfolio; an explicit language overrides it. Each invocation researches current technology, AI and developer news, checks existing posts for duplication, follows aggregator/forum leads to primary sources, records event versus publication dates, and chooses real images with documented reuse evidence. It searches the past 24 hours, expanding to 72 hours or seven days when necessary and reporting the expansion.

Composition follows newspaper reading order inspired by VnExpress: factual title, concise sapo, key development first, short paragraphs, meaningful captioned images, context, qualifications and linked sources. The portfolio's design system stays in place.

A count alone produces local drafts under `output/blog-news/<Vietnam-date>/<batch>/`, including Markdown, editor payloads, real media and provenance/readiness manifests. Publishing, deployment, commits and pushes require an explicit request. A missing media permission or unsupported delivery host is a blocker recorded in the manifest, not a publish-ready image. The bundled `scripts/validate-draft.mjs` validates against the current repository schema and requires draft status with no publication date.

The skill was forward-tested with current news in an isolated temporary directory. One test correctly withheld a publisher montage with unresolved reuse rights; a second produced a complete story with a verified CC BY-SA 2.0 archival photograph and passed the real editor schema. Neither test published or changed live posts.
