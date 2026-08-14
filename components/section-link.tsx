"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useReducedMotion } from "framer-motion";

type SectionLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: `#${string}`;
};

export const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { href, onClick, ...props },
  ref,
) {
  const reduceMotion = useReducedMotion();

  return (
    <a
      ref={ref}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        event.preventDefault();
        if (window.location.hash !== href) window.history.pushState(null, "", href);
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }}
      {...props}
    />
  );
});
