# Free portfolio analytics implementation plan

> **For agentic workers:** Use `executing-plans` to implement the tasks inline. Initial implementation authorization excluded Git writes and production mutations; see the release authorization below.

**Goal:** Add private website analytics, CSV exports, and daily GitHub repository traffic collection without a paid analytics dependency.

**Architecture:** An opt-in, cookie-free public collector writes bounded anonymous events directly to existing Postgres. Admin reads bypass response caches and refresh on demand, focus, and every minute while visible. Website days roll over at midnight Asia/Ho_Chi_Minh independently of cron. A daily 17:00 UTC cron cleans records older than 90 days and upserts GitHub's UTC daily traffic; history is never zeroed. Existing contribution-streak cron stays unchanged.

**Tech stack:** Existing Next.js, React, TypeScript, pg/Drizzle, Zod, Node test runner, Tailwind and Lucide.

**Spec:** User conversation: implement the proposed website metrics and repository traffic, export CSV, stay free, reset daily without cache sync delays. Reset is interpreted as a new daily bucket, preserving history.

## Global constraints

- Preserve existing edits to AGENTS.md, projects, CV PDF, and CV tests.
- Use existing design tokens and admin visual language; no dependencies or animated dashboard decoration.
- No names, emails, raw IPs, full user agents, URL queries, cookies, or persistent browser identifiers in analytics storage.
- Daily HMAC visitor estimates; respect DNT/GPC; exclude admin/API routes and obvious bots.
- Bound body size, collection rate/storage, GitHub requests, date range, and export size.
- Website metrics are fresh database reads; GitHub traffic remains limited by GitHub's own reporting delay and once-daily free cron.
- No live service setup, automatic upgrade, payment method, or external mutation.

## Review focus

- Midnight UTC+7 rollover and GitHub's UTC day labels must remain distinct.
- Unauthorized reads/exports/syncs must not reveal any analytics or credentials.
- Duplicate events, repeated cron invocations and partial GitHub failures must preserve good history.
- Missing configuration/database failures must not break public navigation or invent zero traffic.
- Sensitive URL data, spreadsheet formulas, bot floods and tab visibility must be handled safely.

### Task 1: Collection and storage

- [x] Write and run failing tests for Vietnam day boundaries, normalization, daily visitor hashing, validation, CSV safety, and collector authorization/privacy/failure behavior.
- [x] Implement pure analytics helpers, bounded SQL storage, opt-in collector route, schema and scoped migration.
- [x] Run focused tests and check idempotent writes, rate limits and retention SQL.

### Task 2: GitHub and daily maintenance

- [x] Write and run failing tests for token/repo config, UTC traffic validation, no-store bounded requests, cron authentication and partial failure.
- [x] Implement GitHub traffic fetch/upsert, maintenance cron at `0 17 * * *`, and preserve existing cron.
- [x] Verify duplicate syncs update counts instead of adding and failed repositories retain last data.

### Task 3: Admin and public integration

- [x] Implement protected no-store JSON/CSV API, admin navigation and responsive Analytics page with 7/30/90 day filters, refresh and sync feedback, empty/error/configuration states.
- [x] Add public route/click tracking plus privacy disclosure and DNT/GPC handling, without changing public rendering mode.
- [x] Update environment examples and setup/retention/rollover documentation, preserving unrelated edits.
- [x] Run tests, typecheck, lint, build; review accessibility/React; verify mobile/tablet/desktop in browser with isolated fixtures where real admin authentication is unavailable.

## Execution notes

- Baseline: 39 tests passed. Existing checkout is main with user edits; implementation stays in place under the authorized request and does not create a branch/worktree or commit.
- Skill approval/commit defaults are superseded by the user's implementation request and workspace restrictions. A final independent reviewer will review the concrete local diff.

- Task 1: complete. Pure/collector tests RED then GREEN; real Postgres integration validates immediate reads, duplicate IDs, concurrent daily quota and concurrent per-visitor throttle, and retention.
- Task 2: complete. Traffic/cron tests RED then GREEN; captured UTC windows accept GitHub's documented 15 inclusive daily buckets, reject out-of-window data, and keep failed history. Shared lease bounds manual/cron overlap.
- Task 3: complete. Admin tests RED then GREEN; browser reproduced stale-range sync bug and passes after latest-callback fix. Real browser collector writes to disposable Postgres; real dashboard/CSV use that data in isolated fixture.
- Final review: one independent read-only reviewer; important findings fixed and verified. UI-UX Pro Max and React review completed with focus/overflow/controls/reduced-motion checks. Minor findings recorded in docs/analytics.md.
- Ruling: daily reset is a Vietnam date rollover, never destructive history reset; cost if wrong is a different retention/export product requirement.
- Ruling: website reads remain uncached; GitHub traffic follows its source reporting cadence, daily cron and an owner-triggered sync with five-minute lease; cost if wrong is increased source/compute usage for more frequent polling.
- Verification: 89/89 Node tests including disposable real Postgres; typecheck/lint/build exit 0. Browser screenshots 375/768/1440px, CSV download, auto-refresh, keyboard focus, error and reduced-motion states passed with no page errors. Local production unauthenticated admin returns 307 to sign-in; JSON/CSV/cron return 401, APIs no-store. Real production OAuth/token/cron delivery and account quotas remain unverified.
- No commits, branches, live migrations, environment changes, deployment, or paid dependencies. User changes preserved.

## Release authorization (18 November 2026)

The owner confirmed that pushing this repository deploys production through its existing Git integration and asked to proceed. The Analytics release may be committed and pushed to the existing production branch `main`; required scoped analytics migration and production analytics configuration are part of activation. Existing CV/project/capabilities edits remain unstaged. No paid services or broad GitHub credential reuse is authorized. GitHub repository traffic remains optional until a dedicated server token is configured.
