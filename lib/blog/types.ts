export const blogLocales = ["en", "vi"] as const;

export type BlogLocale = (typeof blogLocales)[number];

export type BlogEditorNode = {
  type: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
  content?: BlogEditorNode[];
};

export type BlogDocument = {
  type: "doc";
  content?: BlogEditorNode[];
};
