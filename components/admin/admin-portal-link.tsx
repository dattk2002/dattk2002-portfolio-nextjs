"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { buttonVariants } from "@/components/ui/button";

const ADMIN_PATH = "/admin/blog";

function isUnmodifiedPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function AdminPortalLink() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionStartedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const accentPanelRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set([backdropRef.current, accentPanelRef.current], {
        yPercent: 100,
      });
      gsap.set(accentLineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(copyRef.current, { autoAlpha: 0, y: 28 });
    }, overlayRef);

    return () => {
      timelineRef.current?.kill();
      context.revert();
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || !isUnmodifiedPrimaryClick(event)) return;

    event.preventDefault();

    if (transitionStartedRef.current) return;

    transitionStartedRef.current = true;
    setIsTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(ADMIN_PATH);
      return;
    }

    try {
      timelineRef.current = gsap
        .timeline({ defaults: { overwrite: "auto" } })
        .set(overlayRef.current, { autoAlpha: 1 })
        .to(backdropRef.current, {
          yPercent: 0,
          duration: 0.42,
          ease: "power3.inOut",
        })
        .to(
          accentPanelRef.current,
          { yPercent: 0, duration: 0.32, ease: "power3.out" },
          0.12,
        )
        .to(
          accentLineRef.current,
          { scaleX: 1, duration: 0.3, ease: "power2.out" },
          0.2,
        )
        .to(
          copyRef.current,
          { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" },
          0.2,
        )
        .call(() => router.push(ADMIN_PATH), undefined, 0.46);
    } catch {
      router.push(ADMIN_PATH);
    }
  }

  return (
    <>
      <Link
        href={ADMIN_PATH}
        prefetch={false}
        onClick={handleClick}
        aria-disabled={isTransitioning || undefined}
        className={buttonVariants({
          variant: "outline",
          className: "min-w-[9.5rem] cursor-pointer",
        })}
      >
        {isTransitioning ? "Opening admin…" : "Open admin"}
        <LockKeyhole className="size-4" aria-hidden="true" />
      </Link>

      <span className="sr-only" aria-live="polite">
        {isTransitioning
          ? "Opening the private blog administration workspace."
          : ""}
      </span>

      <div
        ref={overlayRef}
        data-admin-transition
        className="invisible fixed inset-0 z-[100] overflow-hidden"
        aria-hidden="true"
      >
        <div
          ref={backdropRef}
          className="absolute inset-0 translate-y-full bg-background"
        />
        <div
          ref={accentPanelRef}
          className="absolute inset-x-0 bottom-0 h-1/3 translate-y-full bg-surface-raised"
        />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[90rem] items-center px-5 sm:px-8 lg:px-12">
          <div ref={copyRef} className="w-full max-w-5xl opacity-0">
            <BrandMark className="size-10 text-accent sm:size-12" />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-steel">
              Private editorial workspace
            </p>
            <p className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.84] font-medium tracking-[-0.07em] text-foreground">
              Entering blog studio.
            </p>
            <div
              ref={accentLineRef}
              className="mt-9 h-px w-full origin-left scale-x-0 bg-accent"
            />
          </div>
        </div>
      </div>
    </>
  );
}
