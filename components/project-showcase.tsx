"use client";

import { useCallback, useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import Link from "next/link";

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

export function ProjectShowcase() {
  const [featuredSlug, setFeaturedSlug] = useState<ProjectSlug>(projects[0].slug);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const featuredProject = getProject(featuredSlug);
  const [carouselRef, carouselApi] = useEmblaCarousel({
    align: "start",
    dragThreshold: 8,
    duration: reduceMotion ? 0 : 28,
    loop: true,
    slidesToScroll: 1,
  });

  const syncSelection = useCallback((api: EmblaCarouselType) => {
    const nextIndex = api.selectedScrollSnap();
    const nextProject = projects[nextIndex];

    if (!nextProject) return;
    setSelectedIndex(nextIndex);
    setFeaturedSlug(nextProject.slug);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", syncSelection).on("reInit", syncSelection);

    return () => {
      carouselApi.off("select", syncSelection).off("reInit", syncSelection);
    };
  }, [carouselApi, syncSelection]);

  const featureProject = (index: number) => {
    carouselApi?.scrollTo(index);
    setSelectedIndex(index);
    setFeaturedSlug(projects[index].slug);
  };

  return (
    <div>
      <p className="sr-only" aria-live="polite">Featured project: {featuredProject.name}</p>
      <article className="overflow-hidden rounded-xl border border-border bg-surface">
        <AnimatePresence mode="wait" initial={false}><FeaturedContent project={featuredProject} reduceMotion={reduceMotion} /></AnimatePresence>
      </article>

      <section className="mt-3" role="region" aria-roledescription="carousel" aria-label="Selected project carousel">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Drag to explore <span aria-hidden="true">·</span> Project {selectedIndex + 1} of {projects.length}</p>

        <div
          ref={carouselRef}
          className="cursor-grab overflow-hidden focus-visible:rounded-xl active:cursor-grabbing"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              carouselApi?.scrollPrev();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              carouselApi?.scrollNext();
            }
          }}
          aria-label="Drag project cards, or use the left and right arrow keys"
        >
          <div className="flex touch-pan-y gap-3 select-none">
            {projects.map((project, index) => {
              const highlighted = index === selectedIndex;
              return (
                <article key={project.slug} className={`relative h-64 min-w-0 flex-[0_0_100%] overflow-hidden rounded-xl border transition-[border-color,background-color,color] duration-200 sm:flex-[0_0_calc(50%-0.375rem)] lg:flex-[0_0_calc(33.333333%-0.5rem)] ${highlighted ? "border-accent/40 bg-accent text-accent-foreground" : "border-border bg-surface-raised"}`}>
                  <button type="button" className="h-full w-full cursor-pointer touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent" onClick={() => featureProject(index)} aria-label={`Feature ${project.name}. Currently featuring ${featuredProject.name}.`} aria-current={highlighted ? "true" : undefined}>
                    <CompactContent project={project} highlighted={highlighted} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex h-6 items-center justify-center gap-2" aria-hidden="true">
          {projects.map((project, index) => (
            <span key={project.slug} className={`block h-1.5 rounded-full transition-[width,background-color] duration-200 ${index === selectedIndex ? "w-7 bg-accent" : "w-1.5 bg-border"}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
