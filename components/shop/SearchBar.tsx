"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/ui/Button";
import { chipClass } from "@/components/ui/Chip";
import { formatPrice } from "@/lib/format";

type Suggest = { products: { slug: string; name: string; price: number; image: string; note: string }[]; categories: { name: string; href: string }[] };

const RECENT_KEY = "ff_recent_searches";
let recentCache: { raw: string | null; list: string[] } = { raw: null, list: [] };
function readRecentSearches(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(RECENT_KEY);
  } catch {}
  if (raw !== recentCache.raw) {
    let list: string[] = [];
    try {
      const v = JSON.parse(raw ?? "[]");
      list = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 5) : [];
    } catch {}
    recentCache = { raw, list };
  }
  return recentCache.list;
}
function saveRecentSearch(q: string) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...readRecentSearches().filter((x) => x !== q)].slice(0, 5)));
  } catch {}
}
const noRecent: string[] = [];

/** Large search bar: instant suggestions after 2 characters, recent and popular searches. */
export function SearchBar({ initial, popular }: { initial: string; popular: string[] }) {
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Suggest | null>(null);
  const [active, setActive] = useState(-1);
  const abort = useRef<AbortController | null>(null);
  const recent = useSyncExternalStore(() => () => {}, readRecentSearches, () => noRecent);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const t = setTimeout(async () => {
      abort.current?.abort();
      abort.current = new AbortController();
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(term)}`, { signal: abort.current.signal });
        if (res.ok) setData(await res.json());
      } catch {
        // Aborted or offline: keep the last suggestions.
      }
    }, 150);
    return () => clearTimeout(t);
  }, [q]);

  const showSuggest = open && q.trim().length >= 2 && data !== null;
  const options = showSuggest ? [...data.categories.map((c) => ({ href: c.href, label: c.name })), ...data.products.map((p) => ({ href: `/p/${p.slug}`, label: p.name }))] : [];

  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    saveRecentSearch(t);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  return (
    <div className="bg-paper border-b border-line py-8 max-sm:py-5">
      <div className="wrap">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (active >= 0 && options[active]) router.push(options[active].href);
            else go(q);
          }}
          className="relative flex gap-2"
        >
          <label htmlFor="search-q" className="sr-only">Search Folk &amp; Form</label>
          <input
            id="search-q"
            type="search"
            role="combobox"
            aria-expanded={showSuggest}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            autoComplete="off"
            placeholder="Search shirts, trousers, linen…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, options.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, -1));
              } else if (e.key === "Escape") setOpen(false);
            }}
            className="flex-1 min-h-14 px-4 border border-field bg-white rounded-[2px] serif text-[22px] max-sm:text-lg"
          />
          <button type="submit" className={buttonClass("solid", false, "min-h-14")}>Search</button>

          {showSuggest && (
            <div id={listId} role="listbox" aria-label="Suggestions" className="absolute z-20 top-full left-0 right-0 sm:right-[120px] mt-1 bg-paper border border-line rounded-[4px] shadow-[0_8px_30px_rgba(38,37,31,.12)] py-2">
              {options.length === 0 && <p className="px-4 py-3 text-sm text-muted">No suggestions — press Search to look anyway.</p>}
              {data.categories.map((c, i) => (
                <Link key={c.href} id={`${listId}-${i}`} role="option" aria-selected={active === i} href={c.href} className={`flex px-4 min-h-11 items-center text-sm ${active === i ? "bg-cream" : ""}`}>
                  <span className="eyebrow mr-3">Category</span> {c.name}
                </Link>
              ))}
              {data.products.map((p, j) => {
                const i = data.categories.length + j;
                return (
                  <Link key={p.slug} id={`${listId}-${i}`} role="option" aria-selected={active === i} href={`/p/${p.slug}`} onClick={() => saveRecentSearch(q.trim())} className={`flex gap-3 px-4 py-2 items-center ${active === i ? "bg-cream" : ""}`}>
                    <span className="relative w-10 h-12 bg-sand shrink-0">
                      <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="flex-1 text-sm">{p.name}<span className="block text-[12px] text-muted">{p.note}</span></span>
                    <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
          {recent.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1">Recent</span>
              {recent.map((r) => (
                <button key={r} type="button" onClick={() => go(r)} className={chipClass(false)}>{r}</button>
              ))}
            </div>
          )}
          {popular.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1">Popular</span>
              {popular.map((r) => (
                <button key={r} type="button" onClick={() => go(r)} className={chipClass(false)}>{r}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
