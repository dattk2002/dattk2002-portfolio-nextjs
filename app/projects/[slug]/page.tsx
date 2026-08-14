import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { MotionReveal } from "@/components/motion-reveal";
import { ProjectArtwork } from "@/components/project-artwork";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { Button } from "@/components/ui/button";
import { getProject, projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${siteConfig.name}`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="top" className="w-full max-w-full overflow-x-hidden">
      <SiteNavigation />

      <header className="relative px-5 pt-36 pb-20 sm:px-8 lg:px-12 lg:pt-48 lg:pb-28">
        <div className="ambient-grid absolute inset-0 -z-10 opacity-45" />
        <div className="mx-auto max-w-[90rem]">
          <Link href="/#work" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Selected work</Link>
          <MotionReveal className="mt-16 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">{project.context} · {project.period}</p>
              <h1 className="mt-7 max-w-6xl font-display text-[clamp(4.5rem,11vw,10rem)] leading-[0.82] font-medium tracking-[-0.078em]">{project.name}</h1>
            </div>
            <p className="max-w-xl text-lg leading-8 text-muted lg:col-span-4 lg:pb-2">{project.summary}</p>
          </MotionReveal>
          <MotionReveal delay={0.1} className="mt-16 h-[32rem] sm:h-[42rem] lg:h-[50rem]">
            <ProjectArtwork project={project} priority />
          </MotionReveal>
        </div>
      </header>

      <section className="border-y border-border bg-surface/35 px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-12">
          <MotionReveal className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Role and ownership</p>
            <p className="mt-6 max-w-xl font-display text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">{project.ownership}</p>
          </MotionReveal>
          <MotionReveal delay={0.08} className="lg:col-span-7 lg:pl-12">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Verified outcomes</p>
            <div className="mt-6">
              {project.outcomes.map((outcome) => <p key={outcome} className="border-t border-border py-6 text-lg leading-8 text-muted first:border-t-0">{outcome}</p>)}
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="px-5 py-32 sm:px-8 lg:px-12 lg:py-48">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-px bg-border lg:grid-cols-2">
            <MotionReveal className="bg-background p-8 sm:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">The challenge</p>
              <p className="mt-8 font-display text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">{project.challenge}</p>
            </MotionReveal>
            <MotionReveal delay={0.06} className="bg-surface p-8 sm:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">The approach</p>
              <p className="mt-8 text-lg leading-8 text-muted">{project.approach}</p>
            </MotionReveal>
          </div>

          <div className="mt-32 grid gap-14 lg:grid-cols-12">
            <MotionReveal className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Architecture</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">Systems that stay understandable.</h2>
            </MotionReveal>
            <div className="lg:col-span-8">
              {project.architecture.map((item, itemIndex) => (
                <MotionReveal key={item} delay={itemIndex * 0.05} className="grid grid-cols-[3rem_1fr] border-t border-border py-7">
                  <span className="font-mono text-xs text-faint">0{itemIndex + 1}</span>
                  <p className="text-lg text-muted sm:text-xl">{item}</p>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {project.gallery.length > 1 ? (
        <section className="border-y border-border bg-surface/35 px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
          <div className="mx-auto max-w-[90rem]">
            <MotionReveal className="mb-14 flex items-end justify-between gap-8">
              <h2 className="max-w-4xl font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] tracking-[-0.065em]">The product in motion.</h2>
              <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-faint sm:block">Verified UI captures</span>
            </MotionReveal>
            <div className="grid gap-5 lg:grid-cols-12">
              {project.gallery.map((image, imageIndex) => (
                <MotionReveal key={image.src} delay={imageIndex * 0.05} className={imageIndex === 1 ? "group relative min-h-[34rem] overflow-hidden rounded-xl border border-border bg-surface lg:col-span-8" : "group relative min-h-[34rem] overflow-hidden rounded-xl border border-border bg-surface lg:col-span-4"}>
                  <Image src={image.src} alt={image.alt} fill unoptimized sizes="(max-width: 1024px) 100vw, 66vw" className="object-contain object-center p-6 transition-transform duration-700 group-hover:scale-[1.025]" />
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12">
          <MotionReveal className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Technology</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.technologies.map((technology) => <span key={technology} className="border border-border bg-surface px-4 py-2 font-mono text-xs text-muted">{technology}</span>)}
            </div>
          </MotionReveal>
          <MotionReveal delay={0.06} className="flex flex-wrap items-end gap-3 lg:col-span-5 lg:justify-end">
            {project.liveUrls?.map((liveProduct) => <Button key={liveProduct.href} size="lg" asChild><a href={liveProduct.href} target="_blank" rel="noreferrer">Visit {liveProduct.label} <ExternalLink aria-hidden="true" /></a></Button>)}
            {project.repositoryUrls?.map((repository) => <Button key={repository.href} size="lg" variant="outline" asChild><a href={repository.href} target="_blank" rel="noreferrer"><Code2 aria-hidden="true" /> {repository.label}</a></Button>)}
          </MotionReveal>
        </div>
      </section>

      <nav className="grid border-y border-border sm:grid-cols-2" aria-label="Project pagination">
        <Link href={`/projects/${previous.slug}`} className="group border-b border-border bg-surface p-8 transition-colors hover:bg-surface-raised sm:border-r sm:border-b-0 lg:p-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Previous project</span>
          <span className="mt-5 flex items-center gap-3 font-display text-4xl tracking-[-0.05em]"><ArrowLeft className="size-6 transition-transform group-hover:-translate-x-1" aria-hidden="true" />{previous.name}</span>
        </Link>
        <Link href={`/projects/${next.slug}`} className="group bg-surface p-8 text-right transition-colors hover:bg-surface-raised lg:p-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Next project</span>
          <span className="mt-5 flex items-center justify-end gap-3 font-display text-4xl tracking-[-0.05em]">{next.name}<ArrowRight className="size-6 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
        </Link>
      </nav>

      <section className="bg-accent px-5 py-24 text-accent-foreground sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-5xl font-display text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.86] tracking-[-0.07em]">Have a product that needs full-stack ownership?</h2>
          <Button size="lg" variant="outline" className="border-black/35 text-black hover:bg-black hover:text-white" asChild><a href={`mailto:${siteConfig.email}`}>Start a conversation <ArrowUpRight aria-hidden="true" /></a></Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
