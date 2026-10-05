const fallbackSiteUrl = "http://localhost:3000";

function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();

    if (!value) continue;

    try {
      return new URL(value).toString();
    } catch {
      try {
        return new URL(`https://${value}`).toString();
      } catch {
        // Ignore malformed environment values and try the next candidate.
      }
    }
  }

  return fallbackSiteUrl;
}

export const siteConfig = {
  name: "Tran Kim Dat",
  role: "Full-stack Engineer",
  description:
    "Full-stack engineer building production web, cross-platform mobile, and source-grounded AI learning products from interface to infrastructure.",
  summary:
    "Full-stack Engineer with 3+ years delivering production web and cross-platform mobile applications. I build source-grounded AI learning workflows, REST APIs, authentication, and real-time systems, and own delivery through automated testing, Docker, CI/CD, and cloud deployment.",
  location: "Da Nang City / Ho Chi Minh City, Vietnam",
  email: "kimdat0705@gmail.com",
  phoneDisplay: "+84 98 356 4074",
  phoneHref: "+84983564074",
  github: "https://github.com/dattk2002",
  linkedin: "https://www.linkedin.com/in/kimdat0705/",
  portraitPath: "/images/tran-kim-dat-portrait-2026.webp",
  cvPath: "/api/cv",
  cvDownloadName: "CV-Tran Kim Dat-Full-stack Engineer.pdf",
  url: resolveSiteUrl(),
} as const;
