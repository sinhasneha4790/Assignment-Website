"use client";

/** Recently viewed products, kept in this browser only. */
const KEY = "ff_recent";
const MAX = 8;

export type RecentItem = { slug: string; name: string; image: string; price: number };

export function readRecent(): RecentItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? (v as RecentItem[]).slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function pushRecent(item: RecentItem) {
  try {
    const next = [item, ...readRecent().filter((r) => r.slug !== item.slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode): nothing to remember.
  }
}
