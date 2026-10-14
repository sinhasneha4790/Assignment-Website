"use client";

/** Sets a non-sensitive, browser-readable cookie (saved size, wishlist, consent). */
export function setClientCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function readClientCookie(name: string): string | undefined {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!m) return undefined;
  try {
    return decodeURIComponent(m[1]!);
  } catch {
    return undefined;
  }
}

export const YEAR = 60 * 60 * 24 * 365;
