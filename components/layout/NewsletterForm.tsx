"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { buttonClass } from "@/components/ui/Button";

export function NewsletterForm() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeToNewsletter, { status: "idle" });

  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        <label htmlFor="ft-email" className="sr-only">Email address</label>
        <input
          id="ft-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className="flex-[1_1_180px] min-h-12 px-3.5 bg-transparent text-paper border border-on-dark-field rounded-[2px] placeholder:text-on-dark-muted"
        />
        {/* Honeypot for bots */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button type="submit" disabled={pending} className={buttonClass("light")}>
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p aria-live="polite" className="text-[13px] min-h-5 text-on-dark-soft">
        {state.message}
      </p>
    </form>
  );
}
