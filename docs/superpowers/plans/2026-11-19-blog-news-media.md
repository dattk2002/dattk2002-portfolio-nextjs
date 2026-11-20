# Blog news media and reusable authoring skill

**Goal:** Replace generated illustrations on the ten published blog posts and install `$blog-news N` for current technology, AI and developer news with real sourced images and newspaper-style composition.

**Approved scope:** Preserve two existing drafts, article prose and unrelated work. The owner subsequently authorized small commits and a production deployment, then separate branches and pull requests pushed and merged into main. New article publication remains outside this request. Existing repository styling remains authoritative.

**Architecture:** Bundle optimized source assets and an explicit provenance manifest. Remap exact legacy image URLs in the existing public presentation layer after cached database reads. Keep editor data and later custom image choices unchanged. Add visible cover and inline source attribution. Keep a version-controlled skill in .agents/skills/blog-news and install an identical personal copy under ~/.codex/skills/blog-news.

- [x] Inspect published records, editor schema, renderers and storage.
- [x] Download and visually inspect relevant publisher screenshots/figures; retain source and license evidence without inventing permission.
- [x] Add bundled WebP assets, exact URL mapping, source captions and no-crop image rendering. Add focused regression tests before implementing the adapter.
- [x] Install the count-driven news skill with freshness, verification, deduplication, image provenance, VnExpress-inspired composition, schema validation and draft-only default.
- [x] Run independent skill forward scenarios and focused regression tests.
- [x] Complete final code/UX review, full checks and browser verification at mobile, tablet and desktop.

**Implementation choices:** Existing public articles stay English; the skill defaults to English and accepts Vietnamese/bilingual overrides. Counts mean distinct stories. Local bundled media removes any upload credential prerequisite. Original editor records remain untouched; the production site changes only after an authorized deployment. Publisher figures without an explicit reusable license retain their original copyright and the manifest does not claim permission was granted.
