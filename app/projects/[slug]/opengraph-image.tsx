import { ImageResponse } from "next/og";

import { BrandMark } from "@/components/brand-mark";
import { notFound } from "next/navigation";

import { getProject } from "@/lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#090b0c", color: "#f1efe7", padding: "64px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#7ea2b8", fontSize: 18 }}><span>{project.context.toUpperCase()}</span><span>{project.period}</span></div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, lineHeight: 0.9, letterSpacing: "-7px" }}>{project.name}</div>
        <div style={{ marginTop: 30, maxWidth: 920, fontSize: 24, lineHeight: 1.35, color: "#a7adb0" }}>{project.summary}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 16, color: "#a7adb0" }}><BrandMark style={{ width: 30, height: 30, color: "#c7f36b" }} /><span>{project.technologies.slice(0, 4).join(" · ")}</span></div>
    </div>,
    size,
  );
}
