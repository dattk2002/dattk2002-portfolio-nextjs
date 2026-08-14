"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function RevealWord({ children, progress, range }: { children: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.56, 1]);
  return <motion.span style={{ opacity }} className="reveal-word mr-[0.24em] inline-block">{children}</motion.span>;
}

export function WordReveal() {
  const target = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.84", "end 0.42"] });
  const copy = "I connect interface quality with API design, data architecture, real-time systems, automated testing, and production delivery—so products move forward as one coherent system.";
  const words = copy.split(" ");

  return (
    <p ref={target} className="max-w-6xl font-display text-[clamp(2.35rem,4.7vw,4.5rem)] leading-[1.02] tracking-[-0.055em]">
      {words.map((word, index) => {
        if (reduceMotion) return <span key={`${word}-${index}`} className="mr-[0.24em] inline-block">{word}</span>;
        const start = index / words.length;
        return <RevealWord key={`${word}-${index}`} progress={scrollYProgress} range={[start, Math.min(start + 0.18, 1)]}>{word}</RevealWord>;
      })}
    </p>
  );
}
