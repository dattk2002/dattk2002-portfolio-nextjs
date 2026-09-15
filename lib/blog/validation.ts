import { z } from "zod";

import {
  blogFontSizes,
  blogFontWeights,
  blogLocales,
  type BlogDocument,
  type BlogEditorNode,
} from "@/lib/blog/types";

const allowedNodeTypes = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "image",
  "youtube",
]);

const markSchema = z.object({
  type: z.enum(["bold", "italic", "underline", "strike", "code", "link", "textStyle"]),
  attrs: z.record(z.string(), z.unknown()).optional(),
}).superRefine((mark, context) => {
  if (mark.type !== "textStyle") return;

  const result = z
    .object({
      fontSize: z.enum(blogFontSizes).nullable().optional(),
      fontWeight: z.enum(blogFontWeights).nullable().optional(),
    })
    .strict()
    .safeParse(mark.attrs ?? {});

  if (!result.success) {
    context.addIssue({
      code: "custom",
      message: "Unsupported text size or weight.",
    });
  }
});

const editorNodeSchema: z.ZodType<BlogEditorNode> = z.lazy(() =>
  z.object({
    type: z.string().min(1).max(40),
    attrs: z.record(z.string(), z.unknown()).optional(),
    marks: z.array(markSchema).max(12).optional(),
    text: z.string().max(100_000).optional(),
    content: z.array(editorNodeSchema).max(2_000).optional(),
  }),
);

export const blogDocumentSchema: z.ZodType<BlogDocument> = z
  .object({
    type: z.literal("doc"),
    content: z.array(editorNodeSchema).max(2_000).optional(),
  })
  .superRefine((document, context) => {
    let nodeCount = 0;
    const visit = (node: BlogEditorNode) => {
      nodeCount += 1;
      if (!allowedNodeTypes.has(node.type)) {
        context.addIssue({ code: "custom", message: `Unsupported editor node: ${node.type}` });
      }
      node.content?.forEach(visit);
    };
    document.content?.forEach(visit);

    if (nodeCount > 5_000) {
      context.addIssue({ code: "custom", message: "The article is too large." });
    }
  });

export const blogPostIdSchema = z.string().uuid();

const translationSchema = z.object({
  locale: z.enum(blogLocales),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a URL slug.")
    .max(120, "Keep the URL slug within 120 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  title: z.string().trim().min(1, "Enter an article title.").max(120, "Keep the title within 120 characters."),
  excerpt: z.string().trim().min(1, "Enter an article excerpt.").max(320, "Keep the excerpt within 320 characters."),
  content: blogDocumentSchema,
  coverImageAlt: z.string().trim().max(180, "Keep the cover alt text within 180 characters."),
  seoTitle: z.string().trim().max(70, "Keep the SEO title within 70 characters.").nullable(),
  seoDescription: z.string().trim().max(170, "Keep the SEO description within 170 characters.").nullable(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().datetime({ offset: true }).nullable(),
});

export const blogPostInputSchema = z
  .object({
    id: blogPostIdSchema.optional(),
    coverImageUrl: z.string().url("Use a valid cover image URL.").nullable(),
    featured: z.boolean(),
    tags: z
      .array(z.string().trim().min(1, "Remove empty tags.").max(40, "Keep every tag within 40 characters."))
      .max(8, "Use no more than eight tags."),
    translations: z.array(translationSchema).min(1, "Add at least one translation.").max(blogLocales.length),
  })
  .superRefine((value, context) => {
    const locales = value.translations.map((translation) => translation.locale);
    if (new Set(locales).size !== locales.length) {
      context.addIssue({ code: "custom", message: "Each locale can only appear once." });
    }

    value.translations.forEach((translation, index) => {
      if (translation.status === "published" && !translation.publishedAt) {
        context.addIssue({
          code: "custom",
          path: ["translations", index, "publishedAt"],
          message: "Published and scheduled articles need a publication date.",
        });
      }
      if (value.coverImageUrl && !translation.coverImageAlt) {
        context.addIssue({
          code: "custom",
          path: ["translations", index, "coverImageAlt"],
          message: "Cover image alt text is required for every translation.",
        });
      }
    });
  });

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
export type BlogFieldErrors = Record<string, string[]>;

export function formatBlogFieldErrors(error: z.ZodError): BlogFieldErrors {
  return error.issues.reduce<BlogFieldErrors>((fieldErrors, issue) => {
    const path = issue.path.join(".") || "article";
    fieldErrors[path] = [...(fieldErrors[path] ?? []), issue.message];
    return fieldErrors;
  }, {});
}

export function normalizeTag(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
