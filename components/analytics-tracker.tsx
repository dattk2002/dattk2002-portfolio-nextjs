"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { isTrackablePath, type EventKind } from "@/lib/analytics-shared";
import { siteConfig } from "@/lib/site";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const previous = useRef({ path: "", sent: false });

  useEffect(() => {
    if (previous.current.path !== pathname) previous.current = { path: pathname, sent: false };
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true" || !isTrackablePath(pathname) || navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    let referrer = "";
    try { referrer = new URL(document.referrer).origin; } catch { /* Direct visit. */ }
    const send = (kind: EventKind) => {
      const body = JSON.stringify({ id: crypto.randomUUID(), kind, path: pathname, referrer });
      void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true, credentials: "omit" }).catch(() => undefined);
    };
    const pageview = () => {
      if (document.visibilityState === "visible" && !previous.current.sent) { previous.current.sent = true; send("pageview"); }
    };
    pageview();
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor) return;
      const url = new URL(anchor.href, location.origin);
      if (url.origin === location.origin && url.pathname === "/api/cv") send("cv_click");
      else if (url.hostname === new URL(siteConfig.github).hostname) send("github_click");
      else if (url.protocol === "mailto:" || url.protocol === "tel:") send("contact_click");
    };
    document.addEventListener("click", click, { capture: true });
    document.addEventListener("visibilitychange", pageview);
    return () => {
      document.removeEventListener("click", click, { capture: true });
      document.removeEventListener("visibilitychange", pageview);
    };
  }, [pathname]);

  return null;
}
