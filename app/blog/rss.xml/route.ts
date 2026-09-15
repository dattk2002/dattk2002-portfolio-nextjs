import { getPublishedBlogPosts } from "@/lib/blog/data";
import { siteConfig } from "@/lib/site";

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] ?? character);
}

export async function GET() {
  const posts = await getPublishedBlogPosts();
  const items = posts.map((post) => {
    const url = new URL(`/blog/${post.locale}/${post.slug}`, siteConfig.url).toString();
    return `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(post.excerpt)}</description><language>${post.locale}</language><pubDate>${post.publishedAt?.toUTCString() ?? new Date().toUTCString()}</pubDate></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Tran Kim Dat — Blog</title><link>${escapeXml(new URL("/blog", siteConfig.url).toString())}</link><description>Practical notes on building, testing, and shipping full-stack products.</description><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
