"use client";

import { useState, type ReactNode } from "react";
import { SizeButton } from "@/components/ui/SizeButton";
import { chipClass } from "@/components/ui/Chip";
import type { Facets } from "@/lib/catalog";
import { cx } from "@/lib/cx";
import { setClientCookie, YEAR } from "@/lib/client-cookie";
import { isSavableSize, SAVED_SIZE_COOKIE } from "@/lib/listing-params";
import { useListingUrl } from "./useListingUrl";

function Group({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-6 mb-6 last:border-0 min-w-0">
      <legend className="flex justify-between w-full font-semibold text-[15px] mb-3">
        <span>{title}</span>
        {aside}
      </legend>
      {children}
    </fieldset>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium min-h-9 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-[18px] h-[18px]" />
      {label}
    </label>
  );
}

/** Listing filters; every change is written to the URL so results are shareable. */
export function FilterPanel({ facets, savedSize, showLine }: { facets: Facets; savedSize: string | null; showLine: boolean }) {
  const { params, getList, update, toggle } = useListingUrl();
  const sizeParam = params.get("size");
  const sizes = sizeParam === null ? (savedSize ? [savedSize] : []) : getList("size");
  const lines = getList("line").map((l) => l.toUpperCase());
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  const toggleSize = (s: string) => {
    const next = sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s];
    // A single chosen size becomes the saved size (until profiles take over in phase 4).
    if (next.length === 1 && isSavableSize(next[0]!)) setClientCookie(SAVED_SIZE_COOKIE, next[0]!, YEAR);
    update({ size: next.join(",") });
  };

  const applyPrice = () => update({ min: /^\d+$/.test(min) ? min : null, max: /^\d+$/.test(max) ? max : null });

  return (
    <div>
      {facets.sizes.length > 0 && (
        <Group title="Size" aside={savedSize ? <span className="text-[13px] text-muted font-normal">Saved: {savedSize}</span> : undefined}>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <SizeButton key={s} selected={sizes.includes(s)} onClick={() => toggleSize(s)} className="min-w-[44px]! min-h-10!">
                {s}
              </SizeButton>
            ))}
          </div>
        </Group>
      )}

      {showLine && facets.lines.length > 1 && (
        <Group title="Line">
          {facets.lines.map((l) => (
            <Check key={l} label={l === "PROFESSIONAL" ? "Professional" : "Casual"} checked={lines.includes(l)} onChange={() => toggle("line", l.toLowerCase())} />
          ))}
        </Group>
      )}

      {facets.colours.length > 0 && (
        <Group title="Colour">
          <div className="flex flex-wrap gap-2.5">
            {facets.colours.map((c) => {
              const on = getList("colour").includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  aria-pressed={on}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => toggle("colour", c.name)}
                  className={cx("w-11 h-11 rounded-full inline-flex items-center justify-center cursor-pointer", on && "ring-2 ring-ink ring-offset-2 ring-offset-cream")}
                >
                  <span className="w-7 h-7 rounded-full border border-ink/15" style={{ background: c.hex }} />
                </button>
              );
            })}
          </div>
        </Group>
      )}

      <Group title="Price">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyPrice();
          }}
        >
          <label className="sr-only" htmlFor="price-min">Minimum price in rupees</label>
          <input id="price-min" inputMode="numeric" placeholder={`₹ ${facets.priceMin.toLocaleString("en-IN")}`} value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} onBlur={applyPrice} className="w-full min-h-12 px-3 border border-field bg-white rounded-[2px]" />
          <span aria-hidden className="text-muted">–</span>
          <label className="sr-only" htmlFor="price-max">Maximum price in rupees</label>
          <input id="price-max" inputMode="numeric" placeholder={`₹ ${facets.priceMax.toLocaleString("en-IN")}`} value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} onBlur={applyPrice} className="w-full min-h-12 px-3 border border-field bg-white rounded-[2px]" />
          <button type="submit" className="sr-only">Apply price</button>
        </form>
      </Group>

      {facets.fabrics.length > 0 && (
        <Group title="Fabric">
          {facets.fabrics.map((f) => (
            <Check key={f} label={f} checked={getList("fabric").includes(f)} onChange={() => toggle("fabric", f)} />
          ))}
        </Group>
      )}

      {facets.fits.length > 0 && (
        <Group title="Fit">
          <div className="flex flex-wrap gap-2">
            {facets.fits.map((f) => (
              <button key={f} type="button" aria-pressed={getList("fit").includes(f)} onClick={() => toggle("fit", f)} className={chipClass(getList("fit").includes(f))}>
                {f}
              </button>
            ))}
          </div>
        </Group>
      )}

      {facets.occasions.length > 0 && (
        <Group title="Occasion">
          {facets.occasions.map((o) => (
            <Check key={o} label={o} checked={getList("occasion").includes(o)} onChange={() => toggle("occasion", o)} />
          ))}
        </Group>
      )}

      <div className="flex flex-col gap-3">
        <Check label={sizes.length ? "In stock in my size" : "In stock"} checked={params.get("instock") === "1"} onChange={() => update({ instock: params.get("instock") === "1" ? null : "1" })} />
        <Check label="On sale" checked={params.get("sale") === "1"} onChange={() => update({ sale: params.get("sale") === "1" ? null : "1" })} />
      </div>
    </div>
  );
}
