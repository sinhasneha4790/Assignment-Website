import "server-only";
import { db, hasDatabase } from "@/lib/db";
import { lineLabel } from "@/lib/format";
import * as seed from "@/prisma/seed-data";

/**
 * Read-side for CMS content. Pages read from Postgres; until a database is
 * connected (first preview deploys), they fall back to the same seed data the
 * seed script writes, so the site still renders.
 */

export type CarouselSlide = seed.CarouselSlide;

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  alt: string;
  badge: string | null;
  note: string;
  /** Colour dots under the card (hub "Trending now"). */
  swatches?: { name: string; hex: string }[];
};

export type Lookbook = { slug: string; title: string; image: string; alt: string; pieces: number; total: number };
export type HubTile = { slug: string; name: string; tagline: string; image: string };
export type SiteSettings = typeof seed.siteSettings;

export type HomeContent = {
  carousel: CarouselSlide[];
  hubs: HubTile[];
  edits: typeof seed.homeEdits;
  newIn: ProductCardData[];
  stylist: typeof seed.homeStylistBanner;
  lookbooks: Lookbook[];
  reviews: typeof seed.homeReviews;
  promises: typeof seed.homePromises;
};

async function block<T>(key: string, fallback: T): Promise<T> {
  if (!hasDatabase) return fallback;
  const row = await db().contentBlock.findUnique({ where: { key } });
  return (row?.payload as T | undefined) ?? fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return block("site.settings", seed.siteSettings);
}

function seedCard(p: (typeof seed.products)[number]): ProductCardData {
  const hub = seed.hubs.find((h) => h.slug === p.hub)!;
  const colour = p.colours[0]!;
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAt ?? null,
    image: colour.image,
    alt: `${p.name} in ${colour.name.toLowerCase()}`,
    badge: p.badges?.[0] ?? null,
    note: lineLabel(hub.name, p.line),
  };
}

async function getNewIn(limit: number): Promise<ProductCardData[]> {
  if (!hasDatabase) {
    return seed.products.filter((p) => p.newIn).slice(0, limit).map(seedCard);
  }
  const rows = await db().product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { hub: true, images: { orderBy: { sort: "asc" }, take: 1 } },
  });
  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.basePrice,
    compareAtPrice: p.compareAtPrice,
    image: p.images[0]?.url ?? "/seed/p-tee.svg",
    alt: p.images[0]?.alt ?? p.name,
    badge: p.badges[0] ?? null,
    note: lineLabel(p.hub.name, p.line),
  }));
}

async function getLookbooks(): Promise<Lookbook[]> {
  if (!hasDatabase) {
    return seed.lookbooks.map((l) => {
      const items = l.productSlugs.map((s) => seed.products.find((p) => p.slug === s)!);
      return { slug: l.slug, title: l.title, image: l.image, alt: l.alt, pieces: items.length, total: items.reduce((t, p) => t + p.price, 0) };
    });
  }
  const slugs = await block<string[]>("home.lookbook", seed.lookbooks.map((l) => l.slug));
  const rows = await db().collection.findMany({ where: { slug: { in: slugs }, isLookbook: true } });
  const ids = rows.flatMap((r) => r.productIds);
  const prices = new Map(
    (await db().product.findMany({ where: { id: { in: ids } }, select: { id: true, basePrice: true } })).map((p) => [p.id, p.basePrice]),
  );
  return slugs
    .map((slug) => rows.find((r) => r.slug === slug))
    .filter((r) => r !== undefined)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      image: r.heroImage ?? "/seed/s-duo.svg",
      alt: r.story ?? r.title,
      pieces: r.productIds.length,
      total: r.productIds.reduce((t, id) => t + (prices.get(id) ?? 0), 0),
    }));
}

async function getHubs(): Promise<HubTile[]> {
  if (!hasDatabase) return seed.hubs.map((h) => ({ ...h }));
  const rows = await db().hub.findMany({ orderBy: { sort: "asc" } });
  return rows.map((h) => ({ slug: h.slug, name: h.name, tagline: h.tagline ?? "", image: h.image ?? "/seed/s-duo.svg" }));
}

export async function getHomeContent(): Promise<HomeContent> {
  const [carousel, hubs, edits, newIn, stylist, lookbooks, reviews, promises] = await Promise.all([
    block("home.carousel", seed.homeCarousel),
    getHubs(),
    block("home.edits", seed.homeEdits),
    getNewIn(4),
    block("home.stylist", seed.homeStylistBanner),
    getLookbooks(),
    block("home.reviews", seed.homeReviews),
    block("home.promises", seed.homePromises),
  ]);
  return { carousel, hubs, edits, newIn, stylist, lookbooks, reviews, promises };
}
