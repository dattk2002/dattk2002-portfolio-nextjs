"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AnalyticsReport, Breakdown } from "@/lib/analytics-shared";

const number = new Intl.NumberFormat("en-US");
const time = (value: string | null) => value ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not synced yet";

function BreakdownList({ title, rows }: { title: string; rows: Breakdown[] }) {
  return <section className="min-w-0 border-t border-border pt-6">
    <h2 className="font-display text-2xl tracking-tight">{title}</h2>
    {rows.length ? <ol className="mt-4 divide-y divide-border">{rows.slice(0, 10).map(row => <li key={row.label} className="flex items-start justify-between gap-4 py-3 text-sm"><span className="min-w-0 break-all text-muted">{row.label}</span><span className="shrink-0 font-mono text-foreground">{number.format(row.count)}</span></li>)}</ol> : <p className="mt-4 text-sm text-muted">No pageviews recorded in this period.</p>}
  </section>;
}

export function AnalyticsDashboard() {
  const [days, setDays] = useState(7);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const active = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    active.current?.abort();
    const controller = new AbortController(); active.current = controller;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?days=${days}`, { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(response.status === 401 ? "Your session expired. Sign in again to view analytics." : "Analytics could not be loaded. Check database setup, then try again.");
      const data: AnalyticsReport = await response.json();
      if (!controller.signal.aborted) { setReport(data); setError(""); }
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Analytics could not be loaded.");
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }, [days]);

  const latestRefresh = useRef(refresh);
  useEffect(() => { latestRefresh.current = refresh; }, [refresh]);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const visibleRefresh = () => { if (document.visibilityState === "visible") void refresh(); };
    const interval = window.setInterval(visibleRefresh, 60_000);
    window.addEventListener("focus", visibleRefresh);
    document.addEventListener("visibilitychange", visibleRefresh);
    return () => { active.current?.abort(); window.clearTimeout(initial); window.clearInterval(interval); window.removeEventListener("focus", visibleRefresh); document.removeEventListener("visibilitychange", visibleRefresh); };
  }, [refresh]);

  // Day rollover is clock-driven; a late cron never keeps yesterday's "today" bucket.
  useEffect(() => {
    if (!report) return;
    const timeout = window.setTimeout(() => void refresh(), Math.max(1000, new Date(report.nextResetAt).getTime() - Date.now() + 250));
    return () => window.clearTimeout(timeout);
  }, [report, refresh]);

  async function syncGithub() {
    setSyncing(true); setSyncMessage("");
    try {
      const response = await fetch("/api/admin/analytics", { method: "POST", signal: AbortSignal.timeout(60_000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.failed ? "Some repositories could not sync. Previous successful data is preserved; check token permissions." : "GitHub sync failed. Previous successful data is preserved.");
      setSyncMessage(!result.configured ? "Configure the GitHub traffic token and repositories first." : result.skipped ? "A sync has already started recently. Try again after five minutes." : "GitHub traffic synced. GitHub may still be processing recent visits.");
    } catch (failure) { setSyncMessage(failure instanceof Error ? failure.message : "GitHub sync failed."); }
    finally { setSyncing(false); void latestRefresh.current(); }
  }

  const current = report?.days === days ? report : null;
  const summary = current ? [["Pageviews", current.totals.pageviews], ["Daily visitor estimates", current.totals.visitors], ["CV clicks", current.totals.cvClicks], ["GitHub clicks", current.totals.githubClicks], ["Contact clicks", current.totals.contactClicks]] as const : [];

  return <div className="mx-auto max-w-[100rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
    <div className="flex flex-col gap-6 border-b border-border pb-8 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0"><p className="font-mono text-xs uppercase tracking-[0.16em] text-steel">Audience & activity</p><h1 className="mt-3 max-w-5xl font-display text-5xl tracking-[-0.06em] sm:text-7xl">Analytics</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Anonymous website activity and GitHub repository traffic. Website days start at 00:00 Vietnam time.</p></div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-2 text-xs text-muted" htmlFor="analytics-period">Period<select id="analytics-period" value={days} onChange={event => setDays(Number(event.target.value))} className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm text-foreground">{[7, 30, 90].map(value => <option key={value} value={value}>Last {value} days</option>)}</select></label>
        <Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className="size-4" aria-hidden="true" />{loading ? "Refreshing..." : "Refresh"}</Button>
        <Button variant="outline" asChild><a href={`/api/admin/analytics?days=${days}&format=csv`} download><Download className="size-4" aria-hidden="true" />Export CSV</a></Button>
      </div>
    </div>

    <p className="mt-4 min-h-6 text-xs leading-5 text-muted" role="status">{loading ? "Reading the latest data..." : current ? `Last read ${time(current.generatedAt)} (Vietnam). Updates every minute while this tab is visible.` : "No data loaded."}</p>
    {error ? <div role="alert" className="mt-4 rounded-md border border-error/40 bg-surface p-4 text-sm leading-6 text-error">{error} {report ? "The last successful result may be out of date." : ""}<a href="/admin/sign-in" className="ml-2 inline-flex min-h-11 items-center underline">Sign in</a></div> : null}
    {current ? <>
      {!current.collectionEnabled ? <p className="mt-4 border-l-2 border-steel bg-surface p-4 text-sm leading-6 text-muted">Website collection is disabled. Enable anonymous analytics in the deployment configuration to start recording new visits.</p> : null}
      {current.todayCollected >= current.dailyLimit ? <p role="status" className="mt-4 border-l-2 border-steel bg-surface p-4 text-sm text-muted">Today&apos;s collection limit has been reached. Recording resumes after midnight Vietnam time.</p> : null}
      <dl className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-3 lg:grid-cols-5">{summary.map(([label, value]) => <div key={label} className="min-w-0 border-border px-3 py-6 first:pl-0 sm:px-5"><dt className="text-xs leading-5 text-muted">{label}</dt><dd className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{number.format(value)}</dd></div>)}</dl>
      <p className="mt-3 max-w-3xl text-xs leading-5 text-muted">Visitor estimates reset daily. Their sum may include the same person on different days. Clicks indicate intent; they do not confirm a completed download or identify a visitor.</p>

      <section className="mt-10" aria-labelledby="daily-heading"><h2 id="daily-heading" className="font-display text-3xl tracking-tight">Website by day</h2>
        <div className="mt-5 overflow-x-auto rounded-md border border-border focus-visible:outline-2 focus-visible:outline-accent" tabIndex={0} role="region" aria-label="Daily website activity, scroll horizontally for all metrics">
          <table className="w-full min-w-[640px] text-left text-sm"><caption className="sr-only">Website activity for the last {days} days in Vietnam time</caption><thead className="bg-surface text-xs text-muted"><tr>{["Date (Vietnam)", "Views", "Visitors", "CV clicks", "GitHub clicks", "Contact clicks"].map(label => <th key={label} scope="col" className="whitespace-nowrap px-4 py-4 font-medium">{label}</th>)}</tr></thead><tbody>{current.daily.toReversed().map(row => <tr key={row.day} className="border-t border-border"><th scope="row" className="whitespace-nowrap px-4 py-3 font-normal text-muted">{row.day}</th>{[row.pageviews, row.visitors, row.cvClicks, row.githubClicks, row.contactClicks].map((value, i) => <td key={i} className="px-4 py-3 font-mono text-xs">{number.format(value)}</td>)}</tr>)}</tbody></table>
        </div>
        {current.totals.pageviews === 0 ? <p className="mt-4 text-sm text-muted">No website pageviews recorded yet. New activity will appear here after collection is enabled.</p> : null}
      </section>

      <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3"><BreakdownList title="Top pages" rows={current.pages} /><BreakdownList title="Referring sites" rows={current.referrers} /><BreakdownList title="Devices" rows={current.devices} /><BreakdownList title="Browsers" rows={current.browsers} /><BreakdownList title="Countries (approximate)" rows={current.countries} /></div>

      <section className="mt-12 border-t border-border pt-8" aria-labelledby="github-heading">
        <div className="flex flex-wrap items-center justify-between gap-4"><h2 id="github-heading" className="font-display text-3xl tracking-tight">GitHub repositories</h2><Button variant="outline" onClick={() => void syncGithub()} disabled={syncing || !current.github.configured}><RefreshCw className="size-4" aria-hidden="true" />{syncing ? "Syncing GitHub..." : "Sync GitHub now"}</Button></div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">Daily sync is scheduled for midnight Vietnam time; the free scheduler may run within the following hour. GitHub reports repository traffic in UTC and may delay its own counts. Profile viewer identities are unavailable.</p>
        <p className="mt-2 min-h-5 text-sm text-steel" role="status">{syncMessage}</p>
        {!current.github.configured ? <p className="mt-3 border-l-2 border-steel bg-surface p-4 text-sm leading-6 text-muted">GitHub traffic is not configured. Add a token with read access to repository administration and select the repositories to collect.</p> : null}
        {current.github.repositories.length ? <div className="mt-5 space-y-0 divide-y divide-border border-y border-border">{current.github.repositories.map(repo => <article key={repo.repo} className="grid gap-4 py-6 lg:grid-cols-[minmax(0,1fr)_1fr]">
          <div className="min-w-0"><h3 className="break-all text-base">{repo.repo}</h3><p className="mt-2 text-xs leading-5 text-muted">Last successful sync: {time(repo.syncedAt)} (Vietnam)</p>{repo.failed || !repo.syncedAt || new Date(current.generatedAt).getTime() - new Date(repo.syncedAt).getTime() > 26 * 3_600_000 ? <p className="mt-2 text-sm text-error">{repo.failed ? "Latest sync failed. Showing previous successful data." : "Waiting for a fresh sync."}</p> : null}</div>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[["Views", repo.views], ["Visitor-days", repo.visitorDays], ["Clones", repo.clones], ["Cloner-days", repo.clonerDays]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 font-mono text-lg">{number.format(Number(value))}</dd></div>)}</dl>
        </article>)}</div> : <p className="mt-4 text-sm text-muted">No repository traffic has been synced yet.</p>}
        <p className="mt-4 text-xs leading-5 text-muted">Visitor-days and cloner-days sum GitHub&apos;s daily unique counts. They are not unique people across the selected period. GitHub initially provides up to 14 days; collection builds history for up to 90 days.</p>
      </section>
      <p className="mt-10 border-t border-border pt-5 text-xs leading-5 text-muted">Website events and repository traffic are retained for 90 days. Collection is capped at {number.format(current.dailyLimit)} website events per Vietnam day to bound storage. Hosting and database free-tier quotas still apply.</p>
    </> : loading ? <p className="py-16 text-muted" role="status">Loading audience data...</p> : null}
  </div>;
}
