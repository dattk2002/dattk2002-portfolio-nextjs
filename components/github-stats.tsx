"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";

type GithubActivity = {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
};

const numberFormatter = new Intl.NumberFormat("en-US");

export function GithubStats({ profileUrl }: { profileUrl: string }) {
  const [activity, setActivity] = useState<GithubActivity | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivity() {
      try {
        const response = await fetch("/api/github-stats", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load GitHub activity");
        setActivity((await response.json()) as GithubActivity);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      }
    }

    void loadActivity();
    return () => controller.abort();
  }, []);

  const stats = [
    { label: "Contributions", value: activity?.totalContributions, className: "" },
    { label: "Current streak", value: activity?.currentStreak, className: "hidden sm:block" },
    { label: "Longest streak", value: activity?.longestStreak, className: "" },
  ];

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      className="group block min-h-11 border border-white/15 bg-black/55 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={activity
        ? `GitHub activity: ${activity.totalContributions} total contributions, ${activity.currentStreak} day current streak, ${activity.longestStreak} day longest streak. Open GitHub profile.`
        : "Open GitHub profile"}
      aria-busy={!activity && !failed}
      data-github-stats
    >
      <div className="flex items-center justify-between border-b border-white/15 pb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/60">
        <span className="flex items-center gap-2">
          <GitCommitHorizontal className="size-3.5" aria-hidden="true" />
          GitHub activity
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full ${failed ? "bg-white/35" : "bg-accent"}`} aria-hidden="true" />
          {failed ? "Unavailable" : activity ? "Synced" : "Syncing"}
          <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-white/15 pt-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`min-w-0 px-3 first:pl-0 last:pr-0 ${stat.className}`}>
            <p className="font-display text-xl leading-none tracking-[-0.04em] tabular-nums text-white">
              {stat.value === undefined ? "—" : numberFormatter.format(stat.value)}
            </p>
            <p className="mt-1.5 truncate font-mono text-[7px] uppercase tracking-[0.12em] text-white/55">{stat.label}</p>
          </div>
        ))}
      </div>
    </a>
  );
}
