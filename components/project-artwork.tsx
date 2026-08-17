import Image from "next/image";

import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const accentClasses = {
  lime: "from-accent/30 via-steel/10 to-transparent",
  blue: "from-steel/35 via-sky-950/20 to-transparent",
  amber: "from-amber-300/25 via-orange-950/20 to-transparent",
  violet: "from-violet-400/25 via-violet-950/20 to-transparent",
} as const;

export function ProjectArtwork({ project, priority = false, compact = false }: { project: Project; priority?: boolean; compact?: boolean }) {
  const image = project.gallery[0];

  return (
    <div className={cn("project-art relative isolate h-full min-h-72 overflow-hidden bg-surface-raised", compact ? "rounded-lg" : "rounded-xl")}>
      <div className={cn("absolute inset-0 bg-radial-[at_30%_20%]", accentClasses[project.accent])} />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:42px_42px]" />

      {image ? (
        <div className={cn(
          "absolute overflow-hidden border border-white/10 shadow-2xl",
          project.slug === "vncaps"
            ? "inset-y-[7%] left-1/2 w-[42%] max-w-[22rem] -translate-x-1/2 rounded-[1.75rem] bg-white"
            : "inset-x-[5%] top-[13%] aspect-[16/10] rounded-lg bg-black/20 md:inset-x-[7%]",
        )}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload={priority}
            unoptimized
            sizes="(max-width: 768px) 90vw, 42vw"
            className={cn(
              "transition-transform duration-700 ease-out group-hover:scale-[1.025]",
              project.slug === "vncaps" ? "object-contain object-center" : "object-cover object-top",
            )}
          />
        </div>
      ) : project.slug === "vncaps" ? (
        <div className="absolute inset-0 grid place-items-center p-8">
          <div className="relative h-[78%] w-[82%] overflow-hidden rounded-xl border border-white/10 bg-[#121726] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[9px] uppercase tracking-[0.16em] text-violet-200/70">
              <span>VNCaps dashboard</span><span>Weekly timetable</span>
            </div>
            <div className="mt-5 grid h-[calc(100%-3rem)] grid-cols-[0.3fr_1fr] gap-4">
              <div className="space-y-3 rounded-lg bg-white/[0.035] p-3">
                {[72, 48, 64, 44].map((width) => <div key={width} className="h-2 rounded-full bg-white/10" style={{ width: `${width}%` }} />)}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => <div key={item} className={cn("rounded-md border", item === 2 || item === 6 ? "border-violet-300/50 bg-violet-300/15" : "border-white/10 bg-white/[0.025]")} />)}
              </div>
            </div>
          </div>
        </div>
      ) : project.slug === "habistride" ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative flex h-[76%] w-[72%] items-end justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0e1616] p-8 shadow-2xl">
            <div className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.2em] text-steel">VIRTUAL TREE / DAY 42</div>
            <div className="tree-crown absolute bottom-[36%] size-36 rounded-[46%_54%_40%_60%] bg-accent/70 blur-[1px]" />
            <div className="h-[42%] w-3 rounded-full bg-amber-700" />
            <div className="absolute right-6 bottom-6 left-6 grid grid-cols-3 gap-2">
              {[72, 48, 88].map((value) => <div key={value} className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-steel" style={{ width: `${value}%` }} /></div>)}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111018] p-6 shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-violet-200/70"><span>ACTIVE ROUND</span><span>00:24</span></div>
            <div className="mt-8 h-4 w-4/5 rounded-full bg-white/80" />
            <div className="mt-3 h-3 w-3/5 rounded-full bg-white/20" />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((item) => <div key={item} className={cn("h-16 rounded-lg border", item === 2 ? "border-violet-300 bg-violet-300/15" : "border-white/10 bg-white/[0.03]")} />)}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{project.technologies.slice(0, 3).join(" / ")}</div>
    </div>
  );
}
