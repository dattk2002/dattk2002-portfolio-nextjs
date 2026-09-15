import Link from "next/link";
import { ArrowUpRight, Languages, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAdminBlogPosts } from "@/lib/blog/data";

function stateLabel(status: "draft" | "published", publishedAt: Date | null) {
  if (status === "draft") return "Draft";
  if (publishedAt && publishedAt > new Date()) return "Scheduled";
  return "Published";
}

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();
  return (
    <div className="mx-auto max-w-[100rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="flex flex-col gap-8 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Publishing workspace</p><h1 className="mt-4 font-display text-5xl tracking-[-0.06em] sm:text-7xl">Articles</h1><p className="mt-4 max-w-xl leading-7 text-muted">Draft, translate, schedule, and publish writing from one structured source.</p></div>
        <Button size="lg" asChild><Link href="/admin/blog/new"><Plus className="size-5" aria-hidden="true" />New article</Link></Button>
      </div>

      {posts.length > 0 ? <div className="mt-8 border-t border-border">{posts.map(({ post, translations }) => {
        const primary = translations.find((translation) => translation.locale === "en") ?? translations[0];
        return <article key={post.id} className="grid gap-5 border-b border-border py-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Updated {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" }).format(post.updatedAt)}</p><h2 className="mt-3 truncate font-display text-3xl tracking-[-0.04em]">{primary?.title || "Untitled article"}</h2><div className="mt-4 flex flex-wrap gap-2">{translations.map((translation) => <span key={translation.locale} className="inline-flex min-h-8 items-center gap-2 border border-border px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted"><Languages className="size-3" aria-hidden="true" />{translation.locale} · {stateLabel(translation.status, translation.publishedAt)}</span>)}</div></div><div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link href={`/admin/blog/${post.id}`}>Edit article</Link></Button>{primary?.status === "published" && primary.publishedAt && primary.publishedAt <= new Date() ? <Button variant="ghost" asChild><Link href={`/blog/${primary.locale}/${primary.slug}`} target="_blank" rel="noreferrer">View live <ArrowUpRight className="size-4" aria-hidden="true" /></Link></Button> : null}</div></article>;
      })}</div> : <div className="mt-8 border border-border bg-surface p-10 text-center sm:p-16"><p className="font-display text-4xl tracking-[-0.05em]">No articles yet.</p><p className="mt-4 text-muted">Create the first draft and add translations when the story is ready.</p></div>}
    </div>
  );
}
