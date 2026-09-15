import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/admin/admin-auth-controls";
import { BrandMark } from "@/components/brand-mark";
import { getAdminIdentity } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminBlogLayout({ children }: { children: React.ReactNode }) {
  const identity = await getAdminIdentity();
  if (!identity) redirect("/admin/sign-in?error=forbidden");

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/90 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-4">
          <Link href="/admin/blog" className="flex min-h-11 items-center gap-3" aria-label="Blog administration home"><BrandMark className="size-7 text-accent" /><span className="border-l border-border pl-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Blog studio</span></Link>
          <div className="flex items-center gap-2"><span className="hidden text-xs text-faint sm:inline">{identity.email}</span><SignOutButton /></div>
        </div>
      </header>
      {children}
    </main>
  );
}
