/**
 * Guest wishlist: product slugs in a cookie, merged into the account wishlist
 * on login (phase 4). Readable by the browser so the heart toggles instantly.
 */
export const WISHLIST_COOKIE = "ff_wishlist";
export const WISHLIST_MAX = 50;

export function parseWishlist(value: string | undefined | null): string[] {
  return (value ?? "")
    .split(".")
    .filter((s) => /^[a-z0-9-]{1,80}$/.test(s))
    .slice(0, WISHLIST_MAX);
}

export function serialiseWishlist(slugs: string[]): string {
  return [...new Set(slugs)].slice(-WISHLIST_MAX).join(".");
}

type CookieJar = { get(name: string): { value: string } | undefined; set(name: string, value: string, opts: object): unknown };

export async function addToWishlistCookie(jar: CookieJar, slug: string) {
  const slugs = parseWishlist(jar.get(WISHLIST_COOKIE)?.value);
  jar.set(WISHLIST_COOKIE, serialiseWishlist([...slugs, slug]), { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 180 });
}
