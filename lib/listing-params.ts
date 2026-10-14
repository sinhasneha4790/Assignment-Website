/**
 * Listing filters live in the URL so results are shareable. This module is
 * shared by the server (parsing) and the client filter panel (writing).
 */

export const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating", label: "Best rated" },
] as const;

export type Sort = (typeof SORTS)[number]["value"];
export type LineParam = "PROFESSIONAL" | "CASUAL";

export const PAGE_SIZE = 12;

export type ListingFilters = {
  /** null = no size filter chosen; [] = explicitly cleared (ignore saved size). */
  sizes: string[] | null;
  lines: LineParam[];
  colours: string[];
  /** Rupees, as typed by the shopper. */
  priceMin: number | null;
  priceMax: number | null;
  fabrics: string[];
  fits: string[];
  occasions: string[];
  inStock: boolean;
  onSale: boolean;
  sort: Sort;
  page: number;
};

export type RawParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) =>
  (one(v) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
const int = (v: string | string[] | undefined) => {
  const n = Number.parseInt(one(v) ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseListingParams(sp: RawParams): ListingFilters {
  const sizeRaw = one(sp.size);
  const sort = one(sp.sort);
  return {
    sizes: sizeRaw === undefined ? null : list(sizeRaw),
    lines: list(sp.line)
      .map((l) => l.toUpperCase())
      .filter((l): l is LineParam => l === "PROFESSIONAL" || l === "CASUAL"),
    colours: list(sp.colour),
    priceMin: int(sp.min),
    priceMax: int(sp.max),
    fabrics: list(sp.fabric),
    fits: list(sp.fit),
    occasions: list(sp.occasion),
    inStock: one(sp.instock) === "1",
    onSale: one(sp.sale) === "1",
    sort: SORTS.some((s) => s.value === sort) ? (sort as Sort) : "recommended",
    page: Math.min(Math.max(int(sp.page) ?? 1, 1), 50),
  };
}

/** The sizes actually filtered on: explicit choice, else the shopper's saved size. */
export function effectiveSizes(f: ListingFilters, savedSize: string | null): string[] {
  if (f.sizes !== null) return f.sizes;
  return savedSize ? [savedSize] : [];
}

/** Number of active filters (for the mobile "Filters (n)" button). */
export function activeFilterCount(f: ListingFilters, savedSize: string | null): number {
  return (
    (effectiveSizes(f, savedSize).length ? 1 : 0) +
    f.lines.length +
    f.colours.length +
    (f.priceMin !== null || f.priceMax !== null ? 1 : 0) +
    f.fabrics.length +
    f.fits.length +
    f.occasions.length +
    (f.inStock ? 1 : 0) +
    (f.onSale ? 1 : 0)
  );
}

/** Cookie holding the shopper's saved size until accounts and profiles exist. */
export const SAVED_SIZE_COOKIE = "ff_saved_size";

const LETTER_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
/** Only letter (top) sizes are remembered; waist and shoe sizes join the family profile in phase 4. */
export const isSavableSize = (s: string) => LETTER_SIZES.includes(s);
