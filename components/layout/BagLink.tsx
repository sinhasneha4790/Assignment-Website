"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BagIcon } from "@/components/ui/Icons";
import { BAG_COUNT_COOKIE, BAG_EVENT } from "@/lib/bag-count";

function readCount(): number {
  const match = document.cookie.match(new RegExp(`(?:^|; )${BAG_COUNT_COOKIE}=(\\d+)`));
  return match ? Number(match[1]) : 0;
}

function subscribe(onChange: () => void) {
  window.addEventListener(BAG_EVENT, onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener(BAG_EVENT, onChange);
    window.removeEventListener("focus", onChange);
  };
}

/** Bag icon with a live item count. The cart actions keep the count cookie in sync. */
export function BagLink() {
  const count = useSyncExternalStore(subscribe, readCount, () => 0);
  return (
    <Link href="/cart" aria-label={count ? `Bag, ${count} ${count === 1 ? "item" : "items"}` : "Bag, empty"} className="relative inline-flex items-center justify-center w-11 h-11">
      <BagIcon />
      {count > 0 && (
        <span className="absolute top-1.5 right-1 bg-olive text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
