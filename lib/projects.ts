export type ProjectSlug =
  | "bravodemy"
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
  context: "Independent product" | "Capstone product" | "Client production";
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
    context: "Independent product",
    summary:
      "An AI microlearning platform that turns natural-language goals into source-grounded syllabi and lesson cores, followed by 5–10 minute lessons, practice, spaced review, and progress tracking.",
    ownership:
      "Owned most of the architecture and end-to-end delivery across AI research and generation, the bilingual Next.js client, FastAPI services, data models, automated quality checks, and cloud deployment.",
    technologies: [
      "Next.js 16", "React 19", "TypeScript", "Python", "FastAPI", "SQLAlchemy",
      "PostgreSQL", "Redis", "Gemini grounded search", "Exa", "Tavily", "Langfuse",
      "Tailwind CSS", "Radix UI", "Recharts", "GSAP", "Polar", "Docker", "Render",
      "Neon", "GitHub Actions", "Pytest", "Vitest", "Playwright",
    ],
    outcomes: [
      "Built 107 FastAPI endpoints and 35 SQLAlchemy models across generation, learning, authentication, admin, privacy, and entitlements.",
      "Integrated Gemini grounded search, Exa, and Tavily for source context, with Langfuse tracing for AI generation workflows.",
      "Verified 192 backend tests at 85.11% coverage and 151 frontend tests.",
      "Established CI for PostgreSQL 16, builds, accessibility, and responsive journeys across Chromium, Firefox, and WebKit.",
      "Delivered a bilingual UI with light/dark themes and WCAG 2.2 AA checks.",
    ],
    challenge:
      "Translate open-ended learning goals into research-backed content across technical and non-technical domains while keeping generation observable, practice grading deterministic, and access secure.",
    approach:
      "Research providers supply source context before syllabus and lesson-core generation, and Langfuse traces the AI workflows. Python/SQL grading supports deterministic practice, while secure cookies, Polar entitlements, and Redis caching, rate limits, and distributed locks support the learning journey.",
    architecture: [
      "Bilingual Next.js 16 and React 19 UI with Tailwind CSS, Radix UI, Recharts, and GSAP",
      "FastAPI with 107 endpoints, 35 SQLAlchemy models, and deterministic Python/SQL grading",
      "Gemini grounded search, Exa, and Tavily research with Langfuse workflow tracing",
      "Neon PostgreSQL pooled runtime and direct migration connections, plus fail-open Redis caching",
      "Independent UI/API services on Render Singapore with health-gated auto-deploys",
      "GitHub Actions CI with Pytest, Vitest, Playwright, accessibility, and responsive checks",
    ],
    gallery: [
      { src: "/images/projects/bravodemy-main.webp", alt: "Bravodemy AI microlearning landing page", width: 1440, height: 900 },
    ],
    accent: "blue",
    liveUrls: [{ label: "Bravodemy", href: "https://bravodemy.com" }],
    repositoryUrls: [{ label: "Product repository", href: "https://github.com/tkhieu/AIMicroLearningPlatform" }],
    featured: true,
  },
  {
    slug: "panda",
    name: "Panda",
    period: "Feb 2026 – May 2026",
    context: "Client production",
    summary:
      "A multi-tenant POS and F&B management platform connecting restaurant ordering, reservations, kitchen operations, billing, and payments.",
    ownership:
      "Worked as a Full-stack Engineer at Dan Solutions in a five-person team, extending the existing web app across frontend screens and backend APIs. Owned receipt printing, takeaway ordering, advance reservations, and payment modules.",
    technologies: ["React", "TypeScript", "Vite", "Ant Design", "PostgreSQL", "Strapi", "REST API"],
    outcomes: [
      "Implemented 13 API endpoints and four React/TypeScript screens: receipt printing, reservation forms, reservation lists, and payments. Delivered these features into the existing production application.",
      "Built session-based reservation forms and connected booking submissions to backend services and administrative reservation lists. Extended takeaway ordering, bill splitting, payments, and kitchen-screen workflows for restaurant operations.",
      "Supported a senior engineer on tenant-aware permissions and tenant switching in a PostgreSQL architecture with separate databases and schemas, connecting users to their authorized restaurant environments.",
      "Refactored reservation and receipt forms from development into main through code review, contributed CI configuration updates, and resolved production bugs reported by Czech restaurant customers.",
    ],
    challenge:
      "Extend a live restaurant platform where bookings, orders, kitchen screens, and billing need to work together, while preserving permissions and tenant context across separate restaurant environments.",
    approach:
      "Delivered the assigned modules across the React administration app and backend APIs. Session-based booking forms fed the reservation list, while receipt, split-bill, payment, and kitchen changes connected operational workflows. Tenant permissions and switching were implemented alongside a senior engineer, with code review and customer bug fixes supporting release.",
    architecture: [
      "React and TypeScript web administration app built with Vite and Ant Design",
      "13 contributed API endpoints connecting reservations, ordering, billing, and payments",
      "PostgreSQL multi-tenant foundation with separate databases and schemas",
      "Tenant-aware permissions and switching developed alongside a senior engineer",
      "Existing Strapi headless CMS maintained by the senior engineer",
      "Code-review and CI contributions supporting development-to-main releases",
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
    period: "Dec 2023 – Aug 2024",
    context: "Client production",
    summary:
      "A multi-category repair-booking and commerce platform spanning customer journeys, content, accessories, and operational administration.",
    ownership:
      "Owned frontend delivery from component design through production deployment, then complemented the customer platform with PHP Laravel admin workflows.",
    technologies: ["Next.js", "TypeScript", "Ant Design", "shadcn/ui", "PHP", "Laravel"],
    outcomes: [
      "Delivered Fastcare UI v2 across more than 20 screens.",
      "Standardized API integration and component patterns across the frontend.",
      "Created shared loading, empty, and error states for booking and catalog journeys.",
    ],
    challenge:
      "Keep repair discovery and booking understandable across many device categories while supporting content, accessories, and day-to-day operational management.",
    approach:
      "Reusable component systems and consistent API-state patterns made customer journeys predictable. A dedicated Laravel admin surface supported content and operational workflows behind the public product.",
    architecture: [
      "Next.js and TypeScript customer experience",
      "Ant Design and shadcn/ui component systems",
      "API-backed booking, catalog, and content journeys",
      "PHP Laravel administration workflows",
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
    period: "May 2025 – Sep 2025",
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
    ownership:
      "Led frontend architecture and delivered the tour browsing, rental, and blog modules to production within two months.",
    technologies: ["React", "TypeScript", "Ant Design", "REST API", "Responsive Web"],
    outcomes: [
      "Shipped three core product modules to production within two months.",
      "Built reusable layouts, forms, and data-display components.",
      "Integrated responsive, API-driven booking and content flows.",
    ],
    challenge:
      "Present media-rich travel stories and structured tour data without losing clarity across browsing, rental, and booking journeys.",
    approach:
      "A reusable React component foundation aligned forms, content, and data states while responsive layouts kept the core exploration journeys coherent across desktop and mobile.",
    architecture: [
      "React and TypeScript frontend",
      "Ant Design component foundation",
      "API-driven tours, rentals, and editorial content",
      "Responsive booking and discovery flows",
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
    ownership:
      "Owned delivery from Figma handoff through production, building reusable public-site modules, administration experiences, and CMS-backed editorial workflows.",
    technologies: [
      "Next.js App Router",
      "TypeScript",
      "Tailwind CSS",
      "Strapi",
      "Express",
      "REST API",
      "Swagger",
    ],
    outcomes: [
      "Delivered ten production features across public websites and admin dashboards.",
      "Supported five business verticals through reusable content patterns.",
      "Designed and configured more than 12 Strapi content schemas.",
    ],
    challenge:
      "Give editors autonomy across distinct corporate and media products while keeping layouts, APIs, and administrative workflows maintainable.",
    approach:
      "Reusable App Router modules consumed structured Strapi content through documented APIs. Shared layout and administration patterns reduced duplication while preserving the needs of each vertical.",
    architecture: [
      "Next.js App Router public experiences",
      "TypeScript and Tailwind CSS interface system",
      "Strapi CMS with 12+ structured content schemas",
      "Express middleware and Swagger-documented REST APIs",
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
    period: "Dec 2023 – Aug 2024",
    context: "Client production",
    summary:
      "A cross-platform school-management dashboard for student, teacher, and administrator workflows.",
    ownership:
      "Architected the role-aware application across more than 15 screens, including timetable rendering and push-notification delivery.",
    technologies: ["React Native", "Expo", "TypeScript", "Expo Notifications", "Role-based access"],
    outcomes: [
      "Delivered more than 15 role-aware application screens.",
      "Supported student, teacher, and administrator workflows.",
      "Integrated push alerts and dynamic timetable rendering.",
    ],
    challenge:
      "Make schedules, progress, and school updates usable across three roles without turning the application into separate, inconsistent products.",
    approach:
      "A shared cross-platform component model adapted navigation and content by role. Dynamic timetable rendering and Expo Notifications kept time-sensitive school information visible.",
    architecture: [
      "React Native and Expo client",
      "TypeScript application modules",
      "Role-based student, teacher, and administrator surfaces",
      "Expo Notifications and dynamic timetable flows",
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
