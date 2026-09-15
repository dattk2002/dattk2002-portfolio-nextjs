"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut, SquareArrowOutUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function GithubSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    const authorizationTab = window.open("about:blank", "_blank");

    if (!authorizationTab) {
      setError("Your browser blocked the authorization tab. Allow pop-ups for this site and try again.");
      return;
    }

    authorizationTab.opener = null;
    setPending(true);
    setError("");

    try {
      await authClient.signOut();
      const result = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/admin/blog",
        disableRedirect: true,
      });

      if (result.error || !result.data?.url) {
        authorizationTab.close();
        setError(result.error?.message || "GitHub sign-in failed.");
        return;
      }

      const authorizationUrl = new URL(result.data.url, window.location.origin);
      if (authorizationUrl.protocol !== "https:" && authorizationUrl.protocol !== "http:") {
        authorizationTab.close();
        setError("GitHub returned an invalid authorization link.");
        return;
      }

      authorizationTab.location.replace(authorizationUrl.toString());
    } catch {
      authorizationTab.close();
      setError("GitHub sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <Button
        className="w-full justify-between"
        size="lg"
        type="button"
        disabled={pending}
        aria-describedby="github-auth-note"
        onClick={() => void signIn()}
      >
        <span className="flex items-center gap-2">
          {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Preparing GitHub…" : "Continue with GitHub"}
        </span>
        {!pending ? <SquareArrowOutUpRight className="size-5" aria-hidden="true" /> : null}
      </Button>
      <p id="github-auth-note" className="mt-3 text-sm leading-6 text-faint">
        Authorization opens in a new tab. This page stays available.
      </p>
      {error ? <p className="mt-3 text-sm leading-6 text-error" role="alert">{error}</p> : null}
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={async () => { setPending(true); await authClient.signOut(); router.replace("/admin/sign-in"); router.refresh(); }}>{pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LogOut className="size-4" aria-hidden="true" />}Sign out</Button>;
}
