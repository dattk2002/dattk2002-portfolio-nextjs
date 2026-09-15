import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostEditor } from "@/components/admin/blog-post-editor";
import { getAdminBlogPost } from "@/lib/blog/data";

export const metadata: Metadata = { title: "Edit article", robots: { index: false, follow: false } };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminBlogPost(id);
  if (!post) notFound();
  return <BlogPostEditor initialPost={post} />;
}
