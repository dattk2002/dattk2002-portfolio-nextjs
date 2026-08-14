import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">404</p>
        <h1 className="mt-5 font-display text-6xl tracking-[-0.06em] sm:text-8xl">Nothing lives here.</h1>
        <p className="mx-auto mt-6 max-w-lg text-muted">The page may have moved, or the project link is no longer available.</p>
        <Button className="mt-10" asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}
