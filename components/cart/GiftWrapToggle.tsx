"use client";

import { useOptimistic, useTransition } from "react";
import { setGiftWrap } from "@/app/actions/cart";

export function GiftWrapToggle({ on, fee }: { on: boolean; fee: string }) {
  const [optimistic, setOptimistic] = useOptimistic(on);
  const [, start] = useTransition();
  return (
    <label className="flex items-center gap-3 text-[15px] min-h-11 cursor-pointer">
      <input
        type="checkbox"
        checked={optimistic}
        onChange={(e) => {
          const next = e.target.checked;
          start(async () => {
            setOptimistic(next);
            await setGiftWrap(next);
          });
        }}
        className="w-[18px] h-[18px]"
      />
      Add gift wrap with a handwritten note (+{fee})
    </label>
  );
}
