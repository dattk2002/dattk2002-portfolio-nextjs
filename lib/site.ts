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
  role: "Full-stack Developer",
  description:
    "Full-stack developer building production web applications and cross-platform products from interface to infrastructure.",
  location: "Da Nang City / Ho Chi Minh City, Vietnam",
  email: "kimdat0705@gmail.com",
  phoneDisplay: "+84 98 356 4074",
  phoneHref: "+84983564074",
  github: "https://github.com/dattk2002",
  linkedin: "https://www.linkedin.com/in/kimdat0705/",
  portraitPath: "/images/tran-kim-dat-portrait-2026.webp",
  cvPath: "/api/cv",
  cvDownloadName: "CV-Tran Kim Dat-Full-stack Developer.pdf",
  url: resolveSiteUrl(),
} as const;
