export type Experience = {
  organization: string;
  period: string;
  projects: readonly string[];
  summary: string;
};

export const experiences: readonly Experience[] = [
  {
    organization: "Dan Solutions",
    period: "Oct 2025 – May 2026",
    projects: ["TamdaCMS / TamdaOne", "Caocao Adventures"],
    summary:
      "Delivered production websites and admin experiences across CMS, media, tours, rentals, and editorial workflows.",
  },
  {
    organization: "Capstone Project",
    period: "May 2025 – Sep 2025",
    projects: ["NgoaiNguNgay"],
    summary:
      "Built real-time messaging, role-specific product surfaces, and end-to-end tutor-booking journeys.",
  },
  {
    organization: "Dan Solutions",
    period: "Dec 2023 – Aug 2024",
    projects: ["Fastcare", "VNCaps"],
    summary:
      "Owned frontend delivery for repair booking and built role-aware cross-platform education dashboards.",
  },
  {
    organization: "FPT Software Internship",
    period: "Dec 2022 – Apr 2023",
    projects: ["LMS FSoft Education Management"],
    summary:
      "Contributed modular scheduling and training-progress experiences to an Angular learning platform.",
  },
] as const;
