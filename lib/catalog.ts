import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { ProductCardData } from "@/lib/content";
import { db } from "@/lib/db";
import { lineLabel } from "@/lib/format";
import { effectiveSizes, PAGE_SIZE, type ListingFilters } from "@/lib/listing-params";
import { searchProductIds } from "@/lib/search";
import { colourFamilies } from "@/prisma/seed-data";

export const HUB_SLUGS = ["women", "men", "teens"] as const;
export type HubSlugParam = (typeof HUB_SLUGS)[number];
export const isHubSlug = (s: string): s is HubSlugParam => (HUB_SLUGS as readonly string[]).includes(s);

export type LineSlug = "professional" | "casual" | "all";
export const lineFromSlug = (s: string): "PROFESSIONAL" | "CASUAL" | null | undefined =>
  s === "professional" ? "PROFESSIONAL" : s === "casual" ? "CASUAL" : s === "all" ? null : undefined;
export const slugFromLine = (l: "PROFESSIONAL" | "CASUAL" | null): LineSlug =>
  l === "PROFESSIONAL" ? "professional" : l === "CASUAL" ? "casual" : "all";

/** What a listing shows before the shopper's filters: a hub, category, collection, search… */
export type ListingScope = {
  hubSlug?: string;
  /** undefined = any line; null = products with no line (Teens) */
  line?: "PROFESSIONAL" | "CASUAL" | null;
  categoryId?: string;
  productIds?: string[];
  newIn?: boolean;
  sale?: boolean;
  q?: string;
};

export type Facets = {
  sizes: string[];
  colours: { name: string; hex: string }[];
  fabrics: string[];
  fits: string[];
  occasions: string[];
  lines: ("PROFESSIONAL" | "CASUAL")[];
  priceMin: number;
  priceMax: number;
};

export type ListingResult = {
  items: ProductCardData[];
  total: number;
  facets: Facets;
  searchOrder: boolean;
  /** The saved size, when this listing stocks it (otherwise it isn't applied). */
  savedSize: string | null;
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "One size"];
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s);
  return i >= 0 ? i : 100 + (Number.parseInt(s, 10) || 0);
};
export const sortSizes = (sizes: string[]) => [...new Set(sizes)].sort((a, b) => sizeRank(a) - sizeRank(b));

/** "New in" = published in the last 30 days, or the 12 newest if the catalogue is quiet. */
const NEW_IN_DAYS = 30;

const cardInclude = {
  hub: true,
  colours: { select: { id: true, hex: true, name: true }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
  images: { where: { kind: "FRONT" }, orderBy: { sort: "asc" }, select: { url: true, alt: true, colourId: true } },
  variants: { select: { size: true, stock: true, reserved: true, lowStockAt: true } },
} satisfies Prisma.ProductInclude;

type CardRow = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

/** Turns a product row into card data; `note` reflects the listing context. */
export function toCard(p: CardRow, opts: { noteStyle?: "line" | "colours"; size?: string } = {}): ProductCardData {
  const first = p.colours[0];
  const img = p.images.find((i) => i.colourId === first?.id) ?? p.images[0];
  let note = lineLabel(p.hub.name, p.line);
  if (opts.noteStyle === "colours") {
    const parts = [p.colours.length > 1 ? `${p.colours.length} colours` : (p.colours[0]?.name ?? "")];
    if (p.fit && p.fit !== "Regular" && p.fit !== "One size") parts.push(p.fit);
    note = parts.filter(Boolean).join(" · ");
    if (opts.size) {
      const v = p.variants.filter((x) => x.size === opts.size);
      const available = v.reduce((t, x) => t + Math.max(0, x.stock - x.reserved), 0);
      if (v.length && available > 0 && available <= v[0]!.lowStockAt) note = `Low stock in ${opts.size}`;
    }
  }
  return {
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    compareAtPrice: p.compareAtPrice,
    image: img?.url ?? "/seed/p-tee.svg",
    alt: img?.alt ?? p.name,
    badge: p.badges[0] ?? null,
    note,
    swatches: p.colours.map((c) => ({ name: c.name, hex: c.hex })),
  };
}

function scopeWhere(scope: ListingScope, ids?: string[]): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };
  if (scope.hubSlug) where.hub = { slug: scope.hubSlug };
  if (scope.line !== undefined) where.line = scope.line;
  if (scope.categoryId) where.categoryId = scope.categoryId;
  if (scope.sale) where.compareAtPrice = { not: null };
  if (scope.newIn) where.publishedAt = { gte: new Date(Date.now() - NEW_IN_DAYS * 86_400_000) };
  const idSets = [scope.productIds, ids].filter((x): x is string[] => !!x);
  if (idSets.length) where.id = { in: idSets.reduce((a, b) => a.filter((x) => b.includes(x))) };
  return where;
}

function filterWhere(f: ListingFilters, sizes: string[]): Prisma.ProductWhereInput[] {
  const and: Prisma.ProductWhereInput[] = [];
  if (sizes.length || f.inStock) {
    and.push({ variants: { some: { ...(sizes.length ? { size: { in: sizes } } : {}), ...(f.inStock ? { stock: { gt: 0 } } : {}) } } });
  }
  if (f.lines.length) and.push({ line: { in: f.lines } });
  if (f.colours.length) and.push({ colours: { some: { family: { in: f.colours } } } });
  if (f.priceMin !== null) and.push({ basePrice: { gte: f.priceMin * 100 } });
  if (f.priceMax !== null) and.push({ basePrice: { lte: f.priceMax * 100 } });
  if (f.fabrics.length) and.push({ fabricType: { in: f.fabrics } });
  if (f.fits.length) and.push({ fit: { in: f.fits } });
  if (f.occasions.length) and.push({ occasions: { hasSome: f.occasions } });
  if (f.onSale) and.push({ compareAtPrice: { not: null } });
  return and;
}

function orderBy(sort: ListingFilters["sort"]): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ publishedAt: "desc" }];
    case "price-asc":
      return [{ basePrice: "asc" }, { sort: "asc" }];
    case "price-desc":
      return [{ basePrice: "desc" }, { sort: "asc" }];
    case "rating":
      return [{ ratingAvg: "desc" }, { ratingCount: "desc" }, { sort: "asc" }];
    default:
      return [{ sort: "asc" }];
  }
}

async function facetsFor(where: Prisma.ProductWhereInput): Promise<Facets> {
  const rows = await db().product.findMany({
    where,
    select: {
      basePrice: true,
      fabricType: true,
      fit: true,
      occasions: true,
      line: true,
      colours: { select: { family: true, hex: true } },
      variants: { select: { size: true } },
    },
  });
  const families = new Set(rows.flatMap((r) => r.colours.map((c) => c.family).filter((x): x is string => !!x)));
  const prices = rows.map((r) => r.basePrice);
  const uniq = (xs: (string | null)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort();
  return {
    sizes: sortSizes(rows.flatMap((r) => r.variants.map((v) => v.size))),
    colours: colourFamilies.filter((c) => families.has(c.name)),
    fabrics: uniq(rows.map((r) => r.fabricType)),
    fits: uniq(rows.map((r) => r.fit)).filter((f) => f !== "One size"),
    occasions: uniq(rows.flatMap((r) => r.occasions)),
    lines: (["PROFESSIONAL", "CASUAL"] as const).filter((l) => rows.some((r) => r.line === l)),
    priceMin: prices.length ? Math.floor(Math.min(...prices) / 100) : 0,
    priceMax: prices.length ? Math.ceil(Math.max(...prices) / 100) : 0,
  };
}

/** Runs a listing: scope + URL filters + sort, first `page × 12` results, and facets for the panel. */
export async function queryListing(scope: ListingScope, f: ListingFilters, savedSize: string | null): Promise<ListingResult> {
  let ranked: string[] | undefined;
  if (scope.q !== undefined) ranked = (await searchProductIds(scope.q)).map((r) => r.id);

  const base = scopeWhere(scope, ranked);
  const facets = await facetsFor(base);
  const saved = savedSize && facets.sizes.includes(savedSize) ? savedSize : null;
  const sizes = effectiveSizes(f, saved);
  const where: Prisma.ProductWhereInput = { AND: [base, ...filterWhere(f, sizes)] };
  const take = PAGE_SIZE * f.page;
  const noteOpts = { noteStyle: "colours" as const, size: sizes.length === 1 ? sizes[0] : undefined };

  // Search keeps relevance order under "Recommended".
  const searchOrder = ranked !== undefined && f.sort === "recommended";
  const [total, rows] = await Promise.all([
    db().product.count({ where }),
    searchOrder
      ? db().product.findMany({ where, include: cardInclude })
      : db().product.findMany({ where, include: cardInclude, orderBy: orderBy(f.sort), take }),
  ]);
  const ordered = searchOrder ? rows.sort((a, b) => ranked!.indexOf(a.id) - ranked!.indexOf(b.id)).slice(0, take) : rows;
  return { items: ordered.map((p) => toCard(p, noteOpts)), total, facets, searchOrder, savedSize: saved };
}

/** Cards for a list of product ids, keeping their order. */
export async function cardsByIds(ids: string[], noteStyle: "line" | "colours" = "line"): Promise<ProductCardData[]> {
  if (!ids.length) return [];
  const rows = await db().product.findMany({ where: { id: { in: ids }, status: "ACTIVE" }, include: cardInclude });
  return ids.map((id) => rows.find((r) => r.id === id)).filter((r) => r !== undefined).map((r) => toCard(r, { noteStyle }));
}

/** Cards matching a where clause (trending, related, goes well with…). */
export async function cardsWhere(where: Prisma.ProductWhereInput, opts: { take: number; orderBy?: Prisma.ProductOrderByWithRelationInput[]; noteStyle?: "line" | "colours" }) {
  const rows = await db().product.findMany({
    where: { status: "ACTIVE", ...where },
    include: cardInclude,
    orderBy: opts.orderBy ?? [{ sort: "asc" }],
    take: opts.take,
  });
  return rows.map((r) => toCard(r, { noteStyle: opts.noteStyle }));
}

export async function getHub(slug: string) {
  return db().hub.findUnique({ where: { slug } });
}

export async function getCategory(hubId: string, line: "PROFESSIONAL" | "CASUAL" | null, slug: string) {
  return db().category.findFirst({ where: { hubId, line, slug } });
}

/** Categories in a hub line that have active products, up to `take`. */
export async function categoriesWithProducts(hubId: string, line: "PROFESSIONAL" | "CASUAL" | null, take = 8) {
  return db().category.findMany({
    where: { hubId, line, products: { some: { status: "ACTIVE" } } },
    orderBy: { sort: "asc" },
    take,
  });
}
