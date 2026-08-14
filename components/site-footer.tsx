import Link from "next/link";
import { ArrowUp } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl tracking-[-0.04em]">Tran Kim Dat</p>
          <p className="mt-2 text-sm text-muted">Full-stack Developer · Ho Chi Minh City, Vietnam</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
          <a href={siteConfig.github} target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">Email</a>
          <Link href="#top" className="inline-flex items-center gap-2 text-foreground">Back to top <ArrowUp className="size-4" aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[90rem] border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">© {new Date().getFullYear()} Tran Kim Dat. Built with intention.</div>
    </footer>
  );
}
