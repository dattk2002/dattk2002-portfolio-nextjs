"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Code2, ExternalLink, MoveVertical } from "lucide-react";
import Link from "next/link";

import { experiences, type ExperienceProject } from "@/lib/experience";
import { getProject } from "@/lib/projects";

type ProjectLink = { label: string; href: string };

type TimelineProject = {
  id: string;
  name: string;
  period: string;
  context: string;
  description: readonly string[];
  ownership: string;
  outcomes: readonly string[];
  technologies: readonly string[];
  caseStudyHref?: string;
  liveUrls?: readonly ProjectLink[];
  repositoryUrls?: readonly ProjectLink[];
};

function resolveProject(project: ExperienceProject): TimelineProject {
  if ("slug" in project) {
    const source = getProject(project.slug);

    if (!source) throw new Error(`Missing project data for ${project.slug}`);

    return {
      id: source.slug,
      name: source.name,
      period: source.period,
      context: source.context,
      description: [source.summary, source.approach],
      ownership: source.ownership,
      outcomes: source.outcomes,
      technologies: source.technologies,
      caseStudyHref: `/projects/${source.slug}`,
      liveUrls: source.liveUrls,
      repositoryUrls: source.repositoryUrls,
    };
  }

  return {
    ...project,
    context: "Internship team project",
  };
}

function ProjectLinks({ project }: { project: TimelineProject }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {project.caseStudyHref ? (
        <Link href={project.caseStudyHref} className="inline-flex min-h-11 items-center gap-2 font-medium text-accent hover:underline">
          View case study <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
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

function ProjectAccordion({ project, expanded, onToggle }: { project: TimelineProject; expanded: boolean; onToggle: () => void }) {
  const reduceMotion = useReducedMotion();
  const triggerId = `experience-trigger-${project.id}`;
  const panelId = `experience-panel-${project.id}`;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        id={triggerId}
        type="button"
        className="group flex min-h-20 w-full cursor-pointer touch-manipulation items-center justify-between gap-5 py-4 text-left"
        aria-controls={panelId}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span className="min-w-0">
          <span className="block font-display text-2xl tracking-[-0.04em] transition-colors group-hover:text-accent md:text-3xl">{project.name}</span>
          <span className="mt-2 block font-mono text-[9px] uppercase leading-4 tracking-[0.13em] text-faint">{project.context} <span aria-hidden="true">·</span> {project.period}</span>
        </span>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-muted transition-[border-color,color] group-hover:border-accent/50 group-hover:text-accent" aria-hidden="true">
          <ChevronDown className={`size-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="overflow-hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.26, ease: "easeOut" }}
          >
            <div className="pb-8 pt-2">
              <div className="max-w-2xl space-y-3 text-sm leading-6 text-muted lg:text-base lg:leading-7">
                {project.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-steel">Role &amp; ownership</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/82 lg:text-base lg:leading-7">{project.ownership}</p>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-steel">Selected outcomes</p>
                <ul className="mt-3 grid gap-3 text-sm leading-6 text-foreground/82">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome} className="grid grid-cols-[0.5rem_1fr] gap-3 border-t border-border pt-3">
                      <span className="mt-[0.65rem] size-1 rounded-full bg-accent" aria-hidden="true" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-faint">{project.technologies.join(" · ")}</p>
              <div className="mt-3"><ProjectLinks project={project} /></div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ExperienceTimeline() {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inertiaFrame = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const suppressClickTimeout = useRef<number | null>(null);
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startY: 0,
    startScrollTop: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  });

  const cancelInertia = () => {
    if (inertiaFrame.current === null) return;
    window.cancelAnimationFrame(inertiaFrame.current);
    inertiaFrame.current = null;
  };

  const startInertia = (initialVelocity: number) => {
    const element = scrollRef.current;
    if (!element || reduceMotion || Math.abs(initialVelocity) < 0.02) return;

    let velocity = Math.max(-2.5, Math.min(2.5, initialVelocity));
    let previousTime = performance.now();

    const step = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - previousTime, 32);
      const previousScrollTop = element.scrollTop;
      element.scrollTop += velocity * deltaTime;
      previousTime = currentTime;

      const reachedBoundary = element.scrollTop === previousScrollTop;
      velocity *= Math.pow(0.94, deltaTime / 16.67);

      if (!reachedBoundary && Math.abs(velocity) >= 0.02) {
        inertiaFrame.current = window.requestAnimationFrame(step);
      } else {
        inertiaFrame.current = null;
      }
    };

    cancelInertia();
    inertiaFrame.current = window.requestAnimationFrame(step);
  };

  useEffect(() => () => {
    if (inertiaFrame.current !== null) window.cancelAnimationFrame(inertiaFrame.current);
    if (suppressClickTimeout.current !== null) window.clearTimeout(suppressClickTimeout.current);
  }, []);

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state.active || state.pointerId !== event.pointerId) return;

    state.active = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (state.moved) {
      const releaseDelay = event.timeStamp - state.lastTime;
      startInertia(releaseDelay > 80 ? 0 : state.velocity);
      suppressClick.current = true;
      suppressClickTimeout.current = window.setTimeout(() => {
        suppressClick.current = false;
        suppressClickTimeout.current = null;
      }, 300);
    }
    state.moved = false;
  };

  return (
    <div className="min-w-0 lg:col-span-8">
      <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
        <span>7 milestones <span aria-hidden="true">·</span> 9 projects</span>
        <span className="hidden items-center gap-2 lg:flex"><MoveVertical className="size-3.5" aria-hidden="true" /> Scroll or drag</span>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 w-px bg-border" aria-hidden="true" />
        <div
          ref={scrollRef}
          className={`experience-scroll relative pl-10 lg:max-h-[47rem] lg:overflow-y-auto lg:pr-5 lg:pl-14 ${dragging ? "cursor-grabbing select-none" : "lg:cursor-grab"}`}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;

            cancelInertia();
            suppressClick.current = false;
            if (suppressClickTimeout.current !== null) {
              window.clearTimeout(suppressClickTimeout.current);
              suppressClickTimeout.current = null;
            }
            dragState.current = {
              active: true,
              moved: false,
              pointerId: event.pointerId,
              startY: event.clientY,
              startScrollTop: event.currentTarget.scrollTop,
              lastY: event.clientY,
              lastTime: event.timeStamp,
              velocity: 0,
            };
          }}
          onPointerMove={(event) => {
            const state = dragState.current;
            if (!state.active || state.pointerId !== event.pointerId) return;

            const distance = event.clientY - state.startY;
            if (Math.abs(distance) < 8 && !state.moved) return;

            if (!state.moved) {
              state.moved = true;
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }

            const deltaTime = Math.max(event.timeStamp - state.lastTime, 1);
            const instantVelocity = -(event.clientY - state.lastY) / deltaTime;
            state.velocity = state.velocity * 0.65 + instantVelocity * 0.35;
            state.lastY = event.clientY;
            state.lastTime = event.timeStamp;

            event.preventDefault();
            event.currentTarget.scrollTop = state.startScrollTop - distance;
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onWheel={cancelInertia}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (!suppressClick.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
            if (suppressClickTimeout.current !== null) {
              window.clearTimeout(suppressClickTimeout.current);
              suppressClickTimeout.current = null;
            }
          }}
          aria-label="Professional experience timeline. Scroll or drag vertically to explore milestones."
        >
          {experiences.map((experience, index) => (
            <section key={`${experience.organization}-${experience.period}`} className="relative border-t border-border py-8 first:pt-7 md:py-11">
              <span className="absolute top-9 -left-8 size-2 rounded-full bg-accent ring-8 ring-background md:top-12 lg:-left-12" aria-hidden="true" />
              <div className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)]">
                <div className="font-mono text-[9px] uppercase leading-5 tracking-[0.15em] text-faint">
                  <p className="text-steel">{experience.organization}</p>
                  <p>{experience.period}</p>
                  <p className="mt-2 text-faint/70">{String(index + 1).padStart(2, "0")}</p>
                </div>
                <div className="min-w-0">
                  {experience.projects.map(resolveProject).map((project) => (
                    <ProjectAccordion
                      key={project.id}
                      project={project}
                      expanded={openProjectId === project.id}
                      onToggle={() => setOpenProjectId((current) => current === project.id ? null : project.id)}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
