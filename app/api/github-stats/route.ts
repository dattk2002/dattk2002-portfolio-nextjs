const GITHUB_USERNAME = "dattk2002";
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=all`;

type Contribution = {
  date: string;
  count: number;
};

type ContributionsResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
};

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

export async function GET() {
  try {
    const response = await fetch(CONTRIBUTIONS_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) throw new Error(`GitHub contributions request failed: ${response.status}`);

    const data = (await response.json()) as ContributionsResponse;
    const totalContributions = Object.values(data.total).reduce((sum, count) => sum + count, 0);
    const streaks = calculateStreaks(data.contributions);

    return Response.json(
      { totalContributions, ...streaks },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return Response.json(
      { error: "GitHub activity is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "public, max-age=60" } },
    );
  }
}
