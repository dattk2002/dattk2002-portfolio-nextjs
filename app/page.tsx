import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Download, Mail, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { GithubStats } from "@/components/github-stats";
import { MotionReveal } from "@/components/motion-reveal";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionLink } from "@/components/section-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { TechnologyMarquee } from "@/components/technology-marquee";
import { Button } from "@/components/ui/button";
import { WordReveal } from "@/components/word-reveal";
import { capabilities } from "@/lib/capabilities";
import { siteConfig } from "@/lib/site";

const certifications = [
  { title: "EF SET English Certificate", meta: "78/100 · C2 Proficient" },
  { title: "Computer Communications Specialization", meta: "Coursera · Oct 2, 2021" },
  { title: "Software Development Lifecycle Specialization", meta: "Coursera · Jun 3, 2022" },
  { title: "Academic English: Writing Specialization", meta: "Coursera · Feb 8, 2023" },
  { title: "User Experience Research and Design", meta: "Coursera · Nov 20, 2023" },
] as const;

function PositioningSection({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-foreground px-5 py-20 text-background md:px-8 md:py-24 lg:px-12 lg:py-28 ${className}`}>
      <div className="mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)] lg:items-center lg:gap-24">
        <div>
          <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">One product perspective, across every layer</p>
          <WordReveal />
        </div>
        <div className="grid border-t border-background/20 sm:grid-cols-2 lg:grid-cols-1">
          {["Architecture → Figma handoff", "Frontend → backend integration", "Testing → containerization", "Deployment → production delivery"].map((item) => (
            <p key={item} className="border-b border-background/20 py-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-background/65">{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main id="top" className="w-full max-w-full overflow-x-hidden">
      <SiteNavigation />

      <section className="relative mx-auto flex min-h-[56rem] w-full max-w-[100rem] items-center px-5 pt-28 pb-16 md:min-h-[57.5rem] md:px-8 md:pt-32 lg:min-h-[61.25rem] lg:px-12 lg:pt-36 lg:pb-20">
        <div className="ambient-grid absolute inset-0 -z-10 opacity-55" />
        <div className="absolute top-16 right-[-10rem] -z-10 size-[34rem] rounded-full bg-steel/10 blur-[120px]" />
        <div className="grid min-w-0 w-full items-center gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
          <div className="relative z-10 min-w-0 md:col-span-7 lg:col-span-8">
            <MotionReveal>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.18em] text-steel sm:text-[10px]">
                <span>Full-stack Developer</span><span className="h-px w-9 bg-border" /><span>Ho Chi Minh City, Vietnam</span>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <h1 className="mt-7 max-w-6xl font-display font-medium tracking-[-0.07em] text-balance md:mt-8">
                <span className="block text-[clamp(2.35rem,10.5vw,3rem)] leading-[0.9] uppercase md:hidden">I build digital<br />products from<br />interface to<br />infrastructure.</span>
                <span className="hidden text-[clamp(2.35rem,4.4vw,2.8rem)] leading-[0.88] uppercase md:block lg:hidden">
                  <span className="block">I build digital</span>
                  <span className="block">products from interface</span>
                  <span className="block">to infrastructure.</span>
                </span>
                <span className="hidden text-[clamp(3.4rem,5.3vw,5.25rem)] leading-[0.88] uppercase lg:block">
                  I build digital products
                  <span className="mx-[0.12em] inline-block h-[0.52em] w-[0.95em] overflow-hidden rounded-full align-[0.04em] ring-1 ring-white/15">
                    <Image src={siteConfig.portraitPath} alt="" width={160} height={88} quality={90} loading="eager" className="h-full w-full object-cover object-[center_54%]" />
                  </span><br />from interface to infrastructure.
                </span>
              </h1>
            </MotionReveal>
            <MotionReveal delay={0.16}>
              <p className="mt-7 max-w-2xl text-sm leading-6 text-muted md:text-base md:leading-7 lg:text-lg lg:leading-8">
                Full-stack developer with 3+ years delivering production web applications and cross-platform products across commerce, CMS, booking, SaaS, education, and social experiences.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.22} className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-9">
              <Button size="lg" asChild><SectionLink href="#work">View selected work <ArrowDownRight aria-hidden="true" /></SectionLink></Button>
              <Button size="lg" variant="outline" asChild><a href={siteConfig.cvPath} download={siteConfig.cvDownloadName}>Download CV <Download aria-hidden="true" /></a></Button>
            </MotionReveal>
            <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.15em] text-faint">Open to full-stack opportunities · Remote or Ho Chi Minh City</p>
          </div>

          <MotionReveal delay={0.12} className="relative md:col-span-5 lg:col-span-4 lg:translate-y-10">
            <div className="relative mx-auto aspect-[4/5] max-h-[34rem] max-w-md overflow-hidden rounded-xl border border-border bg-surface">
              <Image src={siteConfig.portraitPath} alt="Portrait of Tran Kim Dat" fill preload quality={90} sizes="(max-width: 767px) 90vw, (max-width: 1023px) 40vw, 32vw" className="object-cover object-center grayscale-[12%] contrast-[1.02] transition-transform duration-1000 ease-out hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-steel/5" />
              <div className="absolute right-4 bottom-4 left-4 sm:right-5 sm:bottom-5 sm:left-5">
                <GithubStats profileUrl={siteConfig.github} />
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <PositioningSection className="lg:hidden" />

      <section id="work" className="scroll-mt-24 border-y border-border bg-background px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[90rem]">
          <MotionReveal className="mb-10 flex flex-col gap-5 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Selected work</p>
              <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.7rem,6vw,4.8rem)] leading-[0.92] tracking-[-0.06em]">
                <span className="md:hidden">Selected work.</span>
                <span className="hidden md:inline">Products carried from architecture to release.</span>
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm leading-6 text-muted md:block">Drag the carousel or use the arrow keys. The first card in view brings its full story forward.</p>
          </MotionReveal>
          <ProjectShowcase />
        </div>
      </section>

      <PositioningSection className="hidden lg:block" />

      <section id="capabilities" className="scroll-mt-24 bg-surface px-5 py-20 md:px-8 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[90rem]">
          <MotionReveal className="mb-10 grid gap-5 md:mb-12 lg:grid-cols-12">
            <h2 className="max-w-3xl font-display text-[clamp(2.8rem,5.6vw,4.8rem)] leading-[0.92] tracking-[-0.06em] lg:col-span-8">One product.<br />Every critical layer.</h2>
            <p className="max-w-md self-end text-sm leading-6 text-muted lg:col-span-4 lg:text-base lg:leading-7">Systems thinking across interface, application logic, data, real-time communication, quality, and production operations.</p>
          </MotionReveal>

          <div className="grid grid-flow-dense gap-px bg-border md:h-[34rem] md:grid-cols-12 md:grid-rows-4 lg:h-[35.5rem]">
            {capabilities.map((capability, index) => (
              <MotionReveal
                key={capability.title}
                delay={index * 0.04}
                className={index === 0 ? "bg-accent p-7 text-accent-foreground md:col-span-5 md:row-span-4 lg:p-10" : "bg-surface-raised p-6 md:col-span-7 md:p-5 lg:p-6"}
              >
                <div className={index === 0 ? "flex h-full min-h-56 flex-col" : "flex h-full min-h-32 flex-col justify-center md:min-h-0"}>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.16em] ${index === 0 ? "opacity-60" : "text-faint"}`}>{capability.technologies.slice(0, 2).join(" / ")}</span>
                  <h3 className={index === 0 ? "mt-auto pt-12 font-display text-4xl tracking-[-0.05em]" : "mt-4 font-display text-2xl tracking-[-0.04em]"}>{capability.title}</h3>
                  {index === 0 ? <p className="mt-4 max-w-md text-sm leading-6 opacity-75">{capability.description}</p> : null}
                  <p className={`mt-4 font-mono text-[9px] uppercase leading-4 tracking-[0.1em] ${index === 0 ? "opacity-60" : "text-steel"}`}>{capability.technologies.join(" · ")}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
          <TechnologyMarquee />
        </div>
      </section>

      <section id="experience" className="scroll-mt-24 border-y border-border bg-background px-5 py-20 md:px-8 md:py-32 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12 lg:gap-20">
          <MotionReveal className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Professional experience</p>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.06em]">Production work,<br />clearly owned.</h2>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted lg:text-base lg:leading-7">Frontend leadership, full-stack delivery, and independent product ownership across interface, application logic, data, and production systems.</p>
            <p className="mt-5 max-w-sm font-mono text-[9px] uppercase leading-5 tracking-[0.13em] text-faint">Open a project to explore its scope, ownership, outcomes, and technology stack.</p>
          </MotionReveal>
          <ExperienceTimeline />
        </div>
      </section>

      <section className="bg-foreground px-5 py-20 text-background md:px-8 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[90rem] gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:gap-24">
          <MotionReveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Education</p>
            <h2 className="mt-5 font-display text-4xl tracking-[-0.055em] md:text-5xl">FPT University</h2>
            <p className="mt-4 text-lg text-background/65">Software Engineering</p>
            <div className="mt-8 border-t border-background/20 pt-4 font-mono text-[9px] uppercase leading-5 tracking-[0.14em] text-background/55">Sep 2021 – Dec 2024 · Graduated · GPA 7.8/10</div>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">Certifications</p>
            <div className="mt-5">
              {certifications.map((certification) => (
                <div key={certification.title} className="grid gap-1 border-t border-background/20 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                  <p className="text-sm leading-6">{certification.title}</p><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-background/50">{certification.meta}</p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-accent px-5 py-20 text-accent-foreground md:px-8 md:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-[0.78fr_1.22fr] md:gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col md:col-span-1 lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-65">Start a conversation</p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(3.4rem,6vw,5.5rem)] leading-[0.87] tracking-[-0.07em]">Let’s build<br />something useful.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 opacity-70">For recruiters and product teams looking for full-stack ownership from interface through production delivery.</p>
            <div className="mt-10 grid gap-2 text-sm md:mt-auto md:pt-14">
              <a href={`mailto:${siteConfig.email}`} className="inline-flex min-h-11 items-center gap-3 border-b border-black/25"><Mail className="size-4" aria-hidden="true" /><span><span className="sr-only">Email: </span>{siteConfig.email}</span></a>
              <a href={`tel:${siteConfig.phoneHref}`} className="inline-flex min-h-11 items-center gap-3 border-b border-black/25"><Phone className="size-4" aria-hidden="true" /><span><span className="sr-only">Phone: </span>{siteConfig.phoneDisplay}</span></a>
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-between border-b border-black/25">LinkedIn <ArrowUpRight className="size-4" aria-hidden="true" /></a>
              <a href={siteConfig.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-between border-b border-black/25">GitHub <ArrowUpRight className="size-4" aria-hidden="true" /></a>
              <a href={siteConfig.cvPath} download={siteConfig.cvDownloadName} className="inline-flex min-h-11 items-center justify-between border-b border-black/25">Download CV <Download className="size-4" aria-hidden="true" /></a>
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-7"><ContactForm /></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
