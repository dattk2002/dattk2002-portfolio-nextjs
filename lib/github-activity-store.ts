import { eq, lt } from "drizzle-orm";

import { githubActivitySnapshots } from "@/lib/db/schema";
import { GITHUB_USERNAME, type GithubActivitySnapshot } from "@/lib/github-activity";

export async function readGithubActivity(): Promise<GithubActivitySnapshot | null> {
  const { db } = await import("@/lib/db/index");
  const [row] = await db.select().from(githubActivitySnapshots)
    .where(eq(githubActivitySnapshots.username, GITHUB_USERNAME)).limit(1);
  if (!row) return null;
  return {
    totalContributions: row.totalContributions,
    currentStreak: row.currentStreak,
    longestStreak: row.longestStreak,
    syncedAt: row.syncedAt.toISOString(),
    nextSyncAt: row.nextSyncAt.toISOString(),
  };
}

export async function saveGithubActivity(snapshot: GithubActivitySnapshot) {
  const { db } = await import("@/lib/db/index");
  const values = {
    totalContributions: snapshot.totalContributions,
    currentStreak: snapshot.currentStreak,
    longestStreak: snapshot.longestStreak,
    syncedAt: new Date(snapshot.syncedAt),
    nextSyncAt: new Date(snapshot.nextSyncAt),
  };
  // Duplicate runs replace one row; an older run cannot overwrite a newer one.
  await db.insert(githubActivitySnapshots).values({ username: GITHUB_USERNAME, ...values })
    .onConflictDoUpdate({
      target: githubActivitySnapshots.username,
      set: values,
      setWhere: lt(githubActivitySnapshots.syncedAt, values.syncedAt),
    });
}
