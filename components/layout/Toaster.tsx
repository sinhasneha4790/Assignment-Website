"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/ui-events";
import { cx } from "@/lib/cx";

type Toast = ToastDetail & { id: number };

/** Toasts for add/save/errors. Announced politely to screen readers. */
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let n = 0;
    const onToast = (e: Event) => {
      const t = { ...(e as CustomEvent<ToastDetail>).detail, id: ++n };
      setToasts((ts) => [...ts.slice(-2), t]);
      setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== t.id)), 4000);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div aria-live="polite" role="status" className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-6 max-sm:bottom-24 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={cx("px-5 py-3 rounded-[4px] text-sm font-semibold shadow-[0_8px_30px_rgba(38,37,31,.2)]", t.tone === "error" ? "bg-warn-bg text-warn-fg" : "bg-ink text-paper")}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
