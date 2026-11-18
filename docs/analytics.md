# Portfolio analytics

The private `/admin/analytics` workspace reads anonymous website activity directly from Postgres, provides 7/30/90 day ranges and CSV export, and shows GitHub repository views and clones. Open it through **Analytics** in the blog admin header.

## Free services and activation

Uses the existing application/database, GitHub REST API, and daily Vercel cron. No analytics subscription, dependency, trial, payment method, or paid upgrade is introduced. Hosting and Postgres quotas still apply; free capacity is finite. Collection is capped at 2,000 event attempts per Vietnam day, with a short-window visitor throttle. This bounds storage, not every possible network request under abusive traffic.

1. Review pending migrations. `0001_add_resilient_document_delivery_article.sql` publishes an article. For an analytics-only release, apply the idempotent `drizzle/0003_portfolio_analytics.sql` as a scoped migration without marking the pending article migration as applied. The analytics migration is also registered in the full Drizzle journal for later normal runs. Do not run the entire journal blindly.
2. Set `ANALYTICS_SECRET` to a server-only random value of at least 32 characters and `NEXT_PUBLIC_ANALYTICS_ENABLED=true`. Keep collection off on previews unless deliberately including those visits. The public flag requires a rebuild. Collection failures do not block public navigation.
3. Set the existing `CRON_SECRET`. Deploy separately when authorized. The new `/api/cron/analytics` schedule is `0 17 * * *` (00:00 Vietnam). The contribution-streak cron at `0 0 * * *` is unchanged.
4. Optionally set `GITHUB_TRAFFIC_TOKEN` and `GITHUB_TRAFFIC_REPOS=owner/repo,owner/another` (up to ten). Use a fine-grained token with **Administration: read** on those repositories. GitHub requires repository push access. Owner OAuth login does not automatically grant traffic API access.
5. Use **Sync GitHub now** to initialize traffic after deployment. A shared five-minute database lease bounds manual/cron overlap. No credentials are returned to the browser.

Live migrations, environment changes, commits, pushes, and deployment require separate authorization.

## Freshness and daily reset

Website events are written on collection. Authenticated JSON and CSV responses are `no-store`. The visible dashboard reads every minute, on focus, on visibility restoration, and through **Refresh**, with a visible read timestamp.

At 00:00 `Asia/Ho_Chi_Minh` a new website day begins automatically, the budget starts again, and the dashboard refreshes. Yesterday remains in history. Delayed or failed cron cannot delay this rollover. The daily cron prunes data beyond 90 calendar days; it never zeroes current counters or deletes yesterday.

Vercel Hobby cron can run within the scheduled hour. GitHub itself updates traffic periodically, so an uncached fetch may return counts GitHub has not refreshed. Repository dates are UTC, distinct from website dates. First sync retrieves up to 14 days; daily runs build up to 90 days of history. Each repository's rolling window is replaced in a transaction. Failed repositories retain previous successful data and show a failure marker; others still sync. Requests have five-second timeouts with at most three repositories in flight.

## Metrics and privacy

- Pageviews, summed daily visitor estimates, CV link clicks (download or preview), GitHub clicks, and email/phone clicks. Clicks do not confirm completed downloads or sent messages.
- Top 20 public paths, referring hostnames, device/browser categories, approximate countries. Country is unknown without platform geolocation headers.
- Only supported public route shapes are accepted. Admin/API paths, URL queries/fragments, obvious bots and prefetches are excluded. Referrers contain hostnames only.
- Visitor estimates use a keyed hash of request IP and browser information, salted by the Vietnam date. Raw IPs and full user agents are never stored. No analytics cookies or browser storage. Browser and server respect DNT/GPC.
- Daily visitor sums and GitHub visitor-days are **not deduplicated people across a date range**. No feature identifies GitHub profile viewers.
- `/privacy` discloses analytics and opt-out signals. Admin reads, exports and syncs enforce owner authorization independently of proxy redirects. CSV values are quoted and spreadsheet formula prefixes neutralized.

## Verification

Run `corepack yarn test`, `corepack yarn typecheck`, `corepack yarn lint`, `corepack yarn build`.

The optional storage integration suite accepts only a disposable loopback test database through `TEST_ANALYTICS_DATABASE_URL`, never the production URL. Browser checks can use an isolated fixture server for the real dashboard component if owner OAuth is unavailable; this does not verify live authentication, GitHub permissions, or scheduler delivery.

References: [GitHub traffic API](https://docs.github.com/en/rest/metrics/traffic), [Vercel cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing), [Neon Free plan](https://neon.com/pricing).

## Verification record (17 November 2026)

- 89 Node tests passed, including real disposable PostgreSQL integration: duplicate events, simultaneous quota/rate-limit requests, repeated migrations/cron runs, retention boundaries, sync leases, replacement rather than additive traffic, and partial repository failures.
- Typecheck, lint, and production build passed. Browser checks used the real layout, tracker, dashboard and API with a test-only owner identity replacement in a separate `/tmp` application and a disposable local database. No production authentication was bypassed or changed.
- Verified browser → collector → database → dashboard, actual CSV download and date filters, automatic visible-tab refresh, visible keyboard focus, reduced-motion rendering, retained data on errors, and no browser page errors. Inspected screenshots at 375, 768 and 1440 CSS pixels; no document overflow and controls at least 44px high.
- A browser regression reproduces the period-change-during-sync failure before its fix and passes afterward. The return-from-excluded-route journey passes with route-aware deduplication.
- The local production build served `/privacy` at 200 without overflow at all three widths, redirected signed-out `/admin/analytics` to sign-in, and returned uncached 401 for private JSON/CSV and unauthenticated cron requests.
- Real production OAuth, deployed cron delivery, GitHub token permissions, live quotas, and production migration were not exercised. Initial activation remains a separate deployment task.

### Small limits deferred after review

- Middle-button (`auxclick`) link activations are not counted by the click tracker.
- The repository validator currently rejects dot-prefixed repository names such as `.github`.
- Repository configuration deduplicates exact strings; casing variants can create duplicate repository entries because GitHub names are case-insensitive.
