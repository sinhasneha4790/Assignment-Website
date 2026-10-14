"use client";

import { SORTS } from "@/lib/listing-params";
import { useListingUrl } from "./useListingUrl";

export function SortSelect({ value }: { value: string }) {
  const { update } = useListingUrl();
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-[13px] font-semibold whitespace-nowrap max-sm:sr-only">Sort by</label>
      <select id="sort" value={value} onChange={(e) => update({ sort: e.target.value === "recommended" ? null : e.target.value })} className="min-h-12 px-3.5 pr-8 border border-field bg-white rounded-[2px] text-[15px] min-w-[200px] max-sm:min-w-0">
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
