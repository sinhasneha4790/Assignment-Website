"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { CarouselSlide } from "@/lib/content";
import { cx } from "@/lib/cx";

const INTERVAL_MS = 4500;

const roundBtn =
  "absolute z-10 w-12 h-12 max-sm:w-11 max-sm:h-11 rounded-full border border-ink bg-paper/90 text-ink cursor-pointer inline-flex items-center justify-center hover:bg-paper";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Home hero: auto-advances every 4.5 s, pauses on hover and keyboard focus,
 * has pause/play, previous/next and dots, and never auto-advances under reduced motion.
 */
export function HeroCarousel({ slides }: { slides: CarouselSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);
  const playing = !paused && !reducedMotion;

  useEffect(() => {
    if (!playing || hovered || focused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [playing, hovered, focused, count]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "ArrowRight") go(index + 1);
    else return;
    e.preventDefault();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      onKeyDown={onKeyDown}
      className="relative overflow-hidden h-[560px] mb-[72px] bg-sand max-sm:h-[640px] max-sm:mb-12"
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${-index * 100}%)` }}
        aria-live={playing ? "off" : "polite"}
      >
        {slides.map((s, k) => {
          const active = k === index;
          return (
            <div
              key={k}
              role="group"
              aria-roledescription="slide"
              aria-label={`${k + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className="flex-[0_0_100%] h-full flex max-sm:flex-col-reverse"
              style={{ background: s.bg }}
            >
              <div className="flex-[1_1_50%] min-w-0 flex flex-col justify-center gap-5 py-12 pr-12 pl-24 max-sm:flex-auto max-sm:justify-start max-sm:gap-3 max-sm:pt-5 max-sm:px-5 max-sm:pb-[88px]">
                <div className="eyebrow">{s.eyebrow}</div>
                <h2 className="serif text-[56px] leading-[1.04] max-sm:text-[30px] max-sm:leading-[1.1]">{s.title}</h2>
                <p className="text-muted text-[17px] max-w-[440px] max-sm:text-[15px]">{s.text}</p>
                <div className="flex gap-3 flex-wrap">
                  <ButtonLink href={s.cta.href}>{s.cta.label}</ButtonLink>
                  <ButtonLink href={s.cta2.href} variant="outline">{s.cta2.label}</ButtonLink>
                </div>
              </div>
              <ImageFrame
                src={s.image}
                alt={s.alt}
                caption={s.tag}
                sizes="(max-width: 760px) 100vw, 50vw"
                priority={k === 0}
                className="flex-[1_1_50%] min-w-0 h-full max-sm:flex-[0_0_280px] max-sm:h-[280px]"
              />
            </div>
          );
        })}
      </div>

      <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className={cx(roundBtn, "left-5 top-1/2 -translate-y-1/2 max-sm:top-[140px] text-[22px]")}>
        ‹
      </button>
      <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className={cx(roundBtn, "right-5 top-1/2 -translate-y-1/2 max-sm:top-[140px] text-[22px]")}>
        ›
      </button>

      <div className="absolute left-24 bottom-7 flex items-center gap-2 max-sm:left-5 max-sm:bottom-5">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="w-11 h-11 rounded-full border border-ink bg-paper/90 text-ink text-xs cursor-pointer mr-1.5"
        >
          <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
        </button>
        {slides.map((_, k) => (
          // 44 px hit area around the 10 px dot
          <button
            key={k}
            type="button"
            onClick={() => go(k)}
            aria-label={`Go to slide ${k + 1}`}
            aria-current={k === index}
            className="h-11 flex items-center cursor-pointer px-0.5"
          >
            <span className={cx("block h-2.5 rounded-[5px] transition-[width] duration-300", k === index ? "w-7 bg-ink" : "w-2.5 bg-ink/30")} />
          </button>
        ))}
      </div>
    </section>
  );
}
