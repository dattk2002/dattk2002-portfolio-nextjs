"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Code2, ExternalLink } from "lucide-react";

import { ProjectArtwork } from "@/components/project-artwork";
import { projects, type Project, type ProjectSlug } from "@/lib/projects";

function getProject(slug: ProjectSlug) {
  return projects.find((project) => project.slug === slug) ?? projects[0];
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
      <Link href={`/projects/${project.slug}`} className="inline-flex min-h-11 items-center gap-2 font-medium text-accent hover:underline">
        View case study <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
      {project.liveUrls?.map((liveProduct) => (
        <a key={liveProduct.href} href={liveProduct.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-foreground">
          {liveProduct.label} <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      ))}
      {project.repositoryUrls?.map((repository) => (
        <a key={repository.href} href={repository.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-foreground">
          {repository.label} <Code2 className="size-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function FeaturedContent({ project, reduceMotion }: { project: Project; reduceMotion: boolean | null }) {
  return (
    <motion.div
      key={`featured-${project.slug}`}
      className="grid md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-[1.12fr_0.88fr]"
      initial={reduceMotion ? false : { opacity: 0.62 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0.38 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
    >
      <div className="h-80 md:min-h-[52rem] lg:min-h-[46rem] xl:min-h-[43rem]"><ProjectArtwork project={project} priority={project.featured} /></div>
      <div className="flex min-h-[34rem] flex-col p-6 md:p-7 lg:p-8 xl:p-10">
        <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-faint"><span>{project.context}</span><span>{project.period}</span></div>
        <div className="mt-auto pt-10">
          <h3 className="font-display text-5xl leading-[0.92] tracking-[-0.06em] xl:text-6xl">{project.name}</h3>
          <p className="mt-4 max-w-xl leading-7 text-muted">{project.summary}</p>
          <p className="mt-4 border-t border-border pt-4 font-mono text-[10px] uppercase leading-5 tracking-[0.13em] text-steel">{project.ownership}</p>
          <ul className="mt-4 grid gap-3 text-sm text-foreground/82 lg:grid-cols-2">
            {project.outcomes.map((outcome) => <li key={outcome} className="border-t border-border pt-3">{outcome}</li>)}
          </ul>
          <p className="mt-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-faint">{project.technologies.join(" · ")}</p>
          <div className="mt-4"><ProjectLinks project={project} /></div>
        </div>
      </div>
    </motion.div>
  );
}

function CompactContent({ project, highlighted }: { project: Project; highlighted: boolean }) {
  return (
    <div className="flex h-full flex-col p-5 text-left lg:p-6">
      <span className="flex w-full items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] opacity-65">
        <span>{String(projects.findIndex((item) => item.slug === project.slug) + 1).padStart(2, "0")}</span><ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
      <span className="mt-auto pt-10 font-display text-3xl leading-[0.95] tracking-[-0.05em] lg:text-4xl">{project.name}</span>
      <span className="mt-3 line-clamp-2 text-sm leading-6 opacity-75">{project.summary}</span>
      <span className={`mt-5 border-t pt-3 font-mono text-[9px] uppercase leading-4 tracking-[0.12em] opacity-65 ${highlighted ? "border-black/20" : "border-border"}`}>{project.outcomes[0]}</span>
    </div>
  );
}

function visibleCardsForWidth(width: number) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function ProjectShowcase() {
  const [featuredSlug, setFeaturedSlug] = useState<ProjectSlug>(projects[0].slug);
  const [visibleCount, setVisibleCount] = useState(3);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const featuredProject = getProject(featuredSlug);
  const compactProjects = useMemo(() => projects.filter((project) => project.slug !== featuredSlug), [featuredSlug]);
  const pageCount = Math.max(1, Math.ceil(compactProjects.length / visibleCount));

  useEffect(() => {
    const updateVisibleCount = () => {
      const nextCount = visibleCardsForWidth(window.innerWidth);
      setVisibleCount((current) => {
        if (current !== nextCount) setPage(0);
        return nextCount;
      });
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const visibleProjects = Array.from(
    { length: Math.min(visibleCount, compactProjects.length) },
    (_, index) => compactProjects[(page * visibleCount + index) % compactProjects.length],
  );

  const moveToPage = (nextPage: number, nextDirection: number) => {
    setDirection(nextDirection);
    setPage((nextPage + pageCount) % pageCount);
  };

  const featureProject = (slug: ProjectSlug) => {
    setFeaturedSlug(slug);
    setDirection(1);
    setPage(0);
  };

  return (
    <div>
      <p className="sr-only" aria-live="polite">Featured project: {featuredProject.name}</p>
      <article className="overflow-hidden rounded-xl border border-border bg-surface">
        <AnimatePresence mode="wait" initial={false}><FeaturedContent project={featuredProject} reduceMotion={reduceMotion} /></AnimatePresence>
      </article>

      <section className="mt-3" role="region" aria-roledescription="carousel" aria-label="Selected project carousel">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Browse all projects <span aria-hidden="true">·</span> Page {page + 1} of {pageCount}</p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => moveToPage(page - 1, -1)} className="grid size-11 cursor-pointer touch-manipulation place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" aria-label="Previous project cards">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => moveToPage(page + 1, 1)} className="grid size-11 cursor-pointer touch-manipulation place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" aria-label="Next project cards">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${featuredSlug}-${page}-${visibleCount}`}
              className="grid touch-pan-y grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              custom={direction}
              initial={reduceMotion ? false : { opacity: 0.45, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0.3, x: direction * -24 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) moveToPage(page + 1, 1);
                if (info.offset.x > 60) moveToPage(page - 1, -1);
              }}
            >
              {visibleProjects.map((project, slotIndex) => {
                const highlighted = slotIndex === 0;
                return (
                  <article key={project.slug} className={`relative h-64 overflow-hidden rounded-xl border ${highlighted ? "border-accent/40 bg-accent text-accent-foreground" : "border-border bg-surface-raised"}`}>
                    <button type="button" className="h-full w-full cursor-pointer touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent" onClick={() => featureProject(project.slug)} aria-label={`Feature ${project.name}. Currently featuring ${featuredProject.name}.`}>
                      <CompactContent project={project} highlighted={highlighted} />
                    </button>
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex justify-center" aria-label="Carousel pages">
          {Array.from({ length: pageCount }, (_, index) => (
            <button key={index} type="button" className="grid size-11 cursor-pointer touch-manipulation place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={() => moveToPage(index, index >= page ? 1 : -1)} aria-label={`Go to project page ${index + 1}`} aria-current={index === page ? "page" : undefined}>
              <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-200 ${index === page ? "w-7 bg-accent" : "w-1.5 bg-border"}`} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
