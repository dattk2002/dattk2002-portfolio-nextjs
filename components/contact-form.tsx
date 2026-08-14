"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowUpRight, Check, LoaderCircle, TriangleAlert } from "lucide-react";

import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { cn } from "@/lib/utils";

const fieldClass = "h-12 rounded-md border border-border bg-surface px-4 text-foreground outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20";

const initialContactState: ContactState = {
  status: "idle",
  message: "",
};

function FieldError({ errors, id }: { errors?: string[]; id: string }) {
  if (!errors?.length) return null;
  return <span id={id} className="text-xs leading-5 text-error">{errors[0]}</span>;
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="rounded-xl bg-background p-6 text-foreground sm:p-8 lg:p-9" aria-label="Contact form" noValidate>
      <label className="sr-only" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>

      <h3 className="font-display text-3xl tracking-[-0.05em]">Tell me what you’re building</h3>
      <label className="mt-7 grid gap-2 text-sm">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">Name</span>
        <input name="name" autoComplete="name" className={cn(fieldClass, state.fieldErrors?.name && "border-error")} placeholder="Your name" aria-invalid={Boolean(state.fieldErrors?.name)} aria-describedby={state.fieldErrors?.name ? "name-error" : undefined} />
        <FieldError id="name-error" errors={state.fieldErrors?.name} />
      </label>
      <label className="mt-5 grid gap-2 text-sm">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">Email</span>
        <input name="email" type="email" autoComplete="email" className={cn(fieldClass, state.fieldErrors?.email && "border-error")} placeholder="you@company.com" aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "email-error" : undefined} />
        <FieldError id="email-error" errors={state.fieldErrors?.email} />
      </label>
      <label className="mt-5 grid gap-2 text-sm">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">Subject</span>
        <input name="subject" className={cn(fieldClass, state.fieldErrors?.subject && "border-error")} placeholder="Role, product, or collaboration" aria-invalid={Boolean(state.fieldErrors?.subject)} aria-describedby={state.fieldErrors?.subject ? "subject-error" : undefined} />
        <FieldError id="subject-error" errors={state.fieldErrors?.subject} />
      </label>
      <label className="mt-5 grid gap-2 text-sm">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">Message</span>
        <textarea name="message" rows={6} className={cn("resize-none rounded-md border border-border bg-surface p-4 text-foreground outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20", state.fieldErrors?.message && "border-error")} placeholder="Tell me what you are building." aria-invalid={Boolean(state.fieldErrors?.message)} aria-describedby={state.fieldErrors?.message ? "message-error" : undefined} />
        <FieldError id="message-error" errors={state.fieldErrors?.message} />
      </label>

      <button type="submit" disabled={pending} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-accent px-6 font-medium text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0">
        {pending ? <><LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> Sending message</> : <>Start a conversation <ArrowUpRight className="size-5" aria-hidden="true" /></>}
      </button>

      <div className={cn("mt-4 min-h-6 text-sm", state.status === "error" ? "text-error" : "text-success")} aria-live="polite" role="status">
        {state.message ? <span className="inline-flex items-start gap-2">{state.status === "success" ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}{state.message}</span> : null}
      </div>
    </form>
  );
}
