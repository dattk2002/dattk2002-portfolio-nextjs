import type { BlogDocument, BlogEditorNode } from "@/lib/blog/types";
import { presentBlogMedia, type BlogMediaCredit } from "@/lib/blog/media";

type BlogPresentationPost = {
  title: string;
  excerpt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImageAlt: string;
  tags: string[];
  content: BlogDocument;
};

function prose(value: string) {
  return value.replace(/[ \t]*\u2014[ \t]*/g, " - ");
}

function presentNode(node: BlogEditorNode): BlogEditorNode {
  // Code samples and literal values retain their exact authored meaning.
  if (node.type === "codeBlock" || node.marks?.some((mark) => mark.type === "code")) return node;

  return {
    ...node,
    ...(node.text !== undefined ? { text: prose(node.text) } : {}),
    ...(node.attrs ? {
      attrs: {
        ...node.attrs,
        ...(typeof node.attrs.alt === "string" ? { alt: prose(node.attrs.alt) } : {}),
        ...(typeof node.attrs.title === "string" ? { title: prose(node.attrs.title) } : {}),
      },
    } : {}),
    ...(node.content ? { content: node.content.map(presentNode) } : {}),
  };
}

/** Apply public media and punctuation presentation without changing stored editor records. */
export function presentBlogPost<T extends BlogPresentationPost>(storedPost: T): T & { coverImageCredit?: BlogMediaCredit } {
  const post = presentBlogMedia(storedPost);
  return {
    ...post,
    title: prose(post.title),
    excerpt: prose(post.excerpt),
    seoTitle: post.seoTitle === null ? null : prose(post.seoTitle),
    seoDescription: post.seoDescription === null ? null : prose(post.seoDescription),
    coverImageAlt: prose(post.coverImageAlt),
    tags: post.tags.map(prose),
    content: {
      ...post.content,
      ...(post.content.content ? { content: post.content.content.map(presentNode) } : {}),
    },
  };
}
