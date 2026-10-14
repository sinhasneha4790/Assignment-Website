"use server";

import { z } from "zod";
import { db, hasDatabase } from "@/lib/db";

export type NewsletterState = { status: "idle" | "ok" | "error"; message?: string };

const schema = z.object({
  email: z.email().max(254).transform((e) => e.toLowerCase()),
  company: z.string().max(0).optional(), // honeypot must stay empty
});

export async function subscribeToNewsletter(_prev: NewsletterState, form: FormData): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: form.get("email"), company: form.get("company") ?? undefined });
  if (!parsed.success) return { status: "error", message: "Please enter a valid email address." };

  // TODO(phase 3): rate-limit per IP with Upstash once UPSTASH_* keys are set.
  if (hasDatabase) {
    await db().newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { consent: true },
      create: { email: parsed.data.email, consent: true },
    });
  }
  return { status: "ok", message: "Thanks — you’re on the list." };
}
