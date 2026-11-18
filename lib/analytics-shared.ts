export const ANALYTICS_TIME_ZONE = "Asia/Ho_Chi_Minh";
export const ANALYTICS_RETENTION_DAYS = 90;
export const ANALYTICS_DAILY_LIMIT = 2_000;
export const eventKinds = ["pageview", "cv_click", "github_click", "contact_click"] as const;
export type EventKind = typeof eventKinds[number];

export function isTrackablePath(path: string) {
  return /^(\/|\/blog|\/privacy|\/projects\/[a-zA-Z0-9_-]+|\/blog\/(en|vi)\/[a-zA-Z0-9_-]+)$/.test(path) && path.length <= 200;
}

export type DailyAnalytics = {
  day: string; pageviews: number; visitors: number; cvClicks: number; githubClicks: number; contactClicks: number;
};
export type Breakdown = { label: string; count: number };
export type GithubRepositoryAnalytics = {
  repo: string; syncedAt: string | null; attemptedAt: string; failed: boolean;
  views: number; visitorDays: number; clones: number; clonerDays: number;
};
export type AnalyticsReport = {
  generatedAt: string; days: number; timeZone: string; nextResetAt: string;
  collectionEnabled: boolean; dailyLimit: number; todayCollected: number;
  daily: DailyAnalytics[];
  totals: Omit<DailyAnalytics, "day">;
  pages: Breakdown[]; referrers: Breakdown[]; devices: Breakdown[]; browsers: Breakdown[]; countries: Breakdown[];
  github: { configured: boolean; repositories: GithubRepositoryAnalytics[]; nextSyncAt: string };
};
