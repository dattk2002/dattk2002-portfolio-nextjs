import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <><main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24"><Link href="/" className="inline-flex min-h-11 items-center text-sm text-accent">Back to portfolio</Link><h1 className="mt-8 font-display text-5xl tracking-tight">Privacy</h1><div className="mt-8 space-y-6 text-base leading-8 text-muted">
    <p>This portfolio can collect anonymous statistics to understand which pages and projects visitors find useful. The analytics do not identify you by name, email, or GitHub account.</p>
    <p>Statistics include public page paths, referring website hostnames, approximate country, browser and device categories, and clicks on CV, GitHub, email, and phone links. URL query parameters and fragments are excluded.</p>
    <p>A daily estimate of visitors uses a keyed hash derived from the request IP address and browser information. The identifier changes every day in Vietnam time. Raw IP addresses and full browser information are not stored in the analytics database. Analytics set no cookies and use no browser storage.</p>
    <p>Website analytics honor Do Not Track and Global Privacy Control signals. You can enable these in a supporting browser to opt out. Recorded events are retained for up to 90 calendar days and removed by daily maintenance. Analytics are visible only in the owner&apos;s protected admin workspace.</p>
    <p>GitHub repository statistics contain aggregate views and clones, not the identities of people viewing a profile or repository. Essential admin authentication and information you voluntarily send through the contact form are separate from website analytics.</p>
  </div></main><SiteFooter /></>;
}
