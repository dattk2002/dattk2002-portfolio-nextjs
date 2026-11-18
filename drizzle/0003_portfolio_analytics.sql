CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY,
  day date NOT NULL,
  visitor text,
  kind text NOT NULL CHECK (kind IN ('pageview', 'cv_click', 'github_click', 'contact_click')),
  path text NOT NULL,
  referrer text NOT NULL,
  device text NOT NULL,
  browser text NOT NULL,
  country text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS analytics_events_day_idx ON analytics_events (day);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS analytics_events_visitor_time_idx ON analytics_events (visitor, created_at);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS analytics_budgets (day date PRIMARY KEY, events integer NOT NULL);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS analytics_jobs (name text PRIMARY KEY, started_at timestamptz NOT NULL);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS github_traffic_daily (
  repo text NOT NULL, day date NOT NULL,
  views integer NOT NULL, visitors integer NOT NULL,
  clones integer NOT NULL, cloners integer NOT NULL,
  CONSTRAINT github_traffic_daily_repo_day_pk PRIMARY KEY (repo, day)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS github_traffic_syncs (
  repo text PRIMARY KEY, synced_at timestamptz,
  attempted_at timestamptz NOT NULL, failed boolean NOT NULL
);
