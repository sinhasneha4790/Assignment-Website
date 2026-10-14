"use client";

import { useListingUrl } from "./useListingUrl";

type Chip = { label: string; key: string; value?: string };

/** Removable chips for the active filters, with "Clear all". */
export function ActiveFilters({ savedSize }: { savedSize: string | null }) {
  const { params, getList, update } = useListingUrl();
  const chips: Chip[] = [];
  const sizes = params.get("size") === null ? (savedSize ? [savedSize] : []) : getList("size");
  sizes.forEach((s) => chips.push({ label: `Size: ${s}`, key: "size", value: s }));
  getList("line").forEach((l) => chips.push({ label: l === "professional" ? "Professional" : "Casual", key: "line", value: l }));
  getList("colour").forEach((c) => chips.push({ label: c, key: "colour", value: c }));
  if (params.get("min") || params.get("max")) chips.push({ label: `₹${params.get("min") ?? "0"} – ₹${params.get("max") ?? "…"}`, key: "price" });
  getList("fabric").forEach((f) => chips.push({ label: f, key: "fabric", value: f }));
  getList("fit").forEach((f) => chips.push({ label: `${f} fit`, key: "fit", value: f }));
  getList("occasion").forEach((o) => chips.push({ label: o, key: "occasion", value: o }));
  if (params.get("instock") === "1") chips.push({ label: "In stock", key: "instock" });
  if (params.get("sale") === "1") chips.push({ label: "On sale", key: "sale" });
  if (!chips.length) return null;

  const remove = (c: Chip) => {
    if (c.key === "price") return update({ min: null, max: null });
    if (!c.value) return update({ [c.key]: null });
    const cur = c.key === "size" ? sizes : getList(c.key);
    const next = cur.filter((v) => v !== c.value);
    // Removing the last size writes an explicit empty value so the saved size isn't re-applied.
    update({ [c.key]: next.length ? next.join(",") : c.key === "size" ? "" : null });
  };

  const clearAll = () =>
    update({ size: savedSize ? "" : null, line: null, colour: null, min: null, max: null, fabric: null, fit: null, occasion: null, instock: null, sale: null });

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((c) => (
        <button key={`${c.key}-${c.value ?? ""}`} type="button" onClick={() => remove(c)} aria-label={`Remove filter ${c.label}`} className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-full bg-ink text-paper text-[13px] font-medium cursor-pointer hover:bg-olive">
          {c.label} <span aria-hidden>×</span>
        </button>
      ))}
      <button type="button" onClick={clearAll} className="text-[13px] underline min-h-10 px-1 cursor-pointer">Clear all</button>
    </div>
  );
}
