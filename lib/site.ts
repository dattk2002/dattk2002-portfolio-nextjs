const fallbackSiteUrl = "http://localhost:3000";

export const siteConfig = {
  name: "Tran Kim Dat",
  role: "Full-stack Developer",
  description:
    "Full-stack developer building production web applications and cross-platform products from interface to infrastructure.",
  location: "Ho Chi Minh City, Vietnam",
  email: "kimdat0705@gmail.com",
  phoneDisplay: "+84 98 356 4074",
  phoneHref: "+84983564074",
  github: "https://github.com/dattk2002",
  linkedin: "https://www.linkedin.com/in/kimdat0705/",
  portraitPath: "/images/tran-kim-dat-portrait-2026.webp",
  cvPath: "/documents/CV-Tran%20Kim%20Dat-Full-stack%20Developer.pdf",
  cvDownloadName: "CV-Tran Kim Dat-Full-stack Developer.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
} as const;
