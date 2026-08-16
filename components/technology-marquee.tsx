"use client";

import { useMemo } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";

import { technologyMarquee } from "@/lib/capabilities";

export function TechnologyMarquee() {
  const reduceMotion = useReducedMotion();
  const autoScroll = useMemo(
    () =>
      AutoScroll({
        active: !reduceMotion,
        playOnInit: true,
        speed: 1.5,
        startDelay: 700,
        stopOnFocusIn: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [reduceMotion],
  );
  const [marqueeRef] = useEmblaCarousel(
    {
      align: "start",
      dragFree: true,
      loop: true,
    },
    [autoScroll],
  );

  return (
    <div ref={marqueeRef} className="technology-marquee-viewport cursor-grab overflow-hidden border-y border-border py-5 active:cursor-grabbing" role="region" aria-roledescription="carousel" aria-label={`Full-stack technology ecosystem: ${technologyMarquee.join(", ")}`}>
      <div className="technology-marquee-track flex touch-pan-y select-none">
        {technologyMarquee.map((item) => (
          <span key={item} className="flex flex-none items-center gap-7 pr-7 whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {item}<span className="size-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
