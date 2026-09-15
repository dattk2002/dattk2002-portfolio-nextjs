import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/lib/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to access the blog database.");
}

const globalForDatabase = globalThis as typeof globalThis & {
  blogDatabasePool?: Pool;
};

export const databasePool =
  globalForDatabase.blogDatabasePool ??
  new Pool({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.blogDatabasePool = databasePool;
}

attachDatabasePool(databasePool);

export const db = drizzle({ client: databasePool, schema });
