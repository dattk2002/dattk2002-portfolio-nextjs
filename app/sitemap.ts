import type { MetadataRoute } from "next";

import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = projects.map((project) => ({
    url: new URL(`/projects/${project.slug}`, siteConfig.url).toString(),
    lastModified: new Date("2026-08-13"),
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.9 : 0.8,
  }));

  return [
    {
      url: new URL("/", siteConfig.url).toString(),
      lastModified: new Date("2026-08-13"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
