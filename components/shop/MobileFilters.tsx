"use client";

import { useRef, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";

/** Phone: filters open in a bottom sheet. */
export function MobileFilters({ count, total, children }: { count: number; total: number; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <div className="md:hidden">
      <button type="button" onClick={() => ref.current?.showModal()} className={buttonClass("outline", true)}>
        Filters{count ? ` (${count})` : ""}
      </button>
      <dialog
        ref={ref}
        aria-label="Filters"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="mt-auto mb-0 mx-0 w-full max-w-full max-h-[85dvh] bg-paper text-ink p-0 rounded-t-[12px] backdrop:bg-ink/40"
      >
        <div className="sticky top-0 bg-paper flex items-center justify-between px-4 h-14 border-b border-line z-10">
          <h2 className="font-semibold">Filters</h2>
          <button type="button" aria-label="Close filters" onClick={() => ref.current?.close()} className="w-11 h-11 inline-flex items-center justify-center cursor-pointer">
            <CloseIcon />
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="sticky bottom-0 bg-paper border-t border-line p-4">
          <button type="button" onClick={() => ref.current?.close()} className={buttonClass("solid", true)}>
            Show {total} {total === 1 ? "result" : "results"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
