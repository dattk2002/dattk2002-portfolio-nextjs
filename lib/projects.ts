export type ProjectSlug =
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
  gallery: readonly { src: string; alt: string }[];
  accent: "lime" | "blue" | "amber" | "violet";
  liveUrls?: readonly { label: string; href: string }[];
  repositoryUrls?: readonly { label: string; href: string }[];
  featured: boolean;
};

export const projects: readonly Project[] = [
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
      { src: "/images/projects/fastcare-main.webp", alt: "Fastcare desktop repair and accessory homepage" },
    ],
    accent: "amber",
    liveUrls: [{ label: "Fastcare", href: "https://fastcare.vn/" }],
    featured: true,
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
      { src: "/images/projects/habistride-main.webp", alt: "HabiStride desktop sign-in interface" },
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
      { src: "/images/projects/ngoaingungay-main.webp", alt: "NgoaiNguNgay desktop landing page" },
      { src: "/images/projects/ngoaingungay-banner.webp", alt: "NgoaiNguNgay language learning illustration" },
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
      { src: "/images/projects/trivia-quiz-main.webp", alt: "Trivia Quiz desktop setup interface" },
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
      "Shared domain services keep authorization, privacy, moderation, notifications, and presence consistent. Long-running media work moves to hosted workers while SignalR reports progress back to the client.",
    architecture: [
      "Flutter clients across six platforms",
      "ASP.NET Core REST API and authenticated SignalR hub",
      "PostgreSQL with EF Core across 38 entity sets",
      "Six hosted workers for media, retention, push, and reminders",
    ],
    gallery: [
      { src: "/images/projects/tapmood-main.webp", alt: "TapMood desktop sign-in interface" },
      { src: "/images/projects/tapmood-pulse.webp", alt: "TapMood Pulse mobile interface" },
      { src: "/images/projects/tapmood-moments.webp", alt: "TapMood Moments desktop interface" },
      { src: "/images/projects/tapmood-auth.webp", alt: "TapMood authentication mobile interface" },
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
    period: "2025",
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
      { src: "/images/projects/caocao-adventures-main.webp", alt: "Caocao Adventures desktop cycling tour homepage" },
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
      { src: "/images/projects/tamda-group-main.webp", alt: "Tamda Group corporate desktop homepage" },
      { src: "/images/projects/tamda-media-main.webp", alt: "Tamda Media desktop news homepage" },
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
      { src: "/images/projects/vncaps-home.webp", alt: "VNCaps parent home dashboard with school modules" },
      { src: "/images/projects/vncaps-health.webp", alt: "VNCaps student health and daily activity screen" },
      { src: "/images/projects/vncaps-login.webp", alt: "VNCaps parent login screen" },
      { src: "/images/projects/vncaps-splash.webp", alt: "VNCaps application launch screen" },
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
