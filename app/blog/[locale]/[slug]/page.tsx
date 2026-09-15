import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { BlogContent } from "@/components/blog-content";
import { MotionReveal } from "@/components/motion-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { Button } from "@/components/ui/button";
import { getPublishedBlogPost } from "@/lib/blog/data";
import { blogLocales, type BlogDocument, type BlogEditorNode, type BlogLocale } from "@/lib/blog/types";
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

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
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
      languages: Object.fromEntries(post.alternates.map((item) => [item.locale, `/blog/${item.locale}/${item.slug}`])),
    },
    openGraph: {
      type: "article",
      locale: post.locale === "vi" ? "vi_VN" : "en_US",
      url: canonical,
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.coverImageAlt }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  if (!isBlogLocale(locale)) notFound();
  const post = await getPublishedBlogPost(locale, slug);
  if (!post) notFound();

  const date = post.publishedAt
    ? new Intl.DateTimeFormat(post.locale === "vi" ? "vi-VN" : "en-US", { dateStyle: "long", timeZone: "Asia/Ho_Chi_Minh" }).format(post.publishedAt)
    : "";
  const readingMinutes = Math.max(1, Math.ceil(wordCount(post.content) / (post.locale === "vi" ? 260 : 220)));
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
    mainEntityOfPage: new URL(`/blog/${post.locale}/${post.slug}`, siteConfig.url).toString(),
  };

  return (
    <main id="top" className="w-full max-w-full overflow-x-hidden">
      <SiteNavigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <article>
        <header className="relative px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-48 lg:pb-24">
          <div className="ambient-grid absolute inset-0 -z-10 opacity-45" />
          <div className="mx-auto max-w-[90rem]">
            <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> All articles</Link>
            <MotionReveal className="mt-12 grid items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">{post.locale === "vi" ? "Tiếng Việt" : "English"} · {date} · {readingMinutes} min read</p>
                <h1 className="mt-7 max-w-6xl font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.86] font-medium tracking-[-0.07em] text-balance">{post.title}</h1>
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted lg:col-span-4 lg:pb-2">{post.excerpt}</p>
            </MotionReveal>
            {post.coverImageUrl ? <MotionReveal delay={0.08} className="relative mt-14 aspect-[16/9] overflow-hidden border border-border bg-surface"><Image src={post.coverImageUrl} alt={post.coverImageAlt} fill priority sizes="(max-width: 1440px) 100vw, 1440px" className="object-cover" /></MotionReveal> : null}
          </div>
        </header>

        <section className="border-t border-border px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12">
            <aside className="lg:sticky lg:top-32 lg:col-span-3 lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Written by</p>
              <p className="mt-3 font-display text-2xl tracking-[-0.04em]">{siteConfig.name}</p>
              {post.tags.length > 0 ? <p className="mt-7 font-mono text-[10px] uppercase leading-5 tracking-[0.13em] text-steel">{post.tags.join(" · ")}</p> : null}
              {post.alternates.length > 1 ? <nav className="mt-8 grid gap-2" aria-label="Article languages">{post.alternates.map((alternate) => <Link key={alternate.locale} href={`/blog/${alternate.locale}/${alternate.slug}`} aria-current={alternate.locale === post.locale ? "page" : undefined} className="inline-flex min-h-11 items-center border-b border-border text-sm text-muted transition-colors hover:text-foreground">{alternate.locale === "vi" ? "Đọc bằng Tiếng Việt" : "Read in English"}</Link>)}</nav> : null}
            </aside>
            <MotionReveal className="min-w-0 lg:col-span-8 lg:col-start-5"><BlogContent document={post.content} /></MotionReveal>
          </div>
        </section>
      </article>

      <section className="bg-accent px-5 py-20 text-accent-foreground sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-5xl font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.88] tracking-[-0.065em]">Have a product worth building carefully?</h2>
          <Button size="lg" variant="outline" className="border-black/35 text-black hover:bg-black hover:text-white" asChild><a href={`mailto:${siteConfig.email}`}>Start a conversation <ArrowUpRight aria-hidden="true" /></a></Button>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
