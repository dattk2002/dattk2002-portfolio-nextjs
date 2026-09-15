import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { BlogCard } from "@/components/blog-card";
import { MotionReveal } from "@/components/motion-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { Button } from "@/components/ui/button";
import { getPublishedBlogPosts } from "@/lib/blog/data";
import type { BlogLocale } from "@/lib/blog/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical notes on building, testing, and shipping full-stack products.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
  openGraph: {
    title: "Blog — Tran Kim Dat",
    description: "Practical notes on building, testing, and shipping full-stack products.",
    url: "/blog",
  },
};

type BlogPageProps = {
  searchParams: Promise<{ locale?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { locale: localeParam } = await searchParams;
  const locale: BlogLocale | undefined = localeParam === "en" || localeParam === "vi" ? localeParam : undefined;
  const loadedPosts = await getPublishedBlogPosts(locale);
  const posts = locale
    ? loadedPosts
    : [...loadedPosts.reduce((grouped, post) => {
        const current = grouped.get(post.id);
        if (!current || (post.locale === "en" && current.locale !== "en")) grouped.set(post.id, post);
        return grouped;
      }, new Map<string, (typeof loadedPosts)[number]>()).values()];
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const remainingPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id || post.locale !== featuredPost.locale) : [];

  return (
    <main id="top" className="w-full max-w-full overflow-x-hidden">
      <SiteNavigation />
      <header className="relative px-5 pt-36 pb-20 sm:px-8 lg:px-12 lg:pt-48 lg:pb-28">
        <div className="ambient-grid absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto grid max-w-[90rem] items-end gap-10 lg:grid-cols-12">
          <MotionReveal className="lg:col-span-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Field notes</p>
            <h1 className="mt-7 max-w-6xl font-display text-[clamp(3.25rem,10vw,9rem)] leading-[0.84] font-medium tracking-[-0.075em] text-balance">Notes from interface to infrastructure.</h1>
          </MotionReveal>
          <MotionReveal delay={0.08} className="lg:col-span-4 lg:pb-2">
            <p className="max-w-xl text-lg leading-8 text-muted">Practical writing about product engineering, architecture, and the decisions behind reliable releases.</p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <nav className="flex flex-wrap gap-2" aria-label="Filter articles by language">
                {[
                  ["All", "/blog", !locale],
                  ["English", "/blog?locale=en", locale === "en"],
                  ["Tiếng Việt", "/blog?locale=vi", locale === "vi"],
                ].map(([label, href, active]) => (
                  <Link key={String(label)} href={String(href)} aria-current={active ? "page" : undefined} className={active ? "inline-flex min-h-11 items-center border border-accent bg-accent px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-foreground" : "inline-flex min-h-11 items-center border border-border px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-foreground hover:text-foreground"}>{label}</Link>
                ))}
              </nav>
              <Button variant="outline" asChild>
                <Link href="/admin/blog" prefetch={false}>
                  Open admin <LockKeyhole className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </MotionReveal>
        </div>
      </header>

      <section className="border-y border-border bg-background px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[90rem]">
          {featuredPost ? (
            <>
              <MotionReveal><BlogCard post={featuredPost} featured priority /></MotionReveal>
              {remainingPosts.length > 0 ? (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {remainingPosts.map((post, index) => <MotionReveal key={`${post.locale}-${post.slug}`} delay={(index % 2) * 0.05}><BlogCard post={post} /></MotionReveal>)}
                </div>
              ) : null}
            </>
          ) : (
            <MotionReveal className="border border-border bg-surface px-6 py-20 text-center sm:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">The first article is in progress</p>
              <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl tracking-[-0.05em] sm:text-6xl">Writing grounded in shipped work.</h2>
              <p className="mx-auto mt-6 max-w-xl leading-7 text-muted">New notes will appear here after they are published.</p>
            </MotionReveal>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
