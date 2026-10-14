"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { chipClass } from "@/components/ui/Chip";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { ProductCardData } from "@/lib/content";
import { Breadcrumb } from "./Breadcrumb";
import { ProductCard } from "./ProductCard";

export type HubLineData = {
  key: "professional" | "casual" | "all";
  label: string;
  eyebrow: string;
  intro: string;
  image: string;
  alt: string;
  caption: string;
  categories: { name: string; image: string; href: string }[];
  trending: ProductCardData[];
  allHref: string;
};

/**
 * Hub: hero with Professional / Casual switch. The switch swaps intro, hero
 * image, categories and trending without a reload and updates ?line= in the URL.
 */
export function HubView({ hubSlug, hubName, lines, initialLine, occasions }: { hubSlug: string; hubName: string; lines: HubLineData[]; initialLine: HubLineData["key"]; occasions: string[] }) {
  const [key, setKey] = useState(initialLine);
  const data = lines.find((l) => l.key === key) ?? lines[0]!;

  const choose = (k: HubLineData["key"]) => {
    setKey(k);
    const url = new URL(window.location.href);
    if (k === lines[0]!.key) url.searchParams.delete("line");
    else url.searchParams.set("line", k);
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <div className="pb-[72px]">
      <div className="wrap">
        <Breadcrumb items={[{ label: hubName }]} />
      </div>

      <section className="wrap grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-12 items-center pb-14 max-md:grid-cols-1 max-md:gap-6">
        <div className="flex flex-col gap-5 max-md:order-2">
          <div className="eyebrow">{data.eyebrow}</div>
          <h1 className="serif text-[64px] leading-none max-sm:text-[42px]">{hubName}</h1>
          <p className="text-muted text-[17px] max-w-[420px]" aria-live="polite">{data.intro}</p>
          {lines.length > 1 && (
            <div role="group" aria-label="Line" className="flex gap-2">
              {lines.map((l) => (
                <button key={l.key} type="button" aria-pressed={l.key === key} onClick={() => choose(l.key)} className={chipClass(l.key === key, "px-5")}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <ImageFrame src={data.image} alt={data.alt} caption={data.caption} priority sizes="(max-width: 900px) 100vw, 640px" className="h-[420px] max-sm:h-[320px] max-md:order-1" />
      </section>

      <section className="wrap pb-14">
        <h2 className="serif text-4xl mb-6 max-sm:text-[26px]">Shop by category</h2>
        <ul className="grid-cards grid-cols-4 max-md:grid-cols-2">
          {data.categories.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="flex flex-col gap-3">
                <ImageFrame src={c.image} alt="" sizes="(max-width: 900px) 50vw, 280px" className="aspect-[6/5]" />
                <span className="font-semibold text-[15px]">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pb-14">
        <h2 className="serif text-4xl mb-6 max-sm:text-[26px]">Dress for the occasion</h2>
        <div className="flex flex-wrap gap-2.5">
          {occasions.map((o) => (
            <Link key={o} href={`${data.allHref}?occasion=${encodeURIComponent(o)}`} className={chipClass(false)}>
              {o}
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap pb-14">
        <div className="flex justify-between items-end mb-6">
          <h2 className="serif text-4xl max-sm:text-[26px]">Trending now</h2>
          <Link href={data.allHref} className="text-[13px] underline">View all</Link>
        </div>
        <ul className="grid-cards grid-cols-4 max-md:grid-cols-2 max-sm:gap-3!">
          {data.trending.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} showSwatches />
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap">
        <div className="bg-paper border border-line rounded-[4px] px-8 py-8 flex justify-between items-center gap-6 flex-wrap max-sm:p-5">
          <div>
            <h2 className="serif text-[26px]">Not sure of your size?</h2>
            <p className="text-muted text-sm mt-1">Charts in cm and inches, fit notes on every product, and a stylist on chat.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <ButtonLink href={`/size-guide?hub=${hubSlug}`} variant="outline">Size guide</ButtonLink>
            <ButtonLink href="/book?service=personal-styling">Book a fitting</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
