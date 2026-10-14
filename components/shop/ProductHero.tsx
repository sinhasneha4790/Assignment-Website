"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { addToBag } from "@/app/actions/cart";
import { Button } from "@/components/ui/Button";
import { CloseIcon, HeartIcon } from "@/components/ui/Icons";
import { SizeButton } from "@/components/ui/SizeButton";
import { readClientCookie, setClientCookie, YEAR } from "@/lib/client-cookie";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import { isSavableSize, SAVED_SIZE_COOKIE } from "@/lib/listing-params";
import type { SizeChartData } from "@/lib/product";
import { pushRecent } from "@/lib/recently-viewed";
import { openMiniCart, toast } from "@/lib/ui-events";
import { parseWishlist, serialiseWishlist, WISHLIST_COOKIE } from "@/lib/wishlist";
import { PincodeCheck } from "./PincodeCheck";
import { SizeGuidePanel, useSizeGuidePanel } from "./SizeGuidePanel";

export type HeroProduct = {
  slug: string;
  name: string;
  eyebrow: string;
  hub: string;
  price: number;
  compareAtPrice: number | null;
  ratingAvg: number;
  ratingCount: number;
  fit: string | null;
  fitNote: string | null;
  modelInfo: string | null;
  colours: { id: string; name: string; hex: string }[];
  images: { url: string; alt: string; kind: string; colourId: string | null }[];
  variants: { id: string; colourId: string; size: string; available: number }[];
  sizes: string[];
};

const KIND_LABEL: Record<string, string> = { FRONT: "Front", DETAIL: "Close-up", MODEL: "On model", STYLED: "Styled", BACK: "Back" };

function readWishlist(): string[] {
  return parseWishlist(readClientCookie(WISHLIST_COOKIE));
}

function writeWishlist(slugs: string[]) {
  setClientCookie(WISHLIST_COOKIE, serialiseWishlist(slugs), YEAR / 2);
}

function Gallery({ images, name }: { images: HeroProduct["images"]; name: string }) {
  const [zoom, setZoom] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (zoom !== null && !ref.current?.open) ref.current?.showModal();
  }, [zoom]);

  const caption = (img: HeroProduct["images"][number]) => (img.kind === "MODEL" ? null : KIND_LABEL[img.kind]);

  return (
    <div>
      {/* Desktop: 2-column grid. Phone: swipeable strip with a counter. */}
      <ul
        ref={strip}
        aria-label={`${name} photos`}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="grid grid-cols-2 gap-3 max-sm:flex max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:gap-0 max-sm:-mx-4"
      >
        {images.map((img, i) => (
          <li key={`${img.url}-${img.kind}-${i}`} className="max-sm:snap-center max-sm:shrink-0 max-sm:w-full max-sm:px-4">
            <button type="button" onClick={() => setZoom(i)} aria-label={`Zoom: ${img.alt}`} className="block w-full cursor-zoom-in">
              <div className="relative aspect-[3/4] bg-sand overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  priority={i < 2}
                  sizes="(max-width: 760px) 100vw, 340px"
                  className={cx("object-cover", img.kind === "DETAIL" && "scale-[2.2] origin-[50%_40%]")}
                />
                {caption(img) && <span className="absolute left-3 bottom-3 bg-paper/90 text-xs font-semibold px-2.5 py-1">{caption(img)}</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <p className="sm:hidden text-center text-[13px] text-muted mt-2" aria-live="polite">
        {index + 1} / {images.length}
      </p>

      <dialog
        ref={ref}
        aria-label="Photo zoom"
        onClose={() => setZoom(null)}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(92vw,900px)] h-[min(92dvh,1200px)] max-w-none max-h-none bg-sand p-0 backdrop:bg-ink/70"
      >
        {zoom !== null && images[zoom] && (
          <div className="relative w-full h-full">
            <Image src={images[zoom].url} alt={images[zoom].alt} fill sizes="92vw" className="object-contain" />
            <button type="button" aria-label="Close zoom" onClick={() => ref.current?.close()} className="absolute top-3 right-3 w-11 h-11 rounded-full bg-paper inline-flex items-center justify-center cursor-pointer">
              <CloseIcon />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={() => setZoom((zoom - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-paper text-xl cursor-pointer">‹</button>
                <button type="button" aria-label="Next photo" onClick={() => setZoom((zoom + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-paper text-xl cursor-pointer">›</button>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

/** Gallery + purchase panel. Colour swatches switch the gallery; the size guide opens beside the size buttons. */
export function ProductHero({ product, charts, savedSize, details }: { product: HeroProduct; charts: SizeChartData[]; savedSize: string | null; details: ReactNode }) {
  const router = useRouter();
  const [colourId, setColourId] = useState(product.colours[0]?.id ?? "");
  const colour = product.colours.find((c) => c.id === colourId);
  const sizeFor = (cid: string, s: string) => product.variants.find((v) => v.colourId === cid && v.size === s);
  const initialSize = savedSize && (sizeFor(colourId, savedSize)?.available ?? 0) > 0 ? savedSize : product.sizes.length === 1 ? product.sizes[0]! : null;
  const [size, setSize] = useState<string | null>(initialSize);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const guide = useSizeGuidePanel();

  useEffect(() => {
    // Hydration-safe read of the browser-only wishlist cookie.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(readWishlist().includes(product.slug));
    pushRecent({ slug: product.slug, name: product.name, image: product.images[0]?.url ?? "", price: product.price });
  }, [product.slug, product.name, product.images, product.price]);

  const images = useMemo(() => product.images.filter((i) => i.colourId === null || i.colourId === colourId), [product.images, colourId]);
  const soldOut = product.sizes.filter((s) => (sizeFor(colourId, s)?.available ?? 0) <= 0);
  const variant = size ? sizeFor(colourId, size) : undefined;

  const pickSize = (s: string) => {
    setSize(s);
    setError(null);
    if (isSavableSize(s)) setClientCookie(SAVED_SIZE_COOKIE, s, YEAR);
  };

  const add = (then?: () => void) => {
    if (!variant || variant.available <= 0) {
      setError("Please choose a size.");
      document.getElementById("size-buttons")?.focus();
      return;
    }
    startTransition(async () => {
      const res = await addToBag({ variantId: variant.id });
      if (!res.ok) {
        setError(res.error);
        toast(res.error, "error");
        return;
      }
      if (then) then();
      else openMiniCart({ count: res.count, subtotal: res.subtotal, item: res.item });
    });
  };

  const toggleWishlist = () => {
    const list = readWishlist();
    const on = !list.includes(product.slug);
    writeWishlist(on ? [...list, product.slug] : list.filter((s) => s !== product.slug));
    setSaved(on);
    toast(on ? "Saved to your wishlist" : "Removed from your wishlist");
  };

  const notifyMe = () => {
    const list = readWishlist();
    if (!list.includes(product.slug)) writeWishlist([...list, product.slug]);
    setSaved(true);
    toast("Saved to your wishlist — sign in to get a back-in-stock alert");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 max-md:grid-cols-1 max-md:gap-6">
      <Gallery images={images} name={product.name} />

      <div className="flex flex-col gap-5">
        <div>
          <div className="eyebrow mb-2">{product.eyebrow}</div>
          <h1 className="serif text-[40px] leading-tight max-sm:text-[30px]">{product.name}</h1>
          <div className="flex items-baseline gap-3 mt-2 flex-wrap">
            <span className="text-[22px] font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-muted line-through">
                <span className="sr-only">was </span>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-[13px] text-muted">Incl. of all taxes</span>
            {product.ratingCount > 0 && (
              <a href="#reviews" className="text-[13px] underline">
                ★ {product.ratingAvg.toFixed(1)} · {product.ratingCount} {product.ratingCount === 1 ? "review" : "reviews"}
              </a>
            )}
          </div>
        </div>

        {product.colours.length > 0 && (
          <fieldset>
            <legend className="text-sm mb-2">
              Colour: <span className="font-semibold">{colour?.name}</span>
            </legend>
            <div className="flex gap-2.5">
              {product.colours.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={c.id === colourId}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setColourId(c.id)}
                  className={cx("w-11 h-11 rounded-full inline-flex items-center justify-center cursor-pointer", c.id === colourId && "ring-2 ring-ink ring-offset-2 ring-offset-cream")}
                >
                  <span className="w-8 h-8 rounded-full border border-ink/15" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <div className="flex justify-between items-baseline mb-2">
            <legend className="text-sm">
              Size: <span className="font-semibold">{size ?? "choose"}</span>
            </legend>
            {product.sizes.length > 1 && (
              <button type="button" onClick={guide.show} className="text-[13px] font-semibold underline cursor-pointer min-h-11 px-1">
                Size guide
              </button>
            )}
          </div>
          <div id="size-buttons" tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
            {product.sizes.map((s) => {
              const v = sizeFor(colourId, s);
              return (
                <SizeButton key={s} selected={size === s} soldOut={!v || v.available <= 0} onClick={() => pickSize(s)}>
                  {s}
                </SizeButton>
              );
            })}
          </div>
          <p className="text-[13px] text-muted mt-2">
            {product.fitNote}
            {soldOut.length > 0 && (
              <>
                {" · "}
                {soldOut.join(", ")} sold out —{" "}
                <button type="button" onClick={notifyMe} className="underline text-ink cursor-pointer">notify me</button>
              </>
            )}
          </p>
          {variant && variant.available > 0 && variant.available <= 3 && <p className="text-[13px] text-clay mt-1">Only {variant.available} left in {size}</p>}
          {error && <p role="alert" className="text-[13px] text-clay mt-1">{error}</p>}
        </fieldset>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Button onClick={() => add()} disabled={pending} className="flex-1">
              {pending ? "Adding…" : "Add to bag"}
            </Button>
            <button type="button" onClick={toggleWishlist} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} className={cx("w-12 min-h-12 border border-ink rounded-[2px] inline-flex items-center justify-center cursor-pointer", saved && "bg-ink text-paper")}>
              <HeartIcon fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          {/* Checkout arrives in phase 3; until then Buy now goes to the bag. */}
          <Button variant="olive" block disabled={pending} onClick={() => add(() => router.push("/cart"))}>
            Buy now
          </Button>
        </div>

        <PincodeCheck />

        <ul className="grid grid-cols-3 gap-2 text-[12px] text-center max-sm:grid-cols-1">
          {["15-day easy returns", "Secure payment", "Free size exchange"].map((t) => (
            <li key={t} className="border border-line rounded-[4px] px-2 py-2.5 bg-paper">{t}</li>
          ))}
        </ul>

        {details}
      </div>

      <SizeGuidePanel open={guide.open} onClose={guide.hide} charts={charts} hub={product.hub} savedSize={size && isSavableSize(size) ? size : savedSize} product={{ fit: product.fit, fitNote: product.fitNote, modelInfo: product.modelInfo }} />
    </div>
  );
}
