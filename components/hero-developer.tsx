"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

import { getPupilOffsets } from "@/lib/hero-gaze";

// Calibrated in the image's 512 × 512 coordinate system, independently of CSS size.
const eyes = [
  { cx: 240.2, cy: 205.3, whiteRx: 10, whiteRy: 14, rotation: -22, pupilRx: 5.2, pupilRy: 7.5, travel: 2 },
  { cx: 296.7, cy: 199.8, whiteRx: 16.5, whiteRy: 13.5, rotation: 0, pupilRx: 7.8, pupilRy: 9.3, travel: 3 },
] as const;
const gazeOrigin = { x: (eyes[0].cx + eyes[1].cx) / 2, y: (eyes[0].cy + eyes[1].cy) / 2 };
const pupilTravel = eyes.map((eye) => eye.travel);

const motionQuery = "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 1024px)";

export function HeroDeveloper() {
  const eyeClipId = useId();
  const hostRef = useRef<HTMLSpanElement>(null);
  const spriteRef = useRef<HTMLSpanElement>(null);
  const eyeLayerRef = useRef<SVGSVGElement>(null);
  const pupilRefs = useRef<Array<SVGGElement | null>>([]);

  useEffect(() => {
    const host = hostRef.current;
    const sprite = spriteRef.current;
    const eyeLayer = eyeLayerRef.current;
    const pupils = pupilRefs.current.filter((pupil): pupil is SVGGElement => pupil !== null);
    if (!host || !sprite || !eyeLayer || pupils.length !== eyes.length) return;

    const eligible = window.matchMedia(motionQuery);
    let disposed = false;
    let initialized = false;
    let revertMotion: (() => void) | undefined;

    async function initialize() {
      if (!eligible.matches || initialized) return;
      initialized = true;
      const { gsap } = await import("gsap");
      if (disposed) return;

      const media = gsap.matchMedia();
      revertMotion = () => media.revert();
      media.add(motionQuery, () => {
        const movers = pupils.map((pupil) => ({
          x: gsap.quickTo(pupil, "x", { duration: 0.18, ease: "power2.out" }),
          y: gsap.quickTo(pupil, "y", { duration: 0.18, ease: "power2.out" }),
        }));
        let visible = false;

        const resetGaze = () => movers.forEach(({ x, y }) => { x(0); y(0); });
        const measure = () => {
          const bounds = host!.getBoundingClientRect();
          visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
          if (!visible) resetGaze();
        };
        const follow = (event: PointerEvent) => {
          if (!visible || event.pointerType === "touch") return;
          const screen = eyeLayer!.getScreenCTM();
          if (!screen) return;
          const scale = Math.hypot(screen.a, screen.b);
          if (!scale) return;
          // Include parent reveals and hover rotation before calculating a shared gaze.
          const cursor = new DOMPoint(event.clientX, event.clientY).matrixTransform(screen.inverse());
          const offsets = getPupilOffsets(cursor.x, cursor.y, gazeOrigin.x, gazeOrigin.y, pupilTravel, 160 / scale);
          movers.forEach(({ x, y }, index) => {
            x(offsets[index].x);
            y(offsets[index].y);
          });
        };

        gsap.set(sprite, { transformOrigin: "50% 80%" });
        const nod = gsap.timeline({ paused: true })
          .to(sprite, { rotation: -4, yPercent: -1, duration: 0.22, ease: "power2.out" })
          .to(sprite, { rotation: 2, yPercent: 1, duration: 0.18, ease: "power2.inOut" })
          .to(sprite, { rotation: 0, yPercent: 0, duration: 0.28, ease: "power2.out" });
        const greet = () => { if (!nod.isActive()) nod.restart(); };

        measure();
        host!.addEventListener("pointerenter", greet);
        window.addEventListener("pointermove", follow, { passive: true });
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure);
        window.addEventListener("blur", resetGaze);
        document.documentElement.addEventListener("pointerleave", resetGaze);

        return () => {
          host!.removeEventListener("pointerenter", greet);
          window.removeEventListener("pointermove", follow);
          window.removeEventListener("scroll", measure);
          window.removeEventListener("resize", measure);
          window.removeEventListener("blur", resetGaze);
          document.documentElement.removeEventListener("pointerleave", resetGaze);
        };
      });
    }

    const enable = () => { void initialize().catch(() => { /* The decorative illustration stays static if motion cannot load. */ }); };
    eligible.addEventListener("change", enable);
    enable();
    return () => {
      disposed = true;
      eligible.removeEventListener("change", enable);
      revertMotion?.();
    };
  }, []);

  return (
    <span ref={hostRef} aria-hidden="true" className="hero-developer relative mx-[0.12em] inline-block size-[1em] align-[-0.12em]">
      <span ref={spriteRef} className="hero-developer-sprite relative block size-full">
        <Image src="/images/hero/developer.webp" alt="" width={512} height={512} sizes="84px" quality={90} draggable={false} className="pointer-events-none h-full w-full object-contain" />
        <svg ref={eyeLayerRef} viewBox="0 0 512 512" aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 size-full">
          <defs>
            {eyes.map((eye, index) => (
              <clipPath key={index} id={`${eyeClipId}-eye-${index}`}>
                <ellipse cx={eye.cx} cy={eye.cy} rx={eye.whiteRx} ry={eye.whiteRy} transform={`rotate(${eye.rotation} ${eye.cx} ${eye.cy})`} />
              </clipPath>
            ))}
          </defs>
          {eyes.map((eye, index) => (
            <g key={index} clipPath={`url(#${eyeClipId}-eye-${index})`}>
              <g ref={(element) => { pupilRefs.current[index] = element; }} className="hero-developer-pupil">
                <ellipse data-pupil-shape="" cx={eye.cx} cy={eye.cy} rx={eye.pupilRx} ry={eye.pupilRy} className="fill-background" />
                <circle cx={eye.cx - eye.pupilRx * 0.28} cy={eye.cy - eye.pupilRy * 0.4} r={eye.pupilRx * 0.23} className="fill-foreground" />
              </g>
            </g>
          ))}
        </svg>
      </span>
    </span>
  );
}
