"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readRecent, type RecentItem } from "@/lib/recently-viewed";

let cache: { raw: string | null; items: RecentItem[] } = { raw: null, items: [] };
function snapshot(): RecentItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem("ff_recent");
  } catch {}
  if (raw !== cache.raw) cache = { raw, items: readRecent() };
  return cache.items;
}
const none: RecentItem[] = [];

/** "Recently viewed" row from this browser's history. */
export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const items = useSyncExternalStore(() => () => {}, snapshot, () => none).filter((i) => i.slug !== exclude);
  if (!items.length) return null;
  return (
    <section aria-label="Recently viewed" className="border-t border-line pt-6 mt-6">
      <h2 className="eyebrow mb-4">Recently viewed</h2>
      <div className="flex gap-3 overflow-x-auto">
        {items.map((i) => (
          <Link key={i.slug} href={`/p/${i.slug}`} className="shrink-0 w-[90px]" title={i.name}>
            <div className="relative w-[90px] h-[120px] bg-sand">
              <Image src={i.image} alt={i.name} fill sizes="90px" className="object-cover" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
