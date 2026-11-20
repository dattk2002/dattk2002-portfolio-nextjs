# Portfolio integration

Read current code rather than treating this reference as a frozen schema:

- `lib/blog/types.ts`: supported locales and document node structure.
- `lib/blog/validation.ts`: validate each full payload with `blogPostInputSchema.safeParse`; do not approximate title/slug/SEO limits.
- `lib/db/schema.ts`: post, translations, tags and relations; count stories by post ID.
- `components/blog-content.tsx`: explicit renderer allowlist. Body images use `attrs.src`, `alt`, `title` (visible caption), `width`, `height`. Captions are plain text; put clickable source/license links in an adjacent paragraph with link marks.
- `app/blog/[locale]/[slug]/page.tsx`: headline/excerpt/author/cover rendered outside body. Avoid duplicating the headline or sapo inside the content. Cover attribution has no separate database column: add a short linked cover-credit paragraph to the body for new posts. Historical generated images are replaced only in public presentation through `lib/blog/media.ts` and `lib/blog/media-sources.json`, using bundled `public/images/blog/sourced/` assets; owner-selected new image URLs are preserved. Read this mapping when deduplicating media or choosing deployment-ready delivery.
- `app/admin/blog/actions.ts`: owner-authenticated `saveBlogPost`, validation and `updateTag("blog-posts")`. Saving an existing post replaces its supplied translation set and tags: preserve all existing locales/tags when updating images. Never bypass `requireAdmin` or expose credentials to make admin writes work.

Local drafts need no database write. To save drafts in the admin, use an existing authenticated owner session and the existing save flow. A direct database content operation needs specific user authorization for that target and scope; use a bounded transaction, exact IDs, concurrency checks and read-back verification. Do not apply unrelated pending Drizzle migrations to add articles or images. Preserve publication dates/statuses for image-only edits.

Public routes are `/blog`, `/blog/<locale>/<slug>` and `/blog/rss.xml`. Published list cache revalidates after 60 seconds; raw SQL does not invoke the admin cache invalidation. Verify the public route after the cache window if a content update was authorized. Uploaded Blob URLs match existing Next Image configuration; arbitrary remote cover URLs may fail its allowlist. For local-only draft artifacts, retain the verified original image URL plus the licensed local WebP in the manifest, and mark hosted/renderer readiness false until it is mapped to an allowed delivery path; never call a schema-valid external URL publish-ready merely because it parses. A user-authorized repository implementation can bundle local assets, but that needs a deployment to reach production. Avoid changing image host configuration during routine authoring.

Never print `.env.local`, session cookies, database URLs or Blob tokens. Discover current CLI arguments with `--help`; reuse linked resources and avoid provisioning/deploying services for ordinary article work.

For read-only deduplication, inspect all current post and translation titles, excerpts, slugs, statuses and publication dates. A metadata-only check can miss an event buried inside an existing article: record this limitation and inspect body content for close matches. Read existing connection configuration without printing it.

A renderer preview is available when the existing app can run with its normal read-only database access, or a temporary fixture can import the actual `BlogContent` and `BlogCard` with draft props. Use a temporary fixture outside the worktree when the owner-only draft page cannot be opened. A fixture verifies rendering only; it does not prove admin authorization or publication. Never mark a preview as performed after merely validating JSON.
