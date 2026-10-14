"use client";

import { useState, useTransition } from "react";
import { moveToWishlist, removeItem, updateQty } from "@/app/actions/cart";
import { bagChanged, toast } from "@/lib/ui-events";

/** Quantity stepper (min 1), Move to wishlist and Remove for one bag line. */
export function CartLineControls({ itemId, qty, max, name }: { itemId: string; qty: number; max: number; name: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ error?: string } | void>, done?: string) =>
    start(async () => {
      const res = await fn();
      if (res && res.error) {
        setError(res.error);
        return;
      }
      setError(null);
      bagChanged();
      if (done) toast(done);
    });

  const btn = "w-11 h-11 inline-flex items-center justify-center text-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-center gap-6 flex-wrap ${pending ? "opacity-60" : ""}`}>
        <div className="inline-flex items-center border border-field bg-white rounded-[2px]" role="group" aria-label={`Quantity of ${name}`}>
          <button type="button" className={btn} aria-label="Decrease quantity" disabled={pending || qty <= 1} onClick={() => run(() => updateQty(itemId, qty - 1))}>−</button>
          <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
          <button type="button" className={btn} aria-label="Increase quantity" disabled={pending || qty >= max} onClick={() => run(() => updateQty(itemId, qty + 1))}>+</button>
        </div>
        <button type="button" disabled={pending} onClick={() => run(() => moveToWishlist(itemId), "Moved to your wishlist")} className="text-[13px] underline min-h-11 cursor-pointer">Move to wishlist</button>
        <button type="button" disabled={pending} onClick={() => run(() => removeItem(itemId), `${name} removed`)} className="text-[13px] underline text-muted min-h-11 cursor-pointer">Remove</button>
      </div>
      {error && <p role="alert" className="text-[13px] text-clay">{error}</p>}
    </div>
  );
}
