"use client";

import { useActionState, useTransition } from "react";
import { applyCoupon, removeCoupon, type CouponState } from "@/app/actions/cart";
import { buttonClass } from "@/components/ui/Button";

export function CouponForm({ applied, error }: { applied: string | null; error: string | null }) {
  const [state, action, pending] = useActionState<CouponState, FormData>(applyCoupon, {});
  const [removing, start] = useTransition();

  if (applied && !error) {
    return (
      <div className="flex items-center justify-between gap-3 bg-olive-soft text-olive rounded-[2px] px-3.5 min-h-12 text-sm font-semibold">
        <span>{applied} applied</span>
        <button type="button" disabled={removing} onClick={() => start(() => removeCoupon())} className="underline cursor-pointer min-h-11">Remove</button>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <label htmlFor="coupon" className="sr-only">Coupon code</label>
        <input id="coupon" name="code" defaultValue={applied ?? ""} placeholder="Coupon code" autoCapitalize="characters" className="flex-1 min-w-0 min-h-12 px-3.5 border border-field bg-white rounded-[2px] uppercase placeholder:normal-case" />
        <button type="submit" disabled={pending} className={buttonClass("outline", false, "px-5")}>Apply</button>
      </div>
      <p aria-live="polite" className="text-[13px] min-h-5">
        {(state.error ?? error) && <span className="text-clay">{state.error ?? error}</span>}
        {state.ok && !error && <span className="text-olive">{state.ok}</span>}
      </p>
    </form>
  );
}
