import mediaSources from './media-sources.json' with { type: 'json' };

import type { BlogDocument, BlogEditorNode } from '@/lib/blog/types';

export type BlogMediaCredit = {
  caption: string;
  publisher: string;
  sourcePage: string;
  licenseUrl: string | null;
};

type SourcedMedia = BlogMediaCredit & {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const replacements = new Map<string, SourcedMedia>(
  mediaSources.map(source => [source.originalUrl, source]),
);

function sourceParagraph(media: SourcedMedia): BlogEditorNode {
  const link = (text: string, href: string): BlogEditorNode => ({
    type: 'text', text,
    marks: [{ type: 'link', attrs: { href, target: '_blank', rel: 'noreferrer' } }],
  });
  return {
    type: 'paragraph',
    content: [
      { type: 'text', text: `Image: ${media.publisher}. ` },
      link('Original source', media.sourcePage),
      { type: 'text', text: ' - ' },
      link('Full-size image', media.src),
      ...(media.licenseUrl ? [
        { type: 'text', text: ' - ' }, link('License', media.licenseUrl),
      ] : []),
    ],
  };
}

function replaceNode(node: BlogEditorNode): BlogEditorNode[] {
  if (node.type === 'image' && typeof node.attrs?.src === 'string') {
    const media = replacements.get(node.attrs.src);
    if (media) return [{
      ...node,
      attrs: {
        ...node.attrs,
        src: media.src, alt: media.alt,
        title: `${media.caption} Image: ${media.publisher}.`,
        width: media.width, height: media.height,
      },
    }, sourceParagraph(media)];
  }
  return [{ ...node, ...(node.content ? { content: node.content.flatMap(replaceNode) } : {}) }];
}

/** Replace only known historical illustrations; later owner-selected media stays authoritative. */
export function presentBlogMedia<T extends {
  coverImageUrl?: string | null;
  coverImageAlt: string;
  content: BlogDocument;
}>(post: T): T & { coverImageCredit?: BlogMediaCredit } {
  const cover = post.coverImageUrl ? replacements.get(post.coverImageUrl) : undefined;
  return {
    ...post,
    ...(cover ? {
      coverImageUrl: cover.src,
      coverImageAlt: cover.alt,
      coverImageCredit: {
        caption: cover.caption, publisher: cover.publisher,
        sourcePage: cover.sourcePage, licenseUrl: cover.licenseUrl,
      },
    } : {}),
    content: {
      ...post.content,
      ...(post.content.content ? { content: post.content.content.flatMap(replaceNode) } : {}),
    },
  };
}
