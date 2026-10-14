"use client";

import { BAG_EVENT } from "@/lib/bag-count";

/** Tiny event bus between islands (add-to-bag → mini-cart, header count, toasts). */
export const TOAST_EVENT = "ff:toast";
export const MINICART_EVENT = "ff:minicart";

export type ToastDetail = { message: string; tone?: "good" | "error" };
export type MiniCartDetail = { count: number; subtotal: number; item: { name: string; colour: string; size: string; image: string; price: number } };

export function toast(message: string, tone: ToastDetail["tone"] = "good") {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message, tone } }));
}

export function openMiniCart(detail: MiniCartDetail) {
  window.dispatchEvent(new Event(BAG_EVENT));
  window.dispatchEvent(new CustomEvent<MiniCartDetail>(MINICART_EVENT, { detail }));
}

export function bagChanged() {
  window.dispatchEvent(new Event(BAG_EVENT));
}
