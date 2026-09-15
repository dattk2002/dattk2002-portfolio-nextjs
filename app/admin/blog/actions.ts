"use server";

import { and, eq, inArray, notInArray } from "drizzle-orm";
import { updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import {
  blogPostIdSchema,
  blogPostInputSchema,
  formatBlogFieldErrors,
  normalizeTag,
  type BlogFieldErrors,
  type BlogPostInput,
} from "@/lib/blog/validation";
import { db } from "@/lib/db";
import { blogPosts, blogPostTags, blogPostTranslations, blogTags } from "@/lib/db/schema";

export type BlogActionResult =
  | { ok: true; postId: string }
  | { ok: false; message: string; fieldErrors?: BlogFieldErrors };

export async function saveBlogPost(input: BlogPostInput): Promise<BlogActionResult> {
  await requireAdmin();

  const parsed = blogPostInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Review the highlighted article fields.",
      fieldErrors: formatBlogFieldErrors(parsed.error),
    };
  }

  try {
    const postId = await db.transaction(async (transaction) => {
      let id = parsed.data.id;

      if (id) {
        const [existing] = await transaction
          .update(blogPosts)
          .set({
            coverImageUrl: parsed.data.coverImageUrl,
            featured: parsed.data.featured,
            updatedAt: new Date(),
          })
          .where(eq(blogPosts.id, id))
          .returning({ id: blogPosts.id });
        if (!existing) throw new Error("Post not found");
      } else {
        const [created] = await transaction
          .insert(blogPosts)
          .values({
            coverImageUrl: parsed.data.coverImageUrl,
            featured: parsed.data.featured,
          })
          .returning({ id: blogPosts.id });
        id = created.id;
      }

      for (const translation of parsed.data.translations) {
        const publishedAt = translation.publishedAt ? new Date(translation.publishedAt) : null;
        await transaction
          .insert(blogPostTranslations)
          .values({ ...translation, postId: id, publishedAt })
          .onConflictDoUpdate({
            target: [blogPostTranslations.postId, blogPostTranslations.locale],
            set: {
              slug: translation.slug,
              title: translation.title,
              excerpt: translation.excerpt,
              content: translation.content,
              coverImageAlt: translation.coverImageAlt,
              seoTitle: translation.seoTitle,
              seoDescription: translation.seoDescription,
              status: translation.status,
              publishedAt,
              updatedAt: new Date(),
            },
          });
      }

      await transaction
        .delete(blogPostTranslations)
        .where(
          and(
            eq(blogPostTranslations.postId, id),
            notInArray(
              blogPostTranslations.locale,
              parsed.data.translations.map((translation) => translation.locale),
            ),
          ),
        );

      await transaction.delete(blogPostTags).where(eq(blogPostTags.postId, id));
      const tags = [...new Map(parsed.data.tags.map((label) => [normalizeTag(label), label.trim()])).entries()]
        .filter(([slug]) => slug)
        .map(([slug, label]) => ({ slug, label }));

      if (tags.length > 0) {
        await transaction
          .insert(blogTags)
          .values(tags)
          .onConflictDoNothing({ target: blogTags.slug });

        const tagIds = await transaction
          .select({ id: blogTags.id })
          .from(blogTags)
          .where(inArray(blogTags.slug, tags.map((tag) => tag.slug)));
        await transaction
          .insert(blogPostTags)
          .values(tagIds.map((tag) => ({ postId: id, tagId: tag.id })))
          .onConflictDoNothing();
      }

      return id;
    });

    updateTag("blog-posts");
    return { ok: true, postId };
  } catch (error) {
    const duplicateSlug =
      error instanceof Error &&
      (error.message.includes("blog_post_translations_locale_slug_uidx") ||
        error.message.includes("duplicate key"));
    return {
      ok: false,
      message: duplicateSlug
        ? "That URL slug is already used for this language."
        : "The article could not be saved. Please try again.",
    };
  }
}

export async function deleteBlogPost(postId: string): Promise<BlogActionResult> {
  await requireAdmin();

  const parsedId = blogPostIdSchema.safeParse(postId);
  if (!parsedId.success) return { ok: false, message: "Invalid article identifier." };

  const [deleted] = await db
    .delete(blogPosts)
    .where(eq(blogPosts.id, parsedId.data))
    .returning({ id: blogPosts.id });

  if (!deleted) return { ok: false, message: "Article not found." };

  updateTag("blog-posts");
  return { ok: true, postId: deleted.id };
}

export async function deleteBlogTranslation(postId: string, locale: "en" | "vi") {
  await requireAdmin();

  const parsedId = blogPostIdSchema.safeParse(postId);
  if (!parsedId.success) return { ok: false as const, message: "Invalid article identifier." };

  const translations = await db
    .select({ locale: blogPostTranslations.locale })
    .from(blogPostTranslations)
    .where(eq(blogPostTranslations.postId, parsedId.data));

  if (translations.length <= 1) {
    return { ok: false as const, message: "An article must keep at least one language." };
  }

  await db
    .delete(blogPostTranslations)
    .where(
      and(
        eq(blogPostTranslations.postId, parsedId.data),
        eq(blogPostTranslations.locale, locale),
      ),
    );
  updateTag("blog-posts");
  return { ok: true as const, postId: parsedId.data };
}
