import "server-only";

import { cache } from "react";
import { and, asc, desc, eq, inArray, lte } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import type { BlogLocale } from "@/lib/blog/types";
import { db } from "@/lib/db";
import {
  blogPosts,
  blogPostTags,
  blogPostTranslations,
  blogTags,
} from "@/lib/db/schema";

const publicTranslationCondition = () =>
  and(
    eq(blogPostTranslations.status, "published"),
    lte(blogPostTranslations.publishedAt, new Date()),
  );

async function loadTags(postIds: string[]) {
  if (postIds.length === 0) return new Map<string, string[]>();

  const rows = await db
    .select({ postId: blogPostTags.postId, label: blogTags.label })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(inArray(blogPostTags.postId, postIds))
    .orderBy(asc(blogTags.label));

  return rows.reduce((map, row) => {
    const labels = map.get(row.postId) ?? [];
    labels.push(row.label);
    map.set(row.postId, labels);
    return map;
  }, new Map<string, string[]>());
}

async function loadPublishedPosts(locale?: BlogLocale) {
  const rows = await db
    .select({ post: blogPosts, translation: blogPostTranslations })
    .from(blogPostTranslations)
    .innerJoin(blogPosts, eq(blogPostTranslations.postId, blogPosts.id))
    .where(
      locale
        ? and(publicTranslationCondition(), eq(blogPostTranslations.locale, locale))
        : publicTranslationCondition(),
    )
    .orderBy(desc(blogPosts.featured), desc(blogPostTranslations.publishedAt));

  const tags = await loadTags([...new Set(rows.map((row) => row.post.id))]);
  return rows.map((row) => ({ ...row.post, ...row.translation, tags: tags.get(row.post.id) ?? [] }));
}

const getAllPublishedPostsCached = unstable_cache(
  () => loadPublishedPosts(),
  ["blog-published-posts"],
  { tags: ["blog-posts"], revalidate: 60 },
);

const getPublishedPostsByLocaleCached = {
  en: unstable_cache(() => loadPublishedPosts("en"), ["blog-published-posts-en"], {
    tags: ["blog-posts"],
    revalidate: 60,
  }),
  vi: unstable_cache(() => loadPublishedPosts("vi"), ["blog-published-posts-vi"], {
    tags: ["blog-posts"],
    revalidate: 60,
  }),
};

type PublishedBlogPost = Awaited<ReturnType<typeof loadPublishedPosts>>[number];

function restorePublishedAt(post: PublishedBlogPost): PublishedBlogPost {
  const cachedValue = post.publishedAt as Date | string | null;
  if (!cachedValue) return post;

  const publishedAt = cachedValue instanceof Date ? cachedValue : new Date(cachedValue);
  return {
    ...post,
    publishedAt: Number.isNaN(publishedAt.getTime()) ? null : publishedAt,
  };
}

export async function getPublishedBlogPosts(locale?: BlogLocale) {
  const posts = await (locale ? getPublishedPostsByLocaleCached[locale]() : getAllPublishedPostsCached());
  return posts.map(restorePublishedAt);
}

export const getPublishedBlogPost = cache(async (locale: BlogLocale, slug: string) => {
  const [row] = await db
    .select({ post: blogPosts, translation: blogPostTranslations })
    .from(blogPostTranslations)
    .innerJoin(blogPosts, eq(blogPostTranslations.postId, blogPosts.id))
    .where(
      and(
        publicTranslationCondition(),
        eq(blogPostTranslations.locale, locale),
        eq(blogPostTranslations.slug, slug),
      ),
    )
    .limit(1);

  if (!row) return null;

  const [tags, alternateRows] = await Promise.all([
    loadTags([row.post.id]),
    db
      .select({
        locale: blogPostTranslations.locale,
        slug: blogPostTranslations.slug,
        title: blogPostTranslations.title,
      })
      .from(blogPostTranslations)
      .where(and(publicTranslationCondition(), eq(blogPostTranslations.postId, row.post.id))),
  ]);

  return {
    ...row.post,
    ...row.translation,
    tags: tags.get(row.post.id) ?? [],
    alternates: alternateRows,
  };
});

export async function getAdminBlogPosts() {
  const rows = await db
    .select({ post: blogPosts, translation: blogPostTranslations })
    .from(blogPosts)
    .leftJoin(blogPostTranslations, eq(blogPostTranslations.postId, blogPosts.id))
    .orderBy(desc(blogPosts.updatedAt), asc(blogPostTranslations.locale));

  const grouped = new Map<string, { post: typeof blogPosts.$inferSelect; translations: Array<typeof blogPostTranslations.$inferSelect> }>();
  rows.forEach(({ post, translation }) => {
    const entry = grouped.get(post.id) ?? { post, translations: [] };
    if (translation) entry.translations.push(translation);
    grouped.set(post.id, entry);
  });
  return [...grouped.values()];
}

export async function getAdminBlogPost(id: string) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) return null;

  const [translations, tagRows] = await Promise.all([
    db
      .select()
      .from(blogPostTranslations)
      .where(eq(blogPostTranslations.postId, id))
      .orderBy(asc(blogPostTranslations.locale)),
    db
      .select({ label: blogTags.label })
      .from(blogPostTags)
      .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
      .where(eq(blogPostTags.postId, id))
      .orderBy(asc(blogTags.label)),
  ]);

  return { ...post, translations, tags: tagRows.map((row) => row.label) };
}
