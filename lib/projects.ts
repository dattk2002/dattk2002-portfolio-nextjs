export type ProjectSlug =
  | "bravodemy"
  | "huntingalice"
  | "mystical-orb"
  | "oathfront"
  | "panda"
  | "tapmood"
  | "habistride"
  | "ngoaingungay"
  | "trivia-quiz"
  | "fastcare"
  | "caocao-adventures"
  | "tamda"
  | "vncaps";

export type Project = {
  slug: ProjectSlug;
  name: string;
  period: string;
  context: "Independent product" | "Capstone product" | "Client production" | "Freelance engagement";
  summary: string;
  ownership: string;
  technologies: readonly string[];
  outcomes: readonly string[];
  challenge: string;
  approach: string;
  architecture: readonly string[];
  gallery: readonly { src: string; alt: string; width: number; height: number }[];
  accent: "lime" | "blue" | "amber" | "violet";
  liveUrls?: readonly { label: string; href: string }[];
  repositoryUrls?: readonly { label: string; href: string }[];
  featured: boolean;
};

export const projects: readonly Project[] = [
  {
    slug: "bravodemy",
    name: "Bravodemy",
    period: "Aug 2026 – Present",
    context: "Freelance engagement",
    summary:
      "An AI microlearning platform that turns natural-language goals into source-grounded syllabi and lesson cores, followed by 5–10 minute lessons, practice, spaced review, and progress tracking.",
    ownership: "Built the entire bilingual Next.js frontend and the FastAPI backend foundation, data layer, authentication, payments, research integrations, and release tooling. Collaborated with the developer responsible for core lesson generation.",
    technologies: [
      "Next.js 16", "React 19", "TypeScript", "Python", "FastAPI", "SQLAlchemy",
      "PostgreSQL", "Redis", "Gemini grounded search", "Exa", "Tavily", "Langfuse",
      "Tailwind CSS", "Radix UI", "Recharts", "GSAP", "Polar", "Docker", "Render",
      "Neon", "GitHub Actions", "Pytest", "Vitest", "Playwright",
    ],
    outcomes: [
      "Delivered bilingual onboarding, learning paths, lesson and practice interfaces, and progress views in Next.js, React, and TypeScript.",
      "Developed learner-account and application-state models with SQLAlchemy/PostgreSQL, email and Google authentication, and rotating sessions.",
      "Implemented Polar checkout and signed webhooks for purchases, entitlements, and refunds.",
      "Integrated Exa, Gemini, and Tavily for source research, with Redis caching, rate limiting, and locks; collaborated on the learning product with the core lesson-generation developer.",
      "Set up Docker deployments on Render, Neon database connections, and GitHub Actions checks with Pytest, Vitest, and Playwright.",
    ],
    challenge: "Connect onboarding, source research, learning, practice, and purchases into a coherent bilingual product while keeping account state, sessions, and entitlements reliable.",
    approach: "Delivered the frontend across the learner journey and established backend foundations for accounts and application state. Research integrations supply source context, signed Polar webhooks manage access, and Redis supports caching and coordination. Core lesson generation was handled by another developer, with automated checks and containerized releases supporting collaboration.",
    architecture: [
      "Bilingual Next.js and React frontend for onboarding, learning, practice, and progress",
      "FastAPI foundations with SQLAlchemy and Neon PostgreSQL for learner accounts and application state",
      "Email/Google authentication and rotating sessions",
      "Polar checkout and signed purchase, entitlement, and refund webhooks",
      "Exa, Gemini, and Tavily research integrations; Redis caching, rate limits, and locks",
      "Docker on Render with GitHub Actions, Pytest, Vitest, and Playwright",
    ],
    gallery: [
      { src: "/images/projects/bravodemy-main.webp", alt: "Bravodemy AI microlearning homepage with globe illustration and a guided lesson preview", width: 1665, height: 903 },
    ],
    accent: "blue",
    liveUrls: [{ label: "Bravodemy", href: "https://bravodemy.com" }],
    repositoryUrls: [{ label: "Product repository", href: "https://github.com/tkhieu/AIMicroLearningPlatform" }],
    featured: true,
  },
  {
    slug: "huntingalice",
    name: "HuntingAlice",
    period: "2026",
    context: "Freelance engagement",
    summary: "An AI-powered B2B prospecting platform for company research, campaign setup, and evidence-backed prospect review.",
    ownership: "Developed frontend and backend workflows for onboarding, company and competitor research, campaign setup, and prospect review as a freelance full-stack engineer.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Inngest",
      "REST API",
      "WebSocket",
      "Validated contracts"
    ],
    outcomes: [
      "Built onboarding, company/competitor research, campaign setup, and prospect-review interfaces in Next.js, React, and TypeScript.",
      "Integrated REST APIs and WebSocket updates through shared, validated contracts to show research progress and reusable results.",
      "Implemented idempotent campaign saves in NestJS/PostgreSQL and integrated Inngest background workflows for research and discovery.",
      "Kept contact data out of durable workflow outputs and applied suppression checks to lead results and events."
    ],
    challenge: "Make long-running company research and campaign setup understandable while avoiding duplicate saves and keeping contact data out of durable workflow outputs.",
    approach: "Connected product interfaces to shared validated API contracts and WebSocket progress updates. Idempotent campaign persistence supports repeated save requests, Inngest coordinates research/discovery work, and suppression checks apply to lead results and events.",
    architecture: [
      "Next.js/React/TypeScript onboarding, research, campaign, and prospect-review interfaces",
      "REST APIs and WebSocket progress updates with shared validated contracts",
      "NestJS/PostgreSQL idempotent campaign persistence",
      "Inngest background workflows for research and discovery",
      "Contact-data boundaries in durable outputs and suppression checks on results/events"
    ],
    gallery: [
      {
        src: "/images/projects/huntingalice-main.webp",
        alt: "HuntingAlice public sign-in page for the B2B research and prospecting workspace",
        width: 1440,
        height: 900
      }
    ],
    accent: "blue",
    liveUrls: [
      {
        label: "HuntingAlice",
        href: "https://beta.huntingalice.com"
      }
    ],
    featured: false
  },
  {
    slug: "mystical-orb",
    name: "Mystical Orb",
    period: "2026",
    context: "Freelance engagement",
    summary: "A bilingual Tarot reading experience with question entry, card draws, results, and optional shared readings.",
    ownership: "Built the Next.js/React/TypeScript frontend for reading journeys, session continuity, marketing pages, shared readings, language switching, and consent controls.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Vietnamese/English",
      "Web Share API",
      "Clipboard API"
    ],
    outcomes: [
      "Built question-entry, card-draw, and result interfaces with session continuity across sign-in and refresh.",
      "Developed marketing and shared-reading pages with native sharing, clipboard fallback, and optional question disclosure.",
      "Implemented Vietnamese/English switching and consent controls for analytics and marketing tracking."
    ],
    challenge: "Keep a reading journey continuous across authentication and refresh while giving users control over language, tracking consent, and disclosure when sharing.",
    approach: "Built the reading interfaces around continuity between question entry, card draw, and results. Shared-reading pages provide native or clipboard sharing with optional question disclosure, while bilingual controls and consent choices remain part of the frontend experience.",
    architecture: [
      "Next.js/React and TypeScript frontend for reading and marketing pages",
      "Session continuity across sign-in and refresh",
      "Shared-reading pages with native sharing and clipboard fallback",
      "Optional question disclosure in shared readings",
      "Vietnamese/English switching and analytics/marketing consent controls"
    ],
    gallery: [
      {
        src: "/images/projects/mystical-orb-main.webp",
        alt: "Mystical Orb public homepage introducing its Tarot reading experience",
        width: 1440,
        height: 900
      }
    ],
    accent: "violet",
    liveUrls: [
      {
        label: "Mystical Orb",
        href: "https://mysticalorb.com"
      }
    ],
    featured: false
  },
  {
    slug: "oathfront",
    name: "OathFront",
    period: "Oct 2026 – Present",
    context: "Independent product",
    summary:
      "A browser-based PvE tactical card game with five-lane battles, deck building, and interactive Three.js battlefields. Currently in active development.",
    ownership:
      "Solo creator responsible for the entire product: game design, interface and artwork pipeline, Three.js rendering, deterministic rules and bots, backend APIs, persistence, testing, and deployment.",
    technologies: [
      "Three.js", "Next.js", "React", "TypeScript", "GSAP", "Fastify",
      "PostgreSQL", "Drizzle ORM", "Neon", "Vercel", "Docker", "Vitest", "Playwright",
    ],
    outcomes: [
      "Built four Three.js battlefields with camera-projected controls, lighting, textured cards, and an authored Moonroot courtyard with high/low-detail GLB assets.",
      "Implemented direct card dragging onto legal targets alongside tap and keyboard controls, reduced motion, and a playable fallback when WebGL is unavailable.",
      "Created a deterministic TypeScript rules engine and view-limited bots, with server-validated actions, revision checks, command receipts, and resumable PostgreSQL match state.",
      "Connected hero selection, deck building, tutorials, and skirmishes to a versioned catalog of 20 playable heroes and 72 cards, including 12 earnable event units.",
    ],
    challenge:
      "Make a dimensional card battlefield readable and interactive across desktop and phone screens while keeping rules, hidden information, and recoverable match state authoritative on the server.",
    approach:
      "Separate the pure rules engine and bot from the Next.js presentation layer. A shared Three.js camera projection aligns rendered cards with semantic controls and drag targets, while GSAP presents visible game events. Fastify validates commands and persists checkpoints and receipts in PostgreSQL, allowing the client to recover without replaying an uncertain action.",
    architecture: [
      "Next.js and React client with semantic match controls and a lazy-loaded Three.js renderer",
      "Four 3D arenas, GLB asset loading, quality presets, and WebGL recovery with a playable fallback",
      "GSAP event presentation with pause, skip, cleanup, and reduced-motion support",
      "Pure TypeScript rules engine, deterministic bots, and versioned content packages",
      "Fastify API with server-side legality checks, revision control, and idempotent command receipts",
      "Neon PostgreSQL persistence with Drizzle, durable match checkpoints, and action journals",
      "Vercel-hosted web/API profile and a separate Docker Compose self-hosting profile",
      "Vitest engine and integration suites plus Playwright interaction and responsive checks",
    ],
    gallery: [
      { src: "/images/projects/oathfront-main.webp", alt: "OathFront homepage with the Five Lanes, One Oath headline and illustrated hero roster", width: 1440, height: 900 },
      { src: "/images/projects/oathfront-battlefield.webp", alt: "OathFront Three.js Moonroot courtyard battlefield with five lanes, hero HUDs, and a fanned card hand", width: 1440, height: 900 },
      { src: "/images/projects/oathfront-mobile.webp", alt: "OathFront portrait mobile battle interface with five lanes, hand cards, and accessible match controls", width: 375, height: 812 },
    ],
    accent: "violet",
    liveUrls: [{ label: "OathFront", href: "https://oathfront.vercel.app/" }],
    repositoryUrls: [{ label: "Game repository", href: "https://github.com/dattk2002/oath-front-tcg" }],
    featured: false,
  },
  {
    slug: "panda",
    name: "Panda POS & Manager",
    period: "2024 & 2026",
    context: "Client production",
    summary:
      "A multi-tenant POS and F&B management platform connecting restaurant ordering, reservations, kitchen operations, billing, and payments.",
    ownership: "Contributed React/TypeScript reservation, payment, printing, reporting, and administration workflows, plus NestJS/TypeORM finance and management APIs at DAN SOLUTIONS. Backend contributions in 2024 and frontend work in 2026 belong to the same product.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Ant Design",
      "NestJS",
      "TypeORM",
      "PostgreSQL",
      "REST API",
      "Swagger",
      "reCAPTCHA",
    ],
    outcomes: [
      "Built online reservations with menu preorders, multilingual forms, reCAPTCHA, confirmation flows, and tenant-specific booking settings.",
      "Implemented item-level partial payments and invoice reprinting with grouped line items and post-checkout printing.",
      "Developed revenue reports with date-range filters, hourly charts, and Excel exports.",
      "Fixed filtering and pagination across inventory, supplier, customer, and admin screens, and memoized POS order rows.",
      "Developed validated, Swagger-documented APIs for receipts, payroll, partners, debts, and assets; added income/expense/debt reports, date-range queries, and cash-balance reconciliation.",
      "Added batch monthly staff-attendance creation, partner API pagination/search/filtering, and authenticated access to receivable-debt records.",
    ],
    challenge: "Support restaurant booking, checkout, and administrative finance workflows with consistent validation, filtering, and access boundaries in an existing production product.",
    approach: "Extended the existing React application and NestJS/TypeORM services with tenant-specific reservation settings, item-level payment handling, and grouped invoice printing. Added searchable administrative APIs and date-based financial reports, with validated DTOs, documented contracts, and authenticated debt access.",
    architecture: [
      "React/TypeScript web application with Vite and Ant Design",
      "Multilingual reservation forms with preorders, reCAPTCHA, and tenant-specific settings",
      "Item-level partial payments and grouped invoice reprinting",
      "NestJS/TypeORM APIs with validated DTOs and Swagger documentation",
      "PostgreSQL-backed receipts, payroll, partners, debts, assets, and financial reports",
      "Date-range revenue queries, hourly charts, Excel exports, and administrative filtering",
    ],
    gallery: [
      { src: "/images/projects/panda-pos.webp", alt: "Panda iPad POS menu, order, and payment interface published on the product website", width: 1600, height: 1112 },
      { src: "/images/projects/panda-kitchen.webp", alt: "Panda iPad kitchen display with orders grouped by table, published on the product website", width: 1600, height: 1112 },
    ],
    accent: "lime",
    liveUrls: [
      { label: "Panda", href: "https://panda.vn/" },
      { label: "Web app", href: "https://app.panda.vn/" },
    ],
    featured: false,
  },
  {
    slug: "fastcare",
    name: "Fastcare",
    period: "Dec 2023 – Mar 2024",
    context: "Client production",
    summary:
      "A multi-category repair-booking and commerce platform spanning customer journeys, content, accessories, and operational administration.",
    ownership: "Contributed Next.js/TypeScript customer interfaces during the DAN SOLUTIONS internship: promotions, repair booking, shared navigation, responsive layouts, and Sentry instrumentation.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "React Hook Form",
      "Zod",
      "REST API",
      "reCAPTCHA",
      "Sentry",
    ],
    outcomes: [
      "Built a responsive promotion page with API-backed product/service listings and load-more navigation.",
      "Implemented repair booking with React Hook Form/Zod validation, store and appointment selection, API submission, and confirmation views; added client-side reCAPTCHA widgets and submission gating to booking/comment forms.",
      "Refactored multilevel service navigation into a shared homepage/header mega menu with API-driven categories and reusable TypeScript interfaces; updated responsive layouts and typography across product, service, blog, promotion, and static pages.",
      "Added Sentry error reporting and tracing across Next.js client/server/edge configurations, plus client-side session replay and browser profiling.",
    ],
    challenge: "Keep repair discovery and booking understandable across service categories and screen sizes while making form states and production failures easier to inspect.",
    approach: "Used shared navigation and typed API data to connect service discovery to validated booking and confirmation flows. Responsive Tailwind layouts support the customer pages, client-side reCAPTCHA gates form submission, and Sentry captures errors and performance traces across the Next.js runtime surfaces.",
    architecture: [
      "Next.js/React customer interfaces with TypeScript and Tailwind CSS",
      "API-backed promotion, product, and service listings with load-more navigation",
      "React Hook Form and Zod booking validation with store/appointment selection",
      "Client-side reCAPTCHA widgets and submission gating for booking/comment forms",
      "Shared API-driven homepage/header mega menu",
      "Sentry client/server/edge error reporting and tracing, session replay, and browser profiling",
    ],
    gallery: [
      { src: "/images/projects/fastcare-main.webp", alt: "Fastcare desktop repair and accessory homepage", width: 1440, height: 900 },
    ],
    accent: "amber",
    liveUrls: [{ label: "Fastcare", href: "https://fastcare.vn/" }],
    featured: false,
  },
  {
    slug: "habistride",
    name: "HabiStride",
    period: "May 2026 – Jun 2026",
    context: "Independent product",
    summary:
      "A gamified habit tracker where a virtual tree grows through completed habits, streaks, and milestone rewards.",
    ownership:
      "Architected independently deployable Next.js and NestJS services, authentication, scheduled history snapshots, and PostgreSQL data models.",
    technologies: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "TypeORM",
      "shadcn/ui",
      "Tailwind CSS",
      "Docker",
    ],
    outcomes: [
      "Built 24 REST handlers across seven controllers.",
      "Modelled ten PostgreSQL entities with TypeORM.",
      "Scheduled daily snapshots at 00:00 Asia/Bangkok.",
      "Delivered eight App Router pages and 22 reusable UI components for tracking, analytics, settings, and authentication.",
    ],
    challenge:
      "Turn daily repetition into visible progress while preserving a reliable history across time zones and independently deployable services.",
    approach:
      "Habit completion, streaks, milestones, and Virtual Tree growth are modelled as connected product flows. Scheduled snapshots preserve each day before the next cycle begins in Asia/Bangkok.",
    architecture: [
      "Next.js App Router dashboard",
      "NestJS API with seven controllers",
      "PostgreSQL and ten TypeORM entities",
      "Google OAuth2 and JWT in HttpOnly cookies",
    ],
    gallery: [
      { src: "/images/projects/habistride-main.webp", alt: "HabiStride desktop sign-in interface", width: 1440, height: 900 },
    ],
    accent: "blue",
    liveUrls: [{ label: "HabiStride", href: "https://habi-stride-ui.onrender.com" }],
    repositoryUrls: [
      { label: "UI repository", href: "https://github.com/dattk2002/habi-stride-ui" },
      { label: "API repository", href: "https://github.com/dattk2002/habi-stride-api" },
    ],
    featured: false,
  },
  {
    slug: "ngoaingungay",
    name: "NgoaiNguNgay",
    period: "May 2024 – Sep 2024",
    context: "Capstone product",
    summary:
      "A role-aware language-learning and tutor-booking platform with real-time one-to-one messaging and scheduling workflows.",
    ownership:
      "Built learner, tutor, staff, and manager interfaces and integrated resilient SignalR messaging into the React client.",
    technologies: ["React", "Vite", "SignalR", "Redis", "TypeScript"],
    outcomes: [
      "Implemented message receipt, editing, deletion, unread state, and reconnection.",
      "Delivered booking, offer, cancellation, and status-aware scheduling flows.",
      "Structured 16 routed pages and 79 component files.",
    ],
    challenge:
      "Keep booking state and one-to-one conversation state clear across four roles while handling connection loss and schedule changes.",
    approach:
      "Role-specific surfaces share a consistent component model. SignalR events update messages and unread state with automatic reconnection, while bookings remain explicit and status-aware.",
    architecture: [
      "React and Vite client",
      "Sixteen routed product pages",
      "SignalR events with Redis pub/sub",
      "Role-aware learner, tutor, staff, and manager flows",
    ],
    gallery: [
      { src: "/images/projects/ngoaingungay-main.webp", alt: "NgoaiNguNgay desktop landing page", width: 1440, height: 900 },
      { src: "/images/projects/ngoaingungay-banner.webp", alt: "NgoaiNguNgay language learning illustration", width: 840, height: 543 },
    ],
    accent: "amber",
    liveUrls: [{ label: "NgoaiNguNgay", href: "https://ngoai-ngu-ngay.vercel.app" }],
    repositoryUrls: [
      { label: "Frontend repository", href: "https://github.com/dattk2002/NgoaiNguNgay_FE" },
    ],
    featured: false,
  },
  {
    slug: "trivia-quiz",
    name: "Trivia Quiz",
    period: "Apr 2026 – May 2026",
    context: "Independent product",
    summary:
      "A full-stack trivia application with session-based gameplay and a custom question-bank API.",
    ownership:
      "Independently owned the architecture, API design, containerization, and Render deployment pipeline.",
    technologies: ["Next.js", "MongoDB", "Mongoose", "Docker", "Render"],
    outcomes: [
      "Implemented seven API handlers across five route files.",
      "Added a one-hour TTL index for automatic quiz-session cleanup.",
      "Validated answers server-side and prevented duplicate scoring.",
    ],
    challenge:
      "Run session-based quizzes without leaking correct answers to the client or allowing repeated submissions to inflate a score.",
    approach:
      "The initial payload omits answers, every submission is validated server-side, and short-lived MongoDB sessions expire automatically through a TTL index.",
    architecture: [
      "Next.js application and route handlers",
      "MongoDB with two Mongoose models",
      "Server-owned quiz session state",
      "Docker deployment on Render",
    ],
    gallery: [
      { src: "/images/projects/trivia-quiz-main.webp", alt: "Trivia Quiz desktop setup interface", width: 1440, height: 900 },
    ],
    accent: "violet",
    liveUrls: [{ label: "Trivia Quiz", href: "https://trivia-app-elb2.onrender.com" }],
    featured: false,
  },
  {
    slug: "tapmood",
    name: "TapMood",
    period: "Jun 2026 – Jul 2026",
    context: "Independent product",
    summary:
      "A cross-platform social check-in product with real-time communication, media processing, privacy, and moderation workflows.",
    ownership:
      "Independently architected and delivered the Flutter client, ASP.NET Core API, data model, real-time flows, background processing, and deployment foundation.",
    technologies: [
      "Flutter",
      "ASP.NET Core 10",
      "PostgreSQL",
      "SignalR",
      "Cloudinary",
      "FFmpeg",
      "Firebase",
      "Gemini",
      "Docker",
    ],
    outcomes: [
      "Designed 117 REST endpoint mappings across the product domain.",
      "Engineered resumable, SHA-256 verified video uploads up to 250 MB.",
      "Delivered 92 automated test declarations across the client and API.",
    ],
    challenge:
      "Coordinate media-heavy social interactions, privacy rules, real-time state, and multi-platform behavior without splitting the product into inconsistent experiences.",
    approach:
      "Shared domain services keep authorization, privacy, moderation, notifications, and presence consistent. Resumable uploads verify SHA-256 chunks before background H.264 processing, while SignalR reports progress. Google/OTP authentication, session rotation, export, retention, and audit logging support account and data lifecycle flows.",
    architecture: [
      "Flutter clients across six platforms with Gemini AI features",
      "ASP.NET Core REST API and authenticated SignalR hub",
      "PostgreSQL with EF Core across 38 entity sets",
      "Six hosted workers for media, retention, push, and reminders",
    ],
    gallery: [
      { src: "/images/projects/tapmood-main.webp", alt: "TapMood desktop sign-in interface", width: 1440, height: 900 },
      { src: "/images/projects/tapmood-pulse.webp", alt: "TapMood Pulse mobile interface", width: 390, height: 1300 },
      { src: "/images/projects/tapmood-moments.webp", alt: "TapMood Moments desktop interface", width: 1024, height: 900 },
      { src: "/images/projects/tapmood-auth.webp", alt: "TapMood authentication mobile interface", width: 390, height: 1180 },
    ],
    accent: "lime",
    repositoryUrls: [
      { label: "UI repository", href: "https://github.com/dattk2002/tap-mood-ui" },
      { label: "API repository", href: "https://github.com/dattk2002/tap-mood-api" },
    ],
    featured: false,
  },
  {
    slug: "caocao-adventures",
    name: "Caocao Adventures",
    period: "Nov 2025 – Jan 2026",
    context: "Client production",
    summary:
      "A production travel platform for discovering guided cycling tours, renting bikes, and exploring destination-led editorial content.",
    ownership: "Developed bilingual CMS localization, configurable content blocks, locale-aware article previews, and reusable responsive components at DAN SOLUTIONS.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "REST API",
      "CMS localization",
      "Responsive Web",
    ],
    outcomes: [
      "Developed English/Vietnamese CMS page-localization workflows with locale validation, slug checks, and localized content blocks.",
      "Added configurable FAQ/contact blocks for editor-managed questions, answers, and links.",
      "Integrated locale-aware latest-article retrieval and blog previews using Next.js image/link components.",
      "Refactored reusable footers and improved responsive navigation, custom-tour sections, and blog-image layouts.",
    ],
    challenge: "Let editors manage bilingual travel content while keeping locale-specific pages, navigation, and article previews consistent across screen sizes.",
    approach: "Validated locales and slugs in CMS workflows, exposed FAQ/contact content through configurable blocks, and retrieved recent articles for the active locale. Shared footer components and responsive navigation and image layouts keep localized pages coherent.",
    architecture: [
      "Next.js/React and TypeScript interfaces",
      "English/Vietnamese CMS page localization with locale and slug validation",
      "Configurable FAQ and contact content blocks",
      "Locale-aware latest-article retrieval and Next.js image/link previews",
      "Reusable footers and responsive navigation, tour sections, and blog images",
    ],
    gallery: [
      { src: "/images/projects/caocao-adventures-main.webp", alt: "Caocao Adventures desktop cycling tour homepage", width: 1440, height: 900 },
    ],
    accent: "lime",
    liveUrls: [{ label: "Caocao Adventures", href: "https://www.caocaoadventures.com" }],
    repositoryUrls: [
      { label: "UI repository", href: "https://github.com/tungvt2003/caocaoadventures" },
    ],
    featured: false,
  },
  {
    slug: "tamda",
    name: "TamdaCMS / TamdaOne",
    period: "Oct 2025 – May 2026",
    context: "Client production",
    summary:
      "A shared publishing foundation for corporate, media, and admin experiences across multiple business verticals.",
    ownership: "Built API-backed CMS modules, permission-aware administration and editorial workflows, Puck page-builder blocks, product integrations, and server-rendered public navigation at DAN SOLUTIONS.",
    technologies: [
      "Next.js App Router",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Strapi",
      "Zustand",
      "Puck",
      "REST API",
    ],
    outcomes: [
      "Built CMS modules for customers, campaigns, subscribers, contact submissions, and recruitment candidates, with validated forms, searchable tables, pagination, duplication, and bulk actions.",
      "Implemented role-management screens and shared Zustand permission state for navigation, action visibility, and access-denied guards.",
      "Created responsive Puck blocks for timelines, team profiles, carousels, notifications, registration, services, and FAQs.",
      "Integrated EAN-selected TamdaExpress products into TamdaFoods with prices, stock, pack sizes, product links, and loading/error states.",
      "Refactored Tamda Media/TamdaOne headers and footers into Next.js server components that load locale-specific CMS menus, banners, and settings while retaining interactive navigation.",
      "Implemented editorial submission, approval, rejection, publishing, and scheduling, including own-post access, rejection reasons, and review timestamps.",
    ],
    challenge: "Give editors and administrators usable, permission-aware workflows across related brands while sharing page-building and locale-specific navigation foundations.",
    approach: "Connected validated administrative forms and searchable tables to CMS APIs, shared permission state through Zustand, and built configurable Puck blocks for public pages. Server components load locale-specific navigation data, while editorial actions preserve access rules, rejection context, and review history.",
    architecture: [
      "Next.js App Router public sites with server-rendered CMS headers and footers",
      "React/TypeScript administrative modules with validated forms and searchable, paginated tables",
      "Shared Zustand permission state for navigation, actions, and access-denied guards",
      "Responsive Puck page-builder blocks",
      "EAN-selected product integration across TamdaExpress and TamdaFoods",
      "Permission-aware editorial approval, rejection, publishing, and scheduling",
    ],
    gallery: [
      { src: "/images/projects/tamda-group-main.webp", alt: "Tamda Group corporate desktop homepage", width: 1440, height: 900 },
      { src: "/images/projects/tamda-media-main.webp", alt: "Tamda Media desktop news homepage", width: 1440, height: 900 },
    ],
    accent: "blue",
    liveUrls: [
      { label: "Tamda Media", href: "https://tamdamedia.eu" },
      { label: "Tamda Group", href: "https://tamdagroup.eu" },
      { label: "Tamda Express", href: "https://tamdaexpress.eu" },
      { label: "Tamda OC", href: "https://tamdaoc.eu" },
    ],
    repositoryUrls: [
      { label: "UI repository", href: "https://github.com/tungvt2003/tamdamedia" },
    ],
    featured: false,
  },
  {
    slug: "vncaps",
    name: "VNCaps",
    period: "May 2024 – Aug 2024",
    context: "Client production",
    summary:
      "A cross-platform school-management dashboard for student, teacher, and administrator workflows.",
    ownership: "Contributed Expo/React Native upgrades, school assessment and reporting interfaces, React administration workflows, and photo/API compatibility fixes at DAN SOLUTIONS.",
    technologies: [
      "React Native",
      "Expo",
      "React",
      "TypeScript",
      "REST API",
      "FlatList",
      "Node.js",
      "Sharp",
      "Docker",
      "MongoDB",
      "Mongoose",
    ],
    outcomes: [
      "Upgraded Expo SDK 47 to 49 and React Native 0.70.8 to 0.72.10, updating platform dependencies and adapting navigation and legacy components.",
      "Implemented swimming/music assessment reports with student-specific APIs, skill ratings, lesson objectives, comments, and pagination; extended daily/monthly report calendars to browse six months of prior data.",
      "Built React admin workflows for selective and bulk swimming/music skill entry, duplicate filtering, removal controls, and empty-state dialogs.",
      "Refactored photo galleries with FlatList and Expo-compatible images; adapted photo APIs and thumbnail processing for legacy Node.js with Docker/Sharp alignment, string-method fixes, and MongoDB connection handling via Mongoose.",
    ],
    challenge: "Maintain a cross-platform school product through framework upgrades while extending assessment/report workflows and preserving photo compatibility with an older backend runtime.",
    approach: "Updated Expo, React Native, dependencies, and navigation together, then extended student-specific reports and historical calendars. Added administrative bulk-entry and duplicate-handling states, and aligned gallery rendering and thumbnail APIs with the supported Expo and Node.js environments.",
    architecture: [
      "Expo 49 and React Native 0.72.10 client, upgraded from Expo 47 and React Native 0.70.8",
      "Student-specific assessment/report APIs, ratings, objectives, comments, and pagination",
      "Daily/monthly report calendars with six months of browsing history",
      "React administration for individual and bulk skill entry",
      "FlatList galleries and Expo-compatible image components",
      "Legacy Node.js photo APIs with Docker/Sharp and MongoDB/Mongoose compatibility fixes",
    ],
    gallery: [
      { src: "/images/projects/vncaps-home.webp", alt: "VNCaps parent home dashboard with school modules", width: 237, height: 512 },
      { src: "/images/projects/vncaps-health.webp", alt: "VNCaps student health and daily activity screen", width: 237, height: 512 },
      { src: "/images/projects/vncaps-login.webp", alt: "VNCaps parent login screen", width: 237, height: 512 },
      { src: "/images/projects/vncaps-splash.webp", alt: "VNCaps application launch screen", width: 237, height: 512 },
    ],
    accent: "violet",
    liveUrls: [
      { label: "VNCaps", href: "https://www.vncaps.edu.vn/" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.edu.vncaps&hl=en&pli=1" },
    ],
    featured: false,
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
