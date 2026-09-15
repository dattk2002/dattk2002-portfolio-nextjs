import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import { BlogContent } from "@/components/blog-content";
import { BrandMark } from "@/components/brand-mark";
import { MotionReveal } from "@/components/motion-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { Button } from "@/components/ui/button";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/blog/data";
import {
  blogLocales,
  type BlogDocument,
  type BlogEditorNode,
  type BlogLocale,
} from "@/lib/blog/types";
import { siteConfig } from "@/lib/site";

type ArticlePageProps = { params: Promise<{ locale: string; slug: string }> };

function isBlogLocale(value: string): value is BlogLocale {
  return blogLocales.includes(value as BlogLocale);
}

function wordCount(document: BlogDocument) {
  let text = "";
  const visit = (node: BlogEditorNode) => {
    if (node.text) text += ` ${node.text}`;
    node.content?.forEach(visit);
  };
  document.content?.forEach(visit);
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isBlogLocale(locale)) return {};
  const post = await getPublishedBlogPost(locale, slug);
  if (!post) return {};

  const canonical = `/blog/${post.locale}/${post.slug}`;
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        post.alternates.map((item) => [
          item.locale,
          `/blog/${item.locale}/${item.slug}`,
        ]),
      ),
    },
    openGraph: {
      type: "article",
      locale: post.locale === "vi" ? "vi_VN" : "en_US",
      url: canonical,
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, alt: post.coverImageAlt }]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  if (!isBlogLocale(locale)) notFound();
  const [post, localePosts] = await Promise.all([
    getPublishedBlogPost(locale, slug),
    getPublishedBlogPosts(locale),
  ]);
  if (!post) notFound();

  const relatedPosts = localePosts
    .filter((candidate) => candidate.id !== post.id)
    .slice(0, 3);

  const date = post.publishedAt
    ? new Intl.DateTimeFormat(post.locale === "vi" ? "vi-VN" : "en-US", {
        dateStyle: "long",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(post.publishedAt)
    : "";
  const readingMinutes = Math.max(
    1,
    Math.ceil(wordCount(post.content) / (post.locale === "vi" ? 260 : 220)),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: post.locale,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: new URL(
      `/blog/${post.locale}/${post.slug}`,
      siteConfig.url,
    ).toString(),
  };

  return (
    <main id="top" className="w-full max-w-full overflow-x-hidden">
      <SiteNavigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <article>
        <header className="relative px-5 pt-32 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pt-40 lg:pb-16">
          <div className="ambient-grid absolute inset-0 -z-10 opacity-45" />
          <div className="mx-auto max-w-[90rem]">
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> All articles
            </Link>
            <MotionReveal className="mt-8 grid overflow-hidden border border-border bg-surface lg:grid-cols-12">
              <div className="flex min-w-0 flex-col justify-between p-6 sm:p-10 lg:col-span-5 lg:min-h-[38rem] lg:p-12 xl:p-16">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                    {post.locale === "vi" ? "Tiếng Việt" : "English"}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {readingMinutes} min read
                    </span>
                  </div>
                  <h1 className="mt-8 max-w-[15ch] text-balance font-display text-[clamp(2.85rem,5vw,5.8rem)] leading-[0.9] font-medium tracking-[-0.065em]">
                    {post.title}
                  </h1>
                  <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-4 border-t border-border pt-6">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border bg-surface-raised">
                    <Image
                      src={siteConfig.portraitPath}
                      alt={`Portrait of ${siteConfig.name}`}
                      fill
                      sizes="48px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {siteConfig.name}
                    </p>
                    <p className="mt-1 text-sm text-faint">{siteConfig.role}</p>
                  </div>
                </div>
              </div>
              <div className="group relative min-h-72 overflow-hidden border-t border-border bg-surface-raised sm:min-h-[30rem] lg:col-span-7 lg:min-h-[38rem] lg:border-t-0 lg:border-l">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.coverImageAlt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <div
                    className="absolute inset-0 grid place-items-center"
                    aria-hidden="true"
                  >
                    <span className="ambient-grid absolute inset-0 opacity-70" />
                    <span className="absolute inset-10 border border-border sm:inset-16" />
                    <BrandMark className="relative size-32 text-accent sm:size-48 xl:size-56" />
                    <p className="absolute right-6 bottom-6 left-6 border-t border-border pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-steel sm:right-10 sm:bottom-10 sm:left-10">
                      Interface to infrastructure
                    </p>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </MotionReveal>
          </div>
        </header>

        <section className="border-t border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-12 lg:gap-8">
            <aside className="lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
              <div className="border-y border-border py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  Article details
                </p>
                <dl className="mt-5 grid gap-4 text-sm">
                  <div>
                    <dt className="text-faint">Published</dt>
                    <dd className="mt-1 text-muted">{date}</dd>
                  </div>
                  <div>
                    <dt className="text-faint">Reading time</dt>
                    <dd className="mt-1 text-muted">
                      {readingMinutes} min read
                    </dd>
                  </div>
                </dl>
                {post.tags.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-steel"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {post.alternates.length > 1 ? (
                <nav className="mt-8 grid" aria-label="Article languages">
                  {post.alternates.map((alternate) => (
                    <Link
                      key={alternate.locale}
                      href={`/blog/${alternate.locale}/${alternate.slug}`}
                      aria-current={
                        alternate.locale === post.locale ? "page" : undefined
                      }
                      className="inline-flex min-h-12 items-center justify-between border-b border-border text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span>
                        {alternate.locale === "vi"
                          ? "Đọc bằng Tiếng Việt"
                          : "Read in English"}
                      </span>
                      <span className="font-mono text-[9px] uppercase text-steel">
                        {alternate.locale}
                      </span>
                    </Link>
                  ))}
                </nav>
              ) : null}
            </aside>
            <MotionReveal className="min-w-0 lg:col-span-7 lg:col-start-5">
              <BlogContent document={post.content} />
            </MotionReveal>
          </div>
        </section>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-border bg-surface px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[90rem]">
            <MotionReveal className="flex flex-col gap-5 border-b border-border pb-9 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
                  Continue reading
                </p>
                <h2 className="mt-4 font-display text-4xl tracking-[-0.05em] sm:text-6xl">
                  More field notes.
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium transition-colors hover:text-accent sm:self-auto"
              >
                View all articles{" "}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </MotionReveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <MotionReveal
                  key={`${relatedPost.locale}-${relatedPost.slug}`}
                  delay={index * 0.05}
                >
                  <BlogCard post={relatedPost} compact />
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-accent px-5 py-20 text-accent-foreground sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-5xl font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.88] tracking-[-0.065em]">
            Have a product worth building carefully?
          </h2>
          <Button
            size="lg"
            variant="outline"
            className="border-black/35 text-black hover:bg-black hover:text-white"
            asChild
          >
            <a href={`mailto:${siteConfig.email}`}>
              Start a conversation <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
