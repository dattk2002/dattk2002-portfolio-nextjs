import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/admin/admin-auth-controls";
import { BrandMark } from "@/components/brand-mark";
import { getAdminIdentity } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics", robots: { index: false, follow: false } };

export default async function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const identity = await getAdminIdentity();
  if (!identity) redirect("/admin/sign-in?error=forbidden");
  return <main className="min-h-screen bg-background">
    <header className="border-b border-border bg-surface px-5 py-3 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[100rem] flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link href="/admin/analytics" className="flex min-h-11 items-center gap-3" aria-label="Portfolio analytics"><BrandMark className="size-7 text-accent" /><span className="font-mono text-xs text-muted">Portfolio admin</span></Link>
        <nav className="flex items-center gap-2" aria-label="Admin navigation">
          <Link href="/admin/blog" className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-muted hover:text-foreground">Articles</Link>
          <Link href="/admin/analytics" aria-current="page" className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-accent">Analytics</Link>
          <SignOutButton />
        </nav>
      </div>
    </header>
    {children}
  </main>;
}
