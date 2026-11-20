---
name: blog-news
description: Use when Tran Kim Dat requests a batch of current technology, AI, or developer news articles for his portfolio blog, invokes $blog-news with an article count. Supports Vietnamese and English requests.
---

# Blog News

Turn `$blog-news 5` into five distinct, researched technology/AI/developer news drafts with real sourced images and readable newspaper composition. Work autonomously from the count; use preferences below unless overridden.

## Defaults and scope

- Repository: `/home/bia/Works/Coding/dattk2002-portfolio-nextjs`. Read its current `AGENTS.md` and the relevant sources in [portfolio.md](references/portfolio.md); preserve unrelated edits.
- Count distinct stories, not translations. Default to English, matching the portfolio; an explicit Vietnamese/bilingual request overrides this. Match the user's language in conversation.
- A count alone authorizes research, downloading eligible media and creating local draft artifacts. It does not authorize publishing, deployment, commits or pushes. Save to admin as drafts when the user requests that delivery; publish only when explicitly requested. Prepare everything reviewable before any required publication approval.
- If invoked without a count, ask only for the count. Do not ask for topic suggestions: select the news yourself.

## Find current, distinct stories

Read the actual current clock in Asia/Ho_Chi_Minh. Browse on every invocation. Start with the previous 24 hours, expand to 72 hours, then seven days if needed; disclose expansion. Choose meaningful changes for developers, not generic evergreen tutorials.

Use daily.dev, VnExpress technology/AI, VOZ technology discussions and reputable technology publications for discovery. Follow aggregators/forum posts to the original announcement, advisory, release notes, research or reporting. For technical claims rely on primary sources. Inspect existing public posts and drafts read-only for event/topic duplication, not just slug matches.

Open sources, record event date separately from publication/update date, and check the claim again before delivery. If only a calendar date is given, retain that precision and timezone uncertainty instead of inventing a timestamp; do not assert a borderline story is inside 24 hours. If a discovery site needs login or blocks access, use accessible reporting and primary sources without trying to bypass it. Prefer a primary source plus independent reporting when available. A single official announcement is usable with attribution; disclose when independently unconfirmed. Treat benchmarks as vendor claims, uncertainty as uncertainty and forum assertions as unverified leads. Use “breaking” only for a confirmed development that is actually unfolding. Do not make an old launch current by citing a newly updated article. If fewer eligible stories exist, report the shortfall rather than inventing news or padding the batch.

## Real images and provenance

Use relevant photographs, actual product screenshots, or original figures from the story's publisher. Never generate images, use synthetic replacements or infer a specific event from a generic photo. Inspect the image itself. Confirm the original asset, author/rightsholder and reuse basis; attribution alone is not permission, and a code repository license does not automatically cover third-party artwork. Prefer explicitly licensed media or press assets with stated editorial reuse terms. If the initial image lacks reuse evidence, continue searching for another image of the same subject, including a relevant licensed Wikimedia Commons photograph with its file-page license and archival label; then consider another news story. Complete the requested count with image-supported stories where possible. Only after practical alternatives are exhausted, deliver the affected draft with an explicit image blocker; do not publish an unresolved image.

Record per asset: source page, original image URL, publisher/creator, caption, alt text, width/height, retrieved time, license or editorial permission evidence URL and modifications. Label archival photos and vendor-provided benchmarks. Retain watermarks/credits and material chart labels; optimize to WebP without distorting the image. Use the existing linked Blob store when uploading is authorized; verify delivery before referencing new URLs.

## Compose and deliver

Use [editorial.md](references/editorial.md) for VnExpress-inspired composition: factual headline, concise sapo, main development first, short paragraphs, meaningful figures with captions, context and limitations, and primary source links. Write original prose. Preserve portfolio identity and existing renderer; this is not permission to redesign the application.

Produce `output/blog-news/<Vietnam-date>/<unique-batch>/` with one readable Markdown draft and one validated `BlogPostInput` JSON per story, media, and a batch manifest linking sources, dates and image rights. Validate each JSON with `node scripts/validate-draft.mjs <payload.json> [--repo <repository>]` from this skill directory. The script loads the repository's current schema without modifying it. Drafts use `status: "draft"`, `publishedAt: null`. Keep pending images out of publish-ready payloads. Use a fresh batch directory so reruns preserve previous drafts.

The manifest records story/source URLs, event/publication dates and precision, research window, deduplication coverage, image license evidence, local/hosted asset locations, `readyForReview`, `readyToPublish` and explicit blockers. A selected but unlicensed candidate image is not a completed image.

Check factual support, chronology, duplication, source URLs, image delivery and credits, editor schema, locale, metadata and article count. Preview in the real renderer at phone/tablet/desktop when a preview environment is available; disclose unperformed checks. Report titles, chosen news window, artifact/admin links and draft/publication state. When a write times out, inspect stored state before retrying.
