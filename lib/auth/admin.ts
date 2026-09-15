import "server-only";

import { cache } from "react";

import { auth } from "@/lib/auth/server";
import { databasePool } from "@/lib/db";

export type AdminIdentity = {
  id: string;
  email: string;
  name: string;
};

export const getAdminIdentity = cache(async (): Promise<AdminIdentity | null> => {
  const { data } = await auth.getSession();
  const user = data?.user;

  if (!user?.id || !user.email) return null;

  const allowedGithubAccountId = process.env.ADMIN_GITHUB_ACCOUNT_ID?.trim();
  if (!allowedGithubAccountId) return null;

  const result = await databasePool.query<{ exists: boolean }>(
    `select exists(
      select 1
      from neon_auth.account
      where "userId" = $1::uuid
        and "providerId" = 'github'
        and "accountId" = $2
    )`,
    [user.id, allowedGithubAccountId],
  );

  if (!result.rows[0]?.exists) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name || "Tran Kim Dat",
  };
});

export async function requireAdmin() {
  const identity = await getAdminIdentity();

  if (!identity) {
    throw new Error("Unauthorized");
  }

  return identity;
}
