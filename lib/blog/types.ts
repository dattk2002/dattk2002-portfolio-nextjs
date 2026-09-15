export const blogLocales = ["en", "vi"] as const;

export const blogFontSizes = ["0.875rem", "1.125rem", "1.25rem", "1.5rem", "2rem"] as const;
export const blogFontWeights = ["300", "500", "600"] as const;

export type BlogFontSize = (typeof blogFontSizes)[number];
export type BlogFontWeight = (typeof blogFontWeights)[number];

export function isBlogFontSize(value: unknown): value is BlogFontSize {
  return typeof value === "string" && (blogFontSizes as readonly string[]).includes(value);
}

export function isBlogFontWeight(value: unknown): value is BlogFontWeight {
  return typeof value === "string" && (blogFontWeights as readonly string[]).includes(value);
}

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
