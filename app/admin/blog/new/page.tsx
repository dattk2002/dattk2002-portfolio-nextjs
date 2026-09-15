import type { Metadata } from "next";

import { BlogPostEditor } from "@/components/admin/blog-post-editor";

export const metadata: Metadata = { title: "New article", robots: { index: false, follow: false } };

export default function NewBlogPostPage() {
  return <BlogPostEditor />;
}
