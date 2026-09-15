import Image from "next/image";

import type { BlogDocument, BlogEditorNode } from "@/lib/blog/types";

type BlogContentProps = {
  document: BlogDocument;
};

function safeUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, "https://www.dattk.dev");
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

function youtubeEmbedUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    let id = "";
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (url.hostname.endsWith("youtube.com")) {
      id = url.pathname.startsWith("/embed/")
        ? url.pathname.split("/")[2] ?? ""
        : url.searchParams.get("v") ?? "";
    }
    return /^[a-zA-Z0-9_-]{6,20}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

function renderChildren(node: BlogEditorNode) {
  return node.content?.map((child, index) => renderNode(child, `${node.type}-${index}`)) ?? null;
}

function renderText(node: BlogEditorNode, key: string) {
  let content: React.ReactNode = node.text ?? "";

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = <strong>{content}</strong>;
    if (mark.type === "italic") content = <em>{content}</em>;
    if (mark.type === "underline") content = <u>{content}</u>;
    if (mark.type === "strike") content = <s>{content}</s>;
    if (mark.type === "code") content = <code>{content}</code>;
    if (mark.type === "link") {
      const href = safeUrl(mark.attrs?.href);
      if (href) {
        const external = href.startsWith("http");
        content = (
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
            {content}
          </a>
        );
      }
    }
  }

  return <span key={key}>{content}</span>;
}

function renderNode(node: BlogEditorNode, key: string): React.ReactNode {
  if (node.type === "text") return renderText(node, key);
  const children = renderChildren(node);

  if (node.type === "paragraph") return <p key={key}>{children}</p>;
  if (node.type === "heading") {
    const level = Number(node.attrs?.level) === 3 ? 3 : 2;
    return level === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>;
  }
  if (node.type === "bulletList") return <ul key={key}>{children}</ul>;
  if (node.type === "orderedList") return <ol key={key}>{children}</ol>;
  if (node.type === "listItem") return <li key={key}>{children}</li>;
  if (node.type === "taskList") return <ul key={key} className="blog-task-list">{children}</ul>;
  if (node.type === "taskItem") {
    const checked = Boolean(node.attrs?.checked);
    return <li key={key} data-checked={checked}><input type="checkbox" checked={checked} readOnly aria-label={checked ? "Completed item" : "Incomplete item"} />{children}</li>;
  }
  if (node.type === "blockquote") return <blockquote key={key}>{children}</blockquote>;
  if (node.type === "codeBlock") return <pre key={key}><code>{children}</code></pre>;
  if (node.type === "horizontalRule") return <hr key={key} />;
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type === "image") {
    const src = safeUrl(node.attrs?.src);
    if (!src) return null;
    const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
    const width = Number(node.attrs?.width) || 1600;
    const height = Number(node.attrs?.height) || 900;
    return (
      <figure key={key}>
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 900px) 100vw, 800px" />
        {typeof node.attrs?.title === "string" && node.attrs.title ? <figcaption>{node.attrs.title}</figcaption> : null}
      </figure>
    );
  }
  if (node.type === "youtube") {
    const src = youtubeEmbedUrl(node.attrs?.src);
    if (!src) return null;
    return (
      <div key={key} className="blog-video">
        <iframe src={src} title={typeof node.attrs?.title === "string" ? node.attrs.title : "Embedded YouTube video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
    );
  }
  return <div key={key}>{children}</div>;
}

export function BlogContent({ document }: BlogContentProps) {
  return <div className="blog-content">{document.content?.map((node, index) => renderNode(node, `root-${index}`))}</div>;
}
