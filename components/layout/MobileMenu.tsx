"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { mainNav } from "@/lib/nav";

/** Phone-only menu button and slide-in drawer (a modal <dialog>, so focus and Escape are handled natively). */
export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(true)} className="sm:hidden w-11 h-11 inline-flex items-center justify-center cursor-pointer">
        <MenuIcon size={22} />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        className="m-0 h-dvh max-h-dvh w-[86vw] max-w-sm bg-paper text-ink p-0 backdrop:bg-ink/40"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-line">
          <span className="serif text-[22px]">Folk &amp; Form</span>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="w-11 h-11 inline-flex items-center justify-center cursor-pointer">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)} className="flex flex-col px-4 py-2 text-base">
          {mainNav.map((item) => (
            <Link key={item.label} href={item.href} className={`min-h-12 flex items-center border-b border-line ${"sale" in item ? "text-clay" : ""}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/styling" className="min-h-12 flex items-center border-b border-line font-bold">Book a stylist</Link>
          <Link href="/account" className="min-h-12 flex items-center border-b border-line">Account</Link>
          <Link href="/help" className="min-h-12 flex items-center">Help</Link>
        </nav>
      </dialog>
    </>
  );
}
