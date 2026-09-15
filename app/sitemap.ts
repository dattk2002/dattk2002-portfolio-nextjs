import type { MetadataRoute } from "next";

import { getPublishedBlogPosts } from "@/lib/blog/data";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectRoutes = projects.map((project) => ({
    url: new URL(`/projects/${project.slug}`, siteConfig.url).toString(),
    lastModified: new Date("2026-08-13"),
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.9 : 0.8,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedBlogPosts();
    blogRoutes = posts.map((post) => ({
      url: new URL(`/blog/${post.locale}/${post.slug}`, siteConfig.url).toString(),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.8 : 0.7,
      alternates: {
        languages: { [post.locale]: new URL(`/blog/${post.locale}/${post.slug}`, siteConfig.url).toString() },
      },
    }));
  } catch {
    // Keep static portfolio routes discoverable if the external database is unavailable.
  }

  return [
    {
      url: new URL("/", siteConfig.url).toString(),
      lastModified: new Date("2026-08-13"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/blog", siteConfig.url).toString(),
      lastModified: blogRoutes.reduce((latest, route) => {
        const modified = route.lastModified ? new Date(route.lastModified) : latest;
        return modified > latest ? modified : latest;
      }, new Date("2026-09-15")),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectRoutes,
    ...blogRoutes,
  ];
}
