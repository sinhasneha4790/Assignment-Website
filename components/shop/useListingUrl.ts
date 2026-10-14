"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useOptimistic, useTransition } from "react";

/**
 * Reads and writes listing filters in the URL without scrolling; resets paging on change.
 * Controls reflect the new value immediately (optimistic) while the results load.
 */
export function useListingUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const committed = useSearchParams();
  const [query, setQuery] = useOptimistic(committed.toString());
  const [pending, startTransition] = useTransition();
  const params = useMemo(() => new URLSearchParams(query), [query]);

  const getList = useCallback((key: string) => (params.get(key) ?? "").split(",").filter(Boolean), [params]);

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(changes)) {
        if (v === null) next.delete(k);
        else next.set(k, v);
      }
      next.delete("page");
      const qs = next.toString();
      startTransition(() => {
        setQuery(qs);
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router, setQuery],
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const cur = getList(key);
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      update({ [key]: next.length ? next.join(",") : null });
    },
    [getList, update],
  );

  return { params, getList, update, toggle, pending };
}
