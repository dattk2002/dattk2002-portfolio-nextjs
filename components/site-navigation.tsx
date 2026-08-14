"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Contact", href: "/#contact" },
] as const;

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "fixed top-4 right-4 left-4 z-50 mx-auto flex max-w-[86rem] items-center justify-between border border-border/80 bg-background/82 px-4 backdrop-blur-xl transition-[padding,border-radius] duration-300 sm:px-5",
          compact ? "rounded-xl py-2.5" : "rounded-2xl py-3.5",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Tran Kim Dat, home"
        >
          <BrandMark className="size-7 shrink-0 text-accent" />
          <span className="hidden border-l border-border pl-3 font-mono text-[9px] uppercase tracking-[0.18em] text-faint sm:inline">Tran Kim Dat</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button size="sm" variant="outline" asChild>
            <a href={siteConfig.cvPath} download={siteConfig.cvDownloadName}>
              Download CV <Download aria-hidden="true" />
            </a>
          </Button>
        </div>

        <Dialog.Trigger asChild>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md border border-border text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" />
          </button>
        </Dialog.Trigger>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div className="fixed inset-0 z-[59] bg-background/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-[60] flex flex-col bg-background px-5 py-5 outline-none"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Dialog.Title className="sr-only">Portfolio navigation</Dialog.Title>
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <BrandMark className="size-7 text-accent" />
                  <Dialog.Close asChild>
                    <button type="button" className="grid size-10 place-items-center rounded-md border border-border" aria-label="Close navigation">
                      <X aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-1 flex-col justify-center gap-3" aria-label="Mobile navigation">
                  {navItems.map((item, index) => (
                    <motion.div key={item.href} initial={reduceMotion ? false : { opacity: 0.6, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 + 0.12 }}>
                      <Dialog.Close asChild>
                        <Link href={item.href} className="block border-b border-border py-4 font-display text-[clamp(2.5rem,13vw,4rem)] leading-none tracking-[-0.055em]">
                          {item.label}
                        </Link>
                      </Dialog.Close>
                    </motion.div>
                  ))}
                </nav>
                <Button size="lg" asChild>
                  <a href={siteConfig.cvPath} download={siteConfig.cvDownloadName}>Download CV <Download aria-hidden="true" /></a>
                </Button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
