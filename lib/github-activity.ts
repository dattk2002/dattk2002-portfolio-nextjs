import { z } from "zod";

export const GITHUB_USERNAME = "dattk2002";
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=all`;

type Contribution = {
  date: string;
  count: number;
};

const contributionsSchema = z.object({
  total: z.record(z.string(), z.number().int().nonnegative()),
  contributions: z.array(z.object({
    date: z.iso.date(),
    count: z.number().int().nonnegative(),
  })).min(1),
});

function getBangkokDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function previousDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function calculateStreaks(contributions: Contribution[]) {
  const today = getBangkokDateKey();
  const countsByDate = new Map(
    contributions
      .filter((item) => item.date <= today)
      .map((item) => [item.date, item.count]),
  );

  let currentStreak = 0;
  let cursor = today;

  // The current day is still in progress, so a zero today does not end a streak
  // that was active yesterday.
  if ((countsByDate.get(cursor) ?? 0) === 0) cursor = previousDateKey(cursor);

  while ((countsByDate.get(cursor) ?? 0) > 0) {
    currentStreak += 1;
    cursor = previousDateKey(cursor);
  }

  let longestStreak = 0;
  let runningStreak = 0;

  for (const contribution of [...contributions]
    .filter((item) => item.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date))) {
    runningStreak = contribution.count > 0 ? runningStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, runningStreak);
  }

  return { currentStreak, longestStreak };
}

export type GithubActivitySnapshot = {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  syncedAt: string;
  nextSyncAt: string;
};

export async function fetchGithubActivity(): Promise<GithubActivitySnapshot> {
  const response = await fetch(CONTRIBUTIONS_API, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error("GitHub contributions request failed");

  const data = contributionsSchema.parse(await response.json());
  const syncedAt = new Date();
  // Vercel cron runs at 00:00 UTC (07:00 Vietnam); Hobby may run within that hour.
  const nextSyncAt = new Date(Date.UTC(
    syncedAt.getUTCFullYear(), syncedAt.getUTCMonth(), syncedAt.getUTCDate() + 1,
  ));
  return {
    totalContributions: Object.values(data.total).reduce((sum, count) => sum + count, 0),
    ...calculateStreaks(data.contributions),
    syncedAt: syncedAt.toISOString(),
    nextSyncAt: nextSyncAt.toISOString(),
  };
}
