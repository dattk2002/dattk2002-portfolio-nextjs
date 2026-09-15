<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tran Kim Dat Portfolio — Repository Guide

This file is the durable source of truth for agents working in this repository. Read it before planning or editing. User instructions for the current task take precedence. When this document disagrees with executable code, inspect the code and update this document as part of the same change when the mismatch is durable.

## Product in one sentence

This is Tran Kim Dat's production portfolio: an editorial, responsive, evidence-led product that positions him as a full-stack developer who can carry web and cross-platform products from interface design through APIs, data, testing, infrastructure, and release.

## Product goals and audience

Primary audiences are recruiters, hiring managers, technical leads, founders, and product teams evaluating full-stack ownership. The site should let a visitor establish the following quickly:

- who Tran Kim Dat is, where he is based, and what opportunities he wants;
- the products he has shipped, his exact role, and evidence of outcomes;
- the breadth of his technical ownership without presenting a generic technology dump;
- how to inspect a case study, download the latest CV, view GitHub/LinkedIn, or make contact.

The desired impression is capable, intentional, technically credible, and product-minded. Prefer concrete evidence over self-promotional adjectives. Never invent metrics, employers, dates, roles, certifications, technologies, URLs, or business outcomes. If a requested content change cannot be verified from the repository or user-provided material, ask for the missing fact or label the wording as a proposal.

## Owner profile and public identity

- Name: Tran Kim Dat
- Role: Full-stack Developer
- Location: Da Nang City / Ho Chi Minh City, Vietnam
- Experience claim currently used in the hero: 3+ years
- Education: FPT University, Bachelor's Degree in Software Engineering, Sep 2021–Sep 2025, graduated, GPA 8.1/10 (3.24/4)
- Availability: full-stack opportunities; remote, Da Nang, or Ho Chi Minh City
- Canonical production origin: `https://www.dattk.dev`
- Apex domain: `https://dattk.dev`, expected to resolve to the canonical `www` deployment
- GitHub: `https://github.com/dattk2002`
- LinkedIn: `https://www.linkedin.com/in/kimdat0705/`
- Public contact email and phone are centralized in `lib/site.ts`; do not duplicate or silently change them elsewhere.
- The source Google Doc for the CV and the bundled PDF fallback are implementation details of `app/api/cv/route.ts`; do not expose the document ID in new UI or documentation.

## Brand narrative and content principles

The core positioning line is: “I build digital products from interface to infrastructure.” The supporting narrative is end-to-end product ownership: architecture, interface, API and data, quality, then deployment. Preserve that through-line when changing copy or information architecture.

Writing is English, concise, specific, and evidence-led. Use active voice. Explain the product problem, ownership, approach, and observable result. Avoid vague claims such as “cutting-edge,” “world-class,” “passionate,” or “expert” unless supplied and justified by the user. Keep claims consistent across the homepage, project case studies, experience timeline, metadata, README, and CV-facing text.

## Current portfolio inventory

The canonical case-study records live in `lib/projects.ts`; the following table is an orientation map, not a second editable content source.

| Project | Context / period | Core ownership and evidence |
| --- | --- | --- |
| Fastcare | Client production, Dec 2023–Aug 2024 | Frontend ownership plus Laravel admin workflows; 20+ screens; booking, catalog, and content flows. This is currently the only `featured: true` project. |
| HabiStride | Independent, May–Jun 2026 | Next.js + NestJS + PostgreSQL habit product; 24 REST handlers, 7 controllers, 10 TypeORM entities, daily Asia/Bangkok snapshots. |
| NgoaiNguNgay | Capstone, May–Sep 2025 | Role-aware React/Vite language learning, tutoring, booking, and SignalR messaging; 16 routes and 79 component files. |
| Trivia Quiz | Independent, Apr–May 2026 | Next.js + MongoDB session-based quiz; server-side answer validation, duplicate-score protection, and 1-hour TTL cleanup. |
| TapMood | Independent, Jun–Jul 2026 | Flutter + ASP.NET Core social product; 117 REST mappings, resumable verified uploads up to 250 MB, 92 automated tests, real-time and worker-backed flows. |
| Caocao Adventures | Client production, 2025 | React travel discovery, rental, and booking experience; three core modules delivered to production in two months. |
| TamdaCMS / TamdaOne | Client production, Oct 2025–May 2026 | Next.js/Strapi multi-brand publishing foundation; 10 production features, 5 verticals, and 12+ content schemas. |
| VNCaps | Client production, Dec 2023–Aug 2024 | React Native/Expo role-aware school application; 15+ screens, timetable rendering, and push notifications. |
| LMS FSoft Education Management | FPT Software internship, Feb–Apr 2023 | Angular frontend work in a six-person team; class list/detail and seven calendar/class states. This item exists only as a detailed experience record, not a `/projects/[slug]` case study. |

The homepage currently represents seven milestones and nine total projects. If records are added or removed, update derived UI labels rather than leaving hard-coded counts stale.

## Information architecture and routes

- `/`: fixed navigation, hero, responsive positioning statement, selected work, delivery pipeline and technology marquee, professional experience, education/certifications, contact, and footer.
- `/projects/[slug]`: statically generated project case studies with project metadata, hero artwork, ownership, verified outcomes, challenge/approach, architecture, gallery, links, circular previous/next navigation, and CTA.
- `/blog`: public, database-backed article index with a locale filter, tagged article cards, and a reduced-motion-aware GSAP owner transition to the protected admin workspace; published translations are cached and invalidated by the admin workflow.
- `/blog/[locale]/[slug]`: localized English or Vietnamese articles with safe structured-content rendering, alternate-language links, article metadata, JSON-LD, and privacy-enhanced YouTube embeds.
- `/blog/rss.xml`: RSS feed for published article translations.
- `/admin` redirects to `/admin/sign-in`; `/admin/sign-in` opens GitHub OAuth in a new tab, and `/admin/blog/**` is the protected blog workspace. Authorization is restricted exclusively to the configured immutable GitHub account ID.
- `/api/auth/[...path]`: Neon Auth handler. `/api/blog/upload` issues authenticated client-upload tokens for Vercel Blob images.
- `/api/cv`: attempts a Google Docs PDF export with an 8-second timeout and size/signature validation, then falls back to `public/documents/CV-Tran Kim Dat-Full-stack Developer.pdf`; returns 503 if both fail.
- `/api/github-stats`: fetches contribution history, calculates total/current/longest streaks in the Asia/Bangkok time zone, caches success for one hour, and degrades to a 503 JSON response.
- `app/actions/contact.ts`: contact Server Action with Zod validation, a honeypot, header-injection sanitization, optional Upstash rate limiting, and a Resend batch containing the owner notification plus visitor confirmation.
- `/opengraph-image` and `/projects/[slug]/opengraph-image`: generated 1200×630 social images.
- `/sitemap.xml` and `/robots.txt`: generated through Next.js metadata conventions.

## Architecture and source-of-truth map

The project is a single Next.js App Router application deployed to Vercel. Content-heavy pages are statically generated where possible; dynamic and credentialed work remains in route handlers or Server Actions.

| Concern | Canonical file(s) |
| --- | --- |
| Owner identity, links, portrait, CV filename, canonical URL resolution | `lib/site.ts` |
| Case-study schema, copy, ordering, images, links, featured state | `lib/projects.ts` |
| Career timeline and the non-case-study LMS record | `lib/experience.ts` |
| Delivery pipeline and technology marquee | `lib/capabilities.ts` |
| Homepage composition and education/certifications | `app/page.tsx` |
| Global metadata, fonts, language, viewport | `app/layout.tsx` |
| Design tokens, global motion/accessibility/print behavior | `app/globals.css` |
| Case-study rendering and static params | `app/projects/[slug]/page.tsx` |
| Navigation and mobile dialog | `components/site-navigation.tsx` |
| Work carousel | `components/project-showcase.tsx` |
| Expandable/drag-scroll career timeline | `components/experience-timeline.tsx` |
| Project media treatment | `components/project-artwork.tsx` |
| Contact client state | `components/contact-form.tsx` |
| Contact validation, abuse protection, and email | `app/actions/contact.ts` |
| Live GitHub activity | `components/github-stats.tsx`, `app/api/github-stats/route.ts` |
| Dynamic CV delivery | `app/api/cv/route.ts` |
| Blog schema and migrations | `lib/db/schema.ts`, `drizzle/` |
| Blog queries, validation, and structured content types | `lib/blog/data.ts`, `lib/blog/validation.ts`, `lib/blog/types.ts` |
| Public blog index and article rendering | `app/blog/`, `components/blog-card.tsx`, `components/blog-content.tsx` |
| Blog administration and editor | `app/admin/blog/`, `components/admin/blog-post-editor.tsx`, `components/admin/notion-editor.tsx` |
| Blog authentication and authorization | `lib/auth/`, `proxy.ts`, `app/api/auth/[...path]/route.ts` |
| Blog image uploads | `app/api/blog/upload/route.ts`, `components/admin/image-upload-button.tsx` |
| Public media | `public/images`, `public/documents` |

Do not create competing arrays, contact constants, project facts, or design tokens in components. Extend the canonical model and let consumers derive their output.

## Technology baseline

- Next.js App Router, React, TypeScript in strict mode
- Tailwind CSS v4 through `@import "tailwindcss"` and CSS theme tokens
- shadcn/ui conventions with Radix primitives; current shared primitive is `components/ui/button.tsx`
- Framer Motion for reveals and motion preferences; GSAP for the admin route transition
- Embla Carousel and Embla Auto Scroll for draggable content
- Lucide React icons
- Zod and React Server Actions for contact validation/submission
- Neon Postgres with Drizzle ORM and versioned SQL migrations
- Neon Auth with GitHub OAuth for the single-owner admin workspace
- Tiptap structured JSON editing and Vercel Blob image uploads for blog publishing
- Resend for transactional email; optional Upstash Redis REST for rate limiting
- `next/image`, `next/font`, and `ImageResponse` for media, fonts, and OG images
- Yarn 4.9.2 via Corepack; Node.js 24.x

Dependencies use several `latest` ranges. Never rely on remembered framework behavior. Once dependencies are installed, inspect the relevant guide under `node_modules/next/dist/docs/` before changing Next.js code. If `node_modules` is absent, install with `corepack yarn install` only when the task authorizes normal dependency setup.

## Existing visual system

This is a dark editorial portfolio, not a generic SaaS dashboard. Preserve its identity unless the user explicitly requests a redesign.

- Palette tokens: background `#090b0c`, foreground `#f1efe7`, surface `#101416`, raised surface `#151a1d`, muted `#a7adb0`, faint `#70787d`, lime accent `#c7f36b`, steel `#7ea2b8`, border `#2a3135`, error `#ff7b72`, success `#9be28c`.
- Type: Outfit for expressive display text, Geist Sans for body copy, Geist Mono for metadata/labels. Preserve wide editorial headings, tight display tracking, and small uppercase mono labels when they fit the existing hierarchy.
- Layout: mobile-first; `px-5`, `md:px-8`, `lg:px-12`; content usually caps at `max-w-[90rem]`, with the hero at `max-w-[100rem]` and navigation at `max-w-[86rem]`.
- Shape: restrained rounded rectangles (`rounded-md`, `rounded-xl`) and fine borders, not a page full of interchangeable cards or pills.
- Atmosphere: subtle ambient grid, radial light, image overlays, high contrast, and generous section rhythm.
- Motion: purposeful reveal, drag, marquee, word-scrub, and hover feedback. Every new motion path must respect `prefers-reduced-motion` and must not cause horizontal overflow.
- Media: use local optimized WebP assets with descriptive alt text. Decorative images use empty alt text. Preserve reserved dimensions to avoid layout shift.
- Icons: use the existing Lucide set or the brand SVG; do not use emoji as interface icons.

## Interaction and accessibility invariants

- Maintain complete keyboard operation for navigation, carousels, accordions, forms, and links.
- Keep visible `:focus-visible` treatment and meaningful accessible names for icon-only controls.
- Interactive targets should be at least 44×44 CSS pixels where practical.
- Do not make hover the only route to content or an action.
- Announce asynchronous form status, keep errors adjacent to fields, and preserve pending/disabled feedback.
- Respect reduced motion in both JavaScript and CSS; print output must not leave revealed content invisible.
- Prevent accidental click activation after dragging; preserve touch vertical scrolling in horizontal carousels.
- External links use `target="_blank"` with `rel="noreferrer"`.
- Do not reduce contrast, remove labels, disable zoom, or remove focus outlines for aesthetic reasons.

## Content and feature change rules

When adding or editing a project:

1. Update `lib/projects.ts` first and keep the `Project` type honest; use a unique lowercase slug.
2. Provide only verified ownership and outcomes. Keep `summary`, `challenge`, `approach`, and architecture distinct rather than repeating the same sentence.
3. Add optimized media under `public/images/projects/` with accurate alt text and confirm the artwork/gallery treatment at phone, tablet, and desktop sizes.
4. Confirm the new static route, metadata, OG image, sitemap entry, homepage carousel, experience references, and previous/next pagination.
5. Update `lib/experience.ts` only when the item belongs in the professional timeline. Reuse a slug reference when it is already a canonical project; use an inline detail only for work that should not have a case-study route.
6. Re-check hard-coded counts and README screenshots/documentation if the visible product changed materially.

When changing owner facts, links, or contact details, update `lib/site.ts` and then search for intentional hard-coded prose in metadata, homepage/footer copy, OG text, README, and the PDF/CV workflow.

When changing design, extend existing CSS variables and component patterns before adding one-off raw colors or another UI library. Do not introduce GSAP, a new icon package, analytics, tracking, a CMS, or another runtime dependency unless the user asks for it or explicitly accepts the tradeoff.

## Security and privacy boundaries

- Never commit `.env.local`, API keys, tokens, or real secret values. `.env.example` contains names and safe placeholders only.
- Server-only variables: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `ADMIN_GITHUB_ACCOUNT_ID`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CONTACT_RATE_LIMIT_MAX`, and `CONTACT_RATE_LIMIT_WINDOW_SECONDS`.
- Public configuration: `NEXT_PUBLIC_SITE_URL`; production should use `https://www.dattk.dev`.
- Treat all editor JSON as untrusted input: validate supported nodes on write and render nodes through the explicit component allowlist rather than injecting stored HTML.
- Protect every admin mutation and upload route with `requireAdmin`; proxy redirects are navigation UX, not the authorization boundary.
- Preserve contact validation, the honeypot, subject/name CRLF sanitization, server-only email delivery, and rate-limit privacy hashing.
- Do not add analytics, advertising, cookies, or other tracking silently. Adding non-essential tracking changes the current privacy/cookie-consent assumption and requires an explicit product decision.
- Bound third-party requests with timeouts and graceful fallbacks. Do not expose upstream errors, credentials, document IDs, or visitor data to the browser or logs.

## Working method

Start with the smallest relevant source files from the map above. Preserve unrelated user changes in a dirty worktree. Prefer focused edits over broad rewrites. Match the language of the user's prompt when communicating, while keeping public portfolio copy in English unless translation is explicitly requested.

For UI work, use the repo-local `portfolio-workflow` skill. Its role split is deliberate: `gpt-taste` may guide visual execution on substantial design tasks, while `ui-ux-pro-max` provides an independent UX/accessibility review. Neither external skill overrides this established design system, the user's request, or dependency boundaries.

## Verification and definition of done

Use the checks proportionate to the change. The standard full gate is:

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn build
```

For visible changes, also run the app and verify the affected journey in a browser at narrow mobile, tablet, and desktop widths. Check browser console errors, keyboard navigation, focus visibility, overflow, reduced motion, loading/error/success states, image quality, and internal/external links. For API or Server Action changes, verify success, validation failure, missing configuration, upstream timeout/failure, and fallback behavior without using production secrets.

A task is done when the requested behavior is implemented, relevant checks pass, no unrelated files were reformatted, and durable architecture/content/workflow changes are reflected in this file when needed.
