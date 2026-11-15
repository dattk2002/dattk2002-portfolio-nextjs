CREATE TABLE IF NOT EXISTS "github_activity_snapshots" (
	"username" text PRIMARY KEY NOT NULL,
	"total_contributions" integer NOT NULL,
	"current_streak" integer NOT NULL,
	"longest_streak" integer NOT NULL,
	"synced_at" timestamp with time zone NOT NULL,
	"next_sync_at" timestamp with time zone NOT NULL
);
