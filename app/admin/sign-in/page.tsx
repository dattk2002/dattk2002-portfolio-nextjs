import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Languages, LockKeyhole, PenLine, Send } from "lucide-react";
import { redirect } from "next/navigation";

import { GithubSignInButton } from "@/components/admin/admin-auth-controls";
import { BrandMark } from "@/components/brand-mark";
import { getAdminIdentity } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog administration",
  robots: { index: false, follow: false },
};

export default async function AdminSignInPage() {
  const identity = await getAdminIdentity();
  if (identity) redirect("/admin/blog");

  return (
    <main className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-36 top-[-12rem] size-[34rem] rounded-full bg-steel/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen max-w-[100rem] flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3" aria-label="Return to portfolio home">
            <BrandMark className="size-8 text-accent" />
            <span className="border-l border-border pl-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Blog studio
            </span>
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Return to the blog</span>
            <span className="sm:hidden">Blog</span>
          </Link>
        </header>

        <section className="grid flex-1 items-stretch lg:grid-cols-12 lg:grid-rows-[1fr_auto]">
          <div className="border-b border-border py-10 sm:py-16 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:border-r lg:border-b-0 lg:pt-24 lg:pr-12 lg:pb-10 xl:pr-20">
            <div className="flex items-center gap-3 text-steel">
              <LockKeyhole className="size-4" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]">Owner access only</p>
            </div>
            <h1 className="mt-7 max-w-3xl text-balance font-display text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.86] tracking-[-0.07em]">
              Your private publishing desk.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:mt-8 sm:text-lg">
              Draft, localize, and publish portfolio articles from one focused workspace.
            </p>
          </div>

          <div className="border-b border-border py-10 sm:py-16 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:flex lg:items-center lg:border-b-0 lg:py-24 lg:pl-12 xl:pl-20">
            <div className="w-full">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Secure sign-in</p>
              <h2 className="mt-5 max-w-md font-display text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                Continue with your authorized GitHub account.
              </h2>
              <p className="mt-6 max-w-md leading-7 text-muted">
                Access is limited to the configured portfolio owner. Other GitHub accounts cannot enter the editor.
              </p>
              <div className="mt-8 border-t border-border pt-8 sm:mt-10">
                <GithubSignInButton />
              </div>
            </div>
          </div>

          <div className="py-10 sm:py-16 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:border-r lg:pt-10 lg:pr-12 lg:pb-24 xl:pr-20">
            <div className="grid max-w-2xl gap-px border border-border bg-border sm:grid-cols-3">
              {[
                { label: "Write", icon: PenLine },
                { label: "Localize", icon: Languages },
                { label: "Publish", icon: Send },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex min-h-24 items-end justify-between bg-background p-5 text-muted">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{label}</span>
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-border py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>Tran Kim Dat / Portfolio</span>
          <span>Private editorial workspace</span>
        </footer>
      </div>
    </main>
  );
}
