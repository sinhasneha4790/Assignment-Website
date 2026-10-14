"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { chipClass } from "@/components/ui/Chip";
import type { SizeChartData } from "@/lib/product";
import { cx } from "@/lib/cx";
import Link from "next/link";

const toIn = (cm: number) => (cm / 2.54).toFixed(1).replace(/\.0$/, "");

export type ProductFit = { fit: string | null; fitNote: string | null; modelInfo: string | null };

/** Size guide tabs (Women / Men / Teens / conversion), cm ↔ inches, saved size highlighted. */
export function SizeGuide({ charts, initialHub, savedSize, product, headingLevel = 2 }: { charts: SizeChartData[]; initialHub: string; savedSize: string | null; product?: ProductFit; headingLevel?: 2 | 3 }) {
  const tops = charts.filter((c) => c.productType === "tops");
  const [tab, setTab] = useState(tops.some((c) => c.hub === initialHub) ? initialHub : (tops[0]?.hub ?? "conversion"));
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const chart = tops.find((c) => c.hub === tab);
  const H = `h${headingLevel}` as const;
  const v = (n: number | undefined) => (n === undefined ? "–" : unit === "cm" ? String(n) : toIn(n));
  const women = tops.find((c) => c.hub === "women");
  const men = tops.find((c) => c.hub === "men");

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Size charts" className="flex flex-wrap gap-2">
        {[...tops.map((c) => ({ key: c.hub, label: c.hubName })), { key: "conversion", label: "Size conversion" }].map((t) => (
          <button key={t.key} role="tab" type="button" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={chipClass(tab === t.key, "px-4")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H className="font-semibold text-[15px]">{chart ? chart.title : "International size conversion"}</H>
        {chart && (
          <div role="group" aria-label="Units" className="flex gap-1">
            <button type="button" aria-pressed={unit === "cm"} onClick={() => setUnit("cm")} className={chipClass(unit === "cm")}>cm</button>
            <button type="button" aria-pressed={unit === "in"} onClick={() => setUnit("in")} className={chipClass(unit === "in")}>inches</button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {chart ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs tracking-[0.08em] uppercase text-muted">
                <th className="font-semibold py-2.5 px-3 border-b border-line">Size</th>
                <th className="font-semibold py-2.5 px-3 border-b border-line">{chart.rows[0]?.bust !== undefined ? "Bust" : "Chest"} ({unit})</th>
                <th className="font-semibold py-2.5 px-3 border-b border-line">Waist ({unit})</th>
                <th className="font-semibold py-2.5 px-3 border-b border-line">Hip ({unit})</th>
                <th className="font-semibold py-2.5 px-3 border-b border-line">{chart.hub === "women" ? "UK / US" : chart.hub === "men" ? "Collar size" : "Age"}</th>
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((r) => {
                const mine = r.size === savedSize;
                return (
                  <tr key={r.size} className={cx(mine && "bg-olive-soft")} aria-current={mine ? "true" : undefined}>
                    <th scope="row" className="text-left font-bold py-3 px-3 border-b border-line">
                      {r.size}
                      {mine && <span className="sr-only"> (your saved size)</span>}
                    </th>
                    <td className="py-3 px-3 border-b border-line">{v(r.bust ?? r.chest)}</td>
                    <td className="py-3 px-3 border-b border-line">{v(r.waist)}</td>
                    <td className="py-3 px-3 border-b border-line">{v(r.hip)}</td>
                    <td className="py-3 px-3 border-b border-line">{r.intl}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs tracking-[0.08em] uppercase text-muted">
                <th className="font-semibold py-2.5 px-3 border-b border-line">Folk &amp; Form</th>
                <th className="font-semibold py-2.5 px-3 border-b border-line">Women UK / US</th>
                <th className="font-semibold py-2.5 px-3 border-b border-line">Men collar</th>
              </tr>
            </thead>
            <tbody>
              {(women ?? men)?.rows.map((r, i) => (
                <tr key={r.size} className={cx(r.size === savedSize && "bg-olive-soft")}>
                  <th scope="row" className="text-left font-bold py-3 px-3 border-b border-line">{r.size}</th>
                  <td className="py-3 px-3 border-b border-line">{women?.rows[i]?.intl ?? "–"}</td>
                  <td className="py-3 px-3 border-b border-line">{men?.rows[i]?.intl ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-[13px] text-muted">
        Body measurements, not garment measurements.{savedSize ? ` Your saved size (${savedSize}) is highlighted.` : ""}
      </p>

      <div className="border border-line rounded-[4px] p-5 flex gap-5 items-center max-sm:flex-col max-sm:items-start">
        <svg viewBox="0 0 96 120" width="96" height="120" role="img" aria-label="How to measure: bust, waist and hip" className="shrink-0 bg-ph-stone">
          <path d="M48 14a9 9 0 1 1 0 18a9 9 0 1 1 0-18zM34 36h28l6 30-6 2-2 18 6 26H30l6-26-2-18-6-2z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M28 48h40M32 66h32M28 84h40" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
        </svg>
        <ol className="list-decimal pl-5 text-sm flex flex-col gap-1.5">
          <li><b>Bust / chest:</b> around the fullest part, tape level.</li>
          <li><b>Waist:</b> around the narrowest part of your torso.</li>
          <li><b>Hip:</b> around the fullest part, feet together.</li>
        </ol>
      </div>

      {product && (
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div className="border border-line rounded-[4px] p-4">
            <div className="eyebrow mb-2">This product</div>
            <p className="text-sm">{[product.fitNote ?? product.fit, product.modelInfo].filter(Boolean).join(". ")}.</p>
          </div>
          <div className="border border-line rounded-[4px] p-4">
            <div className="eyebrow mb-2">Between sizes?</div>
            <p className="text-sm">Size up for a relaxed look, down for a closer fit.</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/contact" className={buttonClass("outline")}>Chat with us</Link>
        <Link href="/book?service=personal-styling" className={buttonClass("solid")}>Book a free fitting</Link>
      </div>
    </div>
  );
}
