import type { ProjectSlug } from "@/lib/projects";

export type ExperienceProjectReference = {
  slug: ProjectSlug;
};

export type ExperienceProjectDetail = {
  id: string;
  name: string;
  period: string;
  description: readonly string[];
  ownership: string;
  outcomes: readonly string[];
  technologies: readonly string[];
  repositoryUrls?: readonly { label: string; href: string }[];
};

export type ExperienceProject = ExperienceProjectReference | ExperienceProjectDetail;

export type Experience = {
  organization: string;
  period: string;
  projects: readonly ExperienceProject[];
};

export const experiences: readonly Experience[] = [
  {
    organization: "Independent Product Development",
    period: "Jun 2026 – Jul 2026",
    projects: [{ slug: "tapmood" }],
  },
  {
    organization: "Independent Product Development",
    period: "May 2026 – Jun 2026",
    projects: [{ slug: "habistride" }],
  },
  {
    organization: "Independent Product Development",
    period: "Apr 2026 – May 2026",
    projects: [{ slug: "trivia-quiz" }],
  },
  {
    organization: "Dan Solutions",
    period: "Oct 2025 – May 2026",
    projects: [{ slug: "tamda" }, { slug: "caocao-adventures" }],
  },
  {
    organization: "Capstone Project",
    period: "May 2025 – Sep 2025",
    projects: [{ slug: "ngoaingungay" }],
  },
  {
    organization: "Dan Solutions",
    period: "Dec 2023 – Aug 2024",
    projects: [{ slug: "fastcare" }, { slug: "vncaps" }],
  },
  {
    organization: "FPT Software Internship",
    period: "Dec 2022 – Apr 2023",
    projects: [
      {
        id: "lms-fsoft",
        name: "LMS FSoft Education Management",
        period: "Feb 2023 – Apr 2023",
        description: [
          "A desktop education-management application created during the Spring 2023 FPT Software internship to help Fresher Academy operations teams organize classes, syllabi, training programs, schedules, and reporting.",
          "The Angular interface supported role-aware workflows for super administrators, class administrators, and trainees, backed by a broader .NET and Microsoft SQL Server system.",
        ],
        ownership:
          "Worked as a frontend developer in a six-person team, taking ownership of the class-list, class-detail, and training-calendar experiences from the supplied Figma designs through implementation.",
        outcomes: [
          "Delivered the general class list together with its search and filtering states.",
          "Built the class-detail experience for reviewing structured training information.",
          "Implemented seven assigned calendar and class screen states, including day/week views, filtering, and weekly search.",
        ],
        technologies: ["Angular 15", "TypeScript", "Angular Material", "PrimeNG", "FullCalendar", "Firebase"],
        repositoryUrls: [
          { label: "GitHub repository", href: "https://github.com/dattk2002/lms-fsoft-intern-react" },
        ],
      },
    ],
  },
];
