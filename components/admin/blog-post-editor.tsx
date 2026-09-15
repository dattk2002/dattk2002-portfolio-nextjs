"use client";

import { cloneElement, useEffect, useRef, useState, useTransition, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Eye, FilePenLine, Languages, Plus, Save, Trash2 } from "lucide-react";

import { deleteBlogPost, saveBlogPost } from "@/app/admin/blog/actions";
import { ImageUploadButton } from "@/components/admin/image-upload-button";
import { NotionEditor } from "@/components/admin/notion-editor";
import { BlogContent } from "@/components/blog-content";
import { Button } from "@/components/ui/button";
import type { BlogDocument, BlogLocale } from "@/lib/blog/types";
import {
  blogPostInputSchema,
  formatBlogFieldErrors,
  type BlogFieldErrors,
  type BlogPostInput,
} from "@/lib/blog/validation";
import { cn } from "@/lib/utils";

const emptyDocument: BlogDocument = { type: "doc", content: [{ type: "paragraph" }] };
const localeNames = { en: "English", vi: "Tiếng Việt" } as const;

type EditorTranslation = {
  locale: BlogLocale;
  slug: string;
  title: string;
  excerpt: string;
  content: BlogDocument;
  coverImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  publishedAt: string;
};

export type InitialBlogPost = {
  id: string;
  coverImageUrl: string | null;
  featured: boolean;
  tags: string[];
  translations: Array<{
    locale: BlogLocale;
    slug: string;
    title: string;
    excerpt: string;
    content: BlogDocument;
    coverImageAlt: string;
    seoTitle: string | null;
    seoDescription: string | null;
    status: "draft" | "published";
    publishedAt: Date | null;
  }>;
};

function blankTranslation(locale: BlogLocale): EditorTranslation {
  return { locale, slug: "", title: "", excerpt: "", content: structuredClone(emptyDocument), coverImageAlt: "", seoTitle: "", seoDescription: "", status: "draft", publishedAt: "" };
}

function toLocalDateTime(value: Date | null) {
  if (!value) return "";
  return new Date(value.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

function toSlug(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

type FieldControlProps = {
  id?: string;
  required?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

function Field({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactElement<FieldControlProps>;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const control = cloneElement(children, {
    id,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: cn(
      children.props.className,
      "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      error ? "border-error focus-visible:ring-error" : "focus-visible:ring-accent",
    ),
  });

  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? <><span className="ml-1 text-error" aria-hidden="true">*</span><span className="sr-only"> (required)</span></> : null}
      </label>
      {control}
      {hint ? <span id={`${id}-hint`} className="text-xs leading-5 text-faint">{hint}</span> : null}
      {error ? <span id={`${id}-error`} className="text-sm leading-6 text-error" role="alert">{error}</span> : null}
    </div>
  );
}

export function BlogPostEditor({ initialPost }: { initialPost?: InitialBlogPost }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [postId, setPostId] = useState(initialPost?.id);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initialPost?.coverImageUrl ?? null);
  const [featured, setFeatured] = useState(initialPost?.featured ?? false);
  const [tags, setTags] = useState(initialPost?.tags.join(", ") ?? "");
  const [translations, setTranslations] = useState<EditorTranslation[]>(
    initialPost?.translations.map((translation) => ({ ...translation, seoTitle: translation.seoTitle ?? "", seoDescription: translation.seoDescription ?? "", publishedAt: toLocalDateTime(translation.publishedAt) })) ?? [blankTranslation("en")],
  );
  const [activeLocale, setActiveLocale] = useState<BlogLocale>(initialPost?.translations[0]?.locale ?? "en");
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BlogFieldErrors>({});
  const [dirty, setDirty] = useState(false);
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const active = translations.find((translation) => translation.locale === activeLocale) ?? translations[0];
  const activeTranslationIndex = Math.max(0, translations.findIndex((translation) => translation.locale === activeLocale));

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const otherLocale = activeLocale === "en" ? "vi" : "en";
  const hasOtherLocale = translations.some((translation) => translation.locale === otherLocale);

  function buildPayload(): BlogPostInput {
    return {
      id: postId,
      coverImageUrl,
      featured,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      translations: translations.map((translation) => ({
        ...translation,
        seoTitle: translation.seoTitle.trim() || null,
        seoDescription: translation.seoDescription.trim() || null,
        publishedAt: translation.status === "published" && translation.publishedAt
          ? new Date(`${translation.publishedAt}:00+07:00`).toISOString()
          : null,
      })),
    };
  }

  function clearFieldErrors(prefixes: string[]) {
    setFieldErrors((current) => Object.fromEntries(
      Object.entries(current).filter(([path]) => !prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`))),
    ));
  }

  function getFieldError(prefix: string) {
    const entry = Object.entries(fieldErrors).find(([path]) => path === prefix || path.startsWith(`${prefix}.`));
    return entry?.[1][0];
  }

  function validateField(prefix: string) {
    const parsed = blogPostInputSchema.safeParse(buildPayload());
    const nextErrors = parsed.success ? {} : formatBlogFieldErrors(parsed.error);
    const relevantErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([path]) => path === prefix || path.startsWith(`${prefix}.`)),
    );

    setFieldErrors((current) => ({
      ...Object.fromEntries(Object.entries(current).filter(([path]) => path !== prefix && !path.startsWith(`${prefix}.`))),
      ...relevantErrors,
    }));
  }

  function updateActive(patch: Partial<EditorTranslation>) {
    setTranslations((current) => current.map((translation) => translation.locale === activeLocale ? { ...translation, ...patch } : translation));
    clearFieldErrors(Object.keys(patch).map((field) => `translations.${activeTranslationIndex}.${field}`));
    setDirty(true);
  }

  function addTranslation(copyExisting: boolean) {
    if (hasOtherLocale) { setActiveLocale(otherLocale); return; }
    const source = active;
    const next: EditorTranslation = copyExisting && source ? { ...source, locale: otherLocale, slug: "", status: "draft", publishedAt: "" } : blankTranslation(otherLocale);
    setTranslations((current) => [...current, next]);
    setActiveLocale(otherLocale);
    setDirty(true);
  }

  function removeActiveTranslation() {
    if (translations.length <= 1 || !window.confirm(`Remove the ${localeNames[activeLocale]} translation?`)) return;
    setTranslations((current) => current.filter((translation) => translation.locale !== activeLocale));
    setFieldErrors({});
    setActiveLocale(otherLocale);
    setDirty(true);
  }

  const publicationLabel = (() => {
    if (!active || active.status === "draft") return "Draft";
    if (active.publishedAt && new Date(`${active.publishedAt}:00+07:00`) > new Date()) return "Scheduled";
    return "Published";
  })();

  function submit() {
    setMessage(null);

    if (contentImageUploading) {
      setMessage({ type: "error", text: "Wait for the pasted image to finish uploading." });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    const parsed = blogPostInputSchema.safeParse(buildPayload());

    if (!parsed.success) {
      const errors = formatBlogFieldErrors(parsed.error);
      const errorCount = Object.values(errors).reduce((count, messages) => count + messages.length, 0);
      const translationIndex = parsed.error.issues[0]?.path[0] === "translations"
        ? Number(parsed.error.issues[0].path[1])
        : -1;

      if (translationIndex >= 0 && translations[translationIndex]) {
        setActiveLocale(translations[translationIndex].locale);
      }
      setPreview(false);
      setFieldErrors(errors);
      setMessage({ type: "error", text: `Review ${errorCount} highlighted ${errorCount === 1 ? "field" : "fields"}.` });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    startTransition(async () => {
      const result = await saveBlogPost(parsed.data);
      if (!result.ok) {
        setPreview(false);
        setFieldErrors(result.fieldErrors ?? {});
        setMessage({ type: "error", text: result.message });
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
      setPostId(result.postId);
      setFieldErrors({});
      setDirty(false);
      setMessage({ type: "success", text: "Article saved." });
      if (!postId) router.replace(`/admin/blog/${result.postId}`);
      router.refresh();
    });
  }

  function removePost() {
    if (!postId || !window.confirm("Delete this article and every translation? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteBlogPost(postId);
      if (!result.ok) { setMessage({ type: "error", text: result.message }); return; }
      setDirty(false);
      router.replace("/admin/blog");
      router.refresh();
    });
  }

  if (!active) return null;
  const activePath = `translations.${activeTranslationIndex}`;

  return (
    <form
      noValidate
      aria-busy={pending || contentImageUploading}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="mx-auto w-full min-w-0 max-w-[100rem] px-5 py-8 sm:px-8 lg:px-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <Link href="/admin/blog" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Articles</Link>
        <div className="flex flex-wrap gap-2">
          {postId ? <Button type="button" variant="ghost" disabled={pending || contentImageUploading} onClick={removePost}><Trash2 className="size-4" aria-hidden="true" />Delete</Button> : null}
          <Button type="button" variant="outline" disabled={contentImageUploading} onClick={() => setPreview((value) => !value)}>{preview ? <FilePenLine className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}{preview ? "Edit" : "Preview"}</Button>
          <Button type="submit" disabled={pending || contentImageUploading}><Save className="size-4" aria-hidden="true" />{pending ? "Saving…" : contentImageUploading ? "Uploading image…" : "Save article"}</Button>
        </div>
      </div>

      {message ? (
        <div
          ref={errorRef}
          tabIndex={message.type === "error" ? -1 : undefined}
          role={message.type === "error" ? "alert" : "status"}
          className={cn(
            "mt-5 border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-error",
            message.type === "error" ? "border-error/60 bg-error/10 text-error" : "border-success/60 bg-success/10 text-success",
          )}
        >
          {message.text}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border">
            <div className="flex" role="tablist" aria-label="Article translations">
              {translations.map((translation, index) => {
                const errorCount = Object.entries(fieldErrors)
                  .filter(([path]) => path.startsWith(`translations.${index}.`))
                  .reduce((count, [, errors]) => count + errors.length, 0);

                return (
                  <button
                    key={translation.locale}
                    type="button"
                    role="tab"
                    disabled={contentImageUploading}
                    aria-selected={translation.locale === activeLocale}
                    aria-label={`${localeNames[translation.locale]}, ${errorCount > 0 ? `${errorCount} validation ${errorCount === 1 ? "error" : "errors"}` : translation.status}`}
                    onClick={() => setActiveLocale(translation.locale)}
                    className={cn(
                      "min-h-12 border-r border-border px-5 font-mono text-[10px] uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-50",
                      translation.locale === activeLocale ? "bg-accent text-accent-foreground" : "text-muted hover:bg-surface",
                    )}
                  >
                    {localeNames[translation.locale]}
                    <span className={cn("ml-2 opacity-60", errorCount > 0 && "text-error opacity-100")}>
                      {errorCount > 0 ? `${errorCount} ${errorCount === 1 ? "error" : "errors"}` : translation.status === "published" ? "Live" : "Draft"}
                    </span>
                  </button>
                );
              })}
            </div>
            {!hasOtherLocale ? <div className="flex flex-wrap gap-2 pb-3 sm:pb-0"><Button type="button" size="sm" variant="ghost" disabled={contentImageUploading} onClick={() => addTranslation(false)}><Plus className="size-4" aria-hidden="true" />Add {localeNames[otherLocale]}</Button><Button type="button" size="sm" variant="ghost" disabled={contentImageUploading} onClick={() => addTranslation(true)}><Copy className="size-4" aria-hidden="true" />Duplicate content</Button></div> : null}
          </div>

          {preview ? (
            <article className="border-x border-b border-border px-5 py-12 sm:px-12 lg:px-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">{localeNames[active.locale]} · {publicationLabel}</p>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.9] tracking-[-0.06em] text-balance">{active.title || "Untitled article"}</h1>
              <p className="mt-6 text-lg leading-8 text-muted">{active.excerpt || "Add an excerpt to introduce the article."}</p>
              <div className="mt-14 border-t border-border pt-12"><BlogContent document={active.content} /></div>
            </article>
          ) : (
            <div className="grid min-w-0 gap-6 border-x border-b border-border bg-surface/30 p-5 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint"><span className="text-error" aria-hidden="true">*</span> Required field</p>
              <Field id={`title-${active.locale}`} label="Title" required error={getFieldError(`${activePath}.title`)}>
                <input
                  value={active.title}
                  maxLength={120}
                  onBlur={() => validateField(`${activePath}.title`)}
                  onChange={(event) => {
                    const title = event.target.value;
                    const followsTitle = !active.slug || active.slug === toSlug(active.title);
                    updateActive({ title, slug: followsTitle ? toSlug(title) : active.slug });
                  }}
                  className="min-h-14 min-w-0 border-b border-border bg-transparent font-display text-3xl tracking-[-0.04em] outline-none"
                  placeholder={active.locale === "vi" ? "Tiêu đề bài viết" : "Article title"}
                />
              </Field>
              <Field
                id={`excerpt-${active.locale}`}
                label="Excerpt"
                hint="A concise introduction shown on cards and used as the default meta description."
                required
                error={getFieldError(`${activePath}.excerpt`)}
              >
                <textarea
                  value={active.excerpt}
                  maxLength={320}
                  rows={3}
                  onBlur={() => validateField(`${activePath}.excerpt`)}
                  onChange={(event) => updateActive({ excerpt: event.target.value })}
                  className="min-w-0 border border-border bg-background p-4 text-base leading-7"
                />
              </Field>
              <div className="min-w-0">
                <p className="mb-2 text-sm font-medium">Content</p>
                <NotionEditor key={active.locale} label={`${localeNames[active.locale]} article content`} value={active.content} onChange={(content) => updateActive({ content })} onImageUploadChange={setContentImageUploading} />
                {getFieldError(`${activePath}.content`) ? <p className="mt-2 text-sm leading-6 text-error" role="alert">{getFieldError(`${activePath}.content`)}</p> : null}
              </div>
            </div>
          )}
        </section>

        <aside className="grid content-start gap-6 xl:sticky xl:top-6 xl:self-start">
          <section className="border border-border bg-surface p-5">
            <div className="flex items-center gap-2">
              <Languages className="size-4 text-steel" aria-hidden="true" />
              <h2 className="font-display text-xl tracking-[-0.03em]">Publication</h2>
            </div>
            <div className="mt-5 grid gap-5">
              <Field id={`status-${active.locale}`} label="Status" required error={getFieldError(`${activePath}.status`)}>
                <select
                  value={active.status}
                  onBlur={() => validateField(`${activePath}.status`)}
                  onChange={(event) => updateActive({
                    status: event.target.value as EditorTranslation["status"],
                    publishedAt: event.target.value === "published" && !active.publishedAt ? toLocalDateTime(new Date()) : active.publishedAt,
                  })}
                  className="min-h-11 border border-border bg-background px-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publish / schedule</option>
                </select>
              </Field>
              {active.status === "published" ? (
                <Field
                  id={`published-at-${active.locale}`}
                  label="Publish at"
                  hint="Asia/Ho_Chi_Minh (UTC+7)"
                  required
                  error={getFieldError(`${activePath}.publishedAt`)}
                >
                  <input
                    type="datetime-local"
                    value={active.publishedAt}
                    onBlur={() => validateField(`${activePath}.publishedAt`)}
                    onChange={(event) => updateActive({ publishedAt: event.target.value })}
                    className="min-h-11 border border-border bg-background px-3"
                  />
                </Field>
              ) : null}
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Effective state · {publicationLabel}</p>
            </div>
          </section>

          <section className="grid gap-5 border border-border bg-surface p-5">
            <h2 className="font-display text-xl tracking-[-0.03em]">URL and discovery</h2>
            <Field
              id={`slug-${active.locale}`}
              label="Slug"
              hint={`/blog/${active.locale}/${active.slug || "article-slug"}`}
              required
              error={getFieldError(`${activePath}.slug`)}
            >
              <input
                value={active.slug}
                maxLength={120}
                onBlur={() => validateField(`${activePath}.slug`)}
                onChange={(event) => updateActive({ slug: toSlug(event.target.value) })}
                className="min-h-11 border border-border bg-background px-3 font-mono text-xs"
              />
            </Field>
            <Field id="article-tags" label="Tags" hint="Separate up to eight tags with commas." error={getFieldError("tags")}>
              <input
                value={tags}
                onBlur={() => validateField("tags")}
                onChange={(event) => {
                  setTags(event.target.value);
                  clearFieldErrors(["tags"]);
                  setDirty(true);
                }}
                className="min-h-11 border border-border bg-background px-3"
                placeholder="Next.js, PostgreSQL"
              />
            </Field>
            <label className="flex min-h-11 items-center gap-3">
              <input type="checkbox" checked={featured} onChange={(event) => { setFeatured(event.target.checked); setDirty(true); }} className="size-4 accent-accent" />
              <span className="text-sm">Feature this article</span>
            </label>
          </section>

          <section className="grid gap-5 border border-border bg-surface p-5">
            <h2 className="font-display text-xl tracking-[-0.03em]">Cover image</h2>
            {coverImageUrl ? <div className="relative aspect-video overflow-hidden border border-border"><Image src={coverImageUrl} alt="Current cover preview" fill sizes="22rem" className="object-cover" /></div> : <div className="ambient-grid aspect-video border border-border bg-background" aria-hidden="true" />}
            <ImageUploadButton label={coverImageUrl ? "Replace cover" : "Upload cover"} onUploaded={(url) => { setCoverImageUrl(url); clearFieldErrors(["coverImageUrl"]); setDirty(true); }} />
            {coverImageUrl ? <Button type="button" variant="ghost" onClick={() => { setCoverImageUrl(null); clearFieldErrors(["coverImageUrl", ...translations.map((_, index) => `translations.${index}.coverImageAlt`)]); setDirty(true); }}>Remove cover</Button> : null}
            <Field
              id={`cover-alt-${active.locale}`}
              label={`Alt text · ${localeNames[active.locale]}`}
              required={Boolean(coverImageUrl)}
              error={getFieldError(`${activePath}.coverImageAlt`)}
            >
              <input
                value={active.coverImageAlt}
                maxLength={180}
                onBlur={() => validateField(`${activePath}.coverImageAlt`)}
                onChange={(event) => updateActive({ coverImageAlt: event.target.value })}
                className="min-h-11 border border-border bg-background px-3"
              />
            </Field>
          </section>

          <section className="grid gap-5 border border-border bg-surface p-5">
            <h2 className="font-display text-xl tracking-[-0.03em]">SEO · {localeNames[active.locale]}</h2>
            <Field id={`seo-title-${active.locale}`} label="SEO title" hint={`${active.seoTitle.length}/70`} error={getFieldError(`${activePath}.seoTitle`)}>
              <input value={active.seoTitle} maxLength={70} onBlur={() => validateField(`${activePath}.seoTitle`)} onChange={(event) => updateActive({ seoTitle: event.target.value })} className="min-h-11 border border-border bg-background px-3" />
            </Field>
            <Field id={`seo-description-${active.locale}`} label="SEO description" hint={`${active.seoDescription.length}/170`} error={getFieldError(`${activePath}.seoDescription`)}>
              <textarea value={active.seoDescription} maxLength={170} rows={4} onBlur={() => validateField(`${activePath}.seoDescription`)} onChange={(event) => updateActive({ seoDescription: event.target.value })} className="border border-border bg-background p-3" />
            </Field>
          </section>

          {translations.length > 1 ? <Button type="button" variant="ghost" disabled={contentImageUploading} onClick={removeActiveTranslation}><Trash2 className="size-4" aria-hidden="true" />Remove {localeNames[active.locale]} translation</Button> : null}
        </aside>
      </div>
    </form>
  );
}
