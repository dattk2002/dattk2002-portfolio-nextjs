import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type { BlogDocument } from "@/lib/blog/types";

export const blogLocaleEnum = pgEnum("blog_locale", ["en", "vi"]);
export const blogPostStatusEnum = pgEnum("blog_post_status", ["draft", "published"]);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    coverImageUrl: text("cover_image_url"),
    featured: boolean("featured").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("blog_posts_featured_idx").on(table.featured)],
);

export const blogPostTranslations = pgTable(
  "blog_post_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    locale: blogLocaleEnum("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: jsonb("content").$type<BlogDocument>().notNull(),
    coverImageAlt: text("cover_image_alt").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: blogPostStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("blog_post_translations_post_locale_uidx").on(table.postId, table.locale),
    uniqueIndex("blog_post_translations_locale_slug_uidx").on(table.locale, table.slug),
    index("blog_post_translations_publication_idx").on(
      table.locale,
      table.status,
      table.publishedAt,
    ),
    index("blog_post_translations_post_idx").on(table.postId),
  ],
);

export const blogTags = pgTable("blog_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("blog_post_tags_tag_idx").on(table.tagId),
  ],
);
