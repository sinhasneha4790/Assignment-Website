"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/format";
import { MINICART_EVENT, type MiniCartDetail } from "@/lib/ui-events";

/** Right-side drawer that opens after add-to-bag. */
export function MiniCart() {
  const ref = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<MiniCartDetail | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setData((e as CustomEvent<MiniCartDetail>).detail);
      if (!ref.current?.open) ref.current?.showModal();
    };
    window.addEventListener(MINICART_EVENT, onOpen);
    return () => window.removeEventListener(MINICART_EVENT, onOpen);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-label="Added to bag"
      onClick={(e) => e.target === ref.current && close()}
      className="ml-auto mr-0 my-0 h-dvh max-h-dvh w-[420px] max-w-[92vw] bg-paper text-ink p-0 backdrop:bg-ink/40"
    >
      {data && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 h-16 border-b border-line">
            <h2 className="serif text-[24px]">Added to bag</h2>
            <button type="button" aria-label="Close" onClick={close} className="w-11 h-11 inline-flex items-center justify-center cursor-pointer">
              <CloseIcon />
            </button>
          </div>
          <div className="p-6 flex gap-4 border-b border-line">
            <div className="relative w-24 aspect-[3/4] bg-sand shrink-0">
              <Image src={data.item.image} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{data.item.name}</span>
              <span className="text-[13px] text-muted">{data.item.colour} · Size {data.item.size}</span>
              <span className="font-semibold">{formatPrice(data.item.price)}</span>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-3 mt-auto">
            <div className="flex justify-between font-semibold">
              <span>Bag subtotal ({data.count} {data.count === 1 ? "item" : "items"})</span>
              <span>{formatPrice(data.subtotal)}</span>
            </div>
            <Link href="/cart" onClick={close} className={buttonClass("solid", true)}>View bag &amp; checkout</Link>
            <button type="button" onClick={close} className={buttonClass("outline", true)}>Continue shopping</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
