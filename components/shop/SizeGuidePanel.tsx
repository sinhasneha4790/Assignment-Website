"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import type { SizeChartData } from "@/lib/product";
import { SizeGuide, type ProductFit } from "./SizeGuide";

/**
 * Right-side size-guide drawer over the product page. Opening pushes a
 * history entry so the browser Back button closes it.
 */
export function useSizeGuidePanel() {
  const [open, setOpen] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    const onPop = () => {
      if (pushed.current) {
        pushed.current = false;
        setOpen(false);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const show = useCallback(() => {
    window.history.pushState({ ...window.history.state, sizeGuide: true }, "");
    pushed.current = true;
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    if (pushed.current) window.history.back(); // popstate closes it
    else setOpen(false);
  }, []);

  return { open, show, hide };
}

export function SizeGuidePanel({ open, onClose, charts, hub, savedSize, product }: { open: boolean; onClose: () => void; charts: SizeChartData[]; hub: string; savedSize: string | null; product: ProductFit }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="size-guide-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className="ml-auto mr-0 my-0 h-dvh max-h-dvh w-[600px] max-w-full bg-paper text-ink p-0 backdrop:bg-ink/50"
    >
      <div className="p-8 max-sm:p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 id="size-guide-title" className="serif text-[34px]">Size guide</h2>
          <button type="button" aria-label="Close size guide" onClick={onClose} className="w-11 h-11 inline-flex items-center justify-center cursor-pointer">
            <CloseIcon />
          </button>
        </div>
        {open && <SizeGuide charts={charts} initialHub={hub} savedSize={savedSize} product={product} headingLevel={3} />}
      </div>
    </dialog>
  );
}
