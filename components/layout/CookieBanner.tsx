"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { setClientCookie, YEAR } from "@/lib/client-cookie";

const COOKIE = "ff_consent";

const hasChoice = () => document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));

/** Cookie consent banner on first visit (DPDP Act). Stores the choice for a year. */
export function CookieBanner() {
  const decided = useSyncExternalStore(() => () => {}, hasChoice, () => true);
  const [dismissed, setDismissed] = useState(false);
  if (decided || dismissed) return null;

  const choose = (value: "all" | "essential") => {
    setClientCookie(COOKIE, value, YEAR);
    setDismissed(true);
  };

  return (
    <section aria-label="Cookie consent" className="fixed z-50 left-4 right-4 bottom-4 max-sm:bottom-20 sm:left-auto sm:max-w-md bg-paper border border-line rounded-[4px] p-5 shadow-[0_8px_30px_rgba(38,37,31,.15)]">
      <p className="text-sm">
        We use essential cookies to run the shop and, with your permission, analytics cookies to improve it.{" "}
        <Link href="/policies/cookies" className="underline">Cookie policy</Link>
      </p>
      <div className="flex gap-2 mt-4 flex-wrap">
        <button type="button" className={buttonClass("solid")} onClick={() => choose("all")}>Accept all</button>
        <button type="button" className={buttonClass("outline")} onClick={() => choose("essential")}>Essential only</button>
      </div>
    </section>
  );
}
