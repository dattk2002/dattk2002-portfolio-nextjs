import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: {
    locale: "en" | "vi";
    slug: string;
    title: string;
    excerpt: string;
    coverImageUrl: string | null;
    coverImageAlt: string;
    publishedAt: Date | null;
    tags: string[];
    featured: boolean;
  };
  priority?: boolean;
  featured?: boolean;
  compact?: boolean;
};

const localeNames = { en: "English", vi: "Tiếng Việt" } as const;

export function BlogCard({
  post,
  priority = false,
  featured = false,
  compact = false,
}: BlogCardProps) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(post.locale === "vi" ? "vi-VN" : "en-US", {
        dateStyle: "medium",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(post.publishedAt)
    : null;

  return (
    <article
      className={cn(
        "group grid overflow-hidden border border-border bg-surface",
        featured && "lg:grid-cols-12",
        compact && "h-full",
      )}
    >
      <Link
        href={`/blog/${post.locale}/${post.slug}`}
        className={cn(
          "relative block min-h-64 overflow-hidden bg-surface-raised",
          featured && "lg:col-span-7 lg:min-h-[32rem]",
          compact && "min-h-52",
        )}
        aria-label={`Read ${post.title}`}
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt}
            fill
            priority={priority}
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 58vw"
                : compact
                  ? "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  : "(max-width: 768px) 100vw, 50vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <span
            className="ambient-grid absolute inset-0 opacity-60"
            aria-hidden="true"
          />
        )}
      </Link>
      <div
        className={cn(
          "flex min-w-0 flex-col p-6 sm:p-8",
          featured && "lg:col-span-5 lg:p-12",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-steel">
          <span>{localeNames[post.locale]}</span>
          {date ? <span>{date}</span> : null}
        </div>
        <h2
          className={cn(
            "mt-6 font-display text-3xl leading-[1.02] tracking-[-0.045em] text-balance",
            featured && "sm:text-5xl",
            compact && "text-2xl",
          )}
        >
          {post.title}
        </h2>
        <p
          className={cn(
            "mt-5 text-sm leading-7 text-muted sm:text-base",
            compact && "line-clamp-3",
          )}
        >
          {post.excerpt}
        </p>
        {post.tags.length > 0 ? (
          <p className="mt-6 font-mono text-[10px] uppercase leading-5 tracking-[0.13em] text-faint">
            {post.tags.join(" · ")}
          </p>
        ) : null}
        <Link
          href={`/blog/${post.locale}/${post.slug}`}
          className="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-foreground transition-colors hover:text-accent"
        >
          Read article{" "}
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
