import "server-only";
import { cache } from "react";
import { cardsByIds, cardsWhere, slugFromLine } from "@/lib/catalog";
import { db } from "@/lib/db";
import type { SizeRow } from "@/prisma/seed-data";

export type SizeChartData = { hub: string; hubName: string; productType: string; title: string; rows: SizeRow[] };

export const getProduct = cache(async (slug: string) => {
  return db().product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      hub: true,
      category: true,
      sizeChart: true,
      colours: { orderBy: { createdAt: "asc" } },
      images: { orderBy: [{ sort: "asc" }] },
      variants: true,
      questions: { orderBy: { createdAt: "desc" }, take: 5, include: { answers: true } },
    },
  });
});

export type ProductRow = NonNullable<Awaited<ReturnType<typeof getProduct>>>;

export type ReviewFilter = "all" | "photos" | "recent" | `size-${string}`;

export async function getReviews(productId: string, filter: ReviewFilter) {
  const where = {
    productId,
    status: "PUBLISHED" as const,
    ...(filter === "photos" ? { photos: { isEmpty: false } } : {}),
    ...(filter.startsWith("size-") ? { sizeBought: filter.slice(5) } : {}),
  };
  const [list, all] = await Promise.all([
    db().review.findMany({
      where,
      orderBy: filter === "recent" ? { createdAt: "desc" } : [{ rating: "desc" }, { createdAt: "desc" }],
      take: 10,
      include: { user: { select: { name: true } } },
    }),
    db().review.findMany({ where: { productId, status: "PUBLISHED" }, select: { rating: true, fit: true } }),
  ]);
  const histogram = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: all.filter((r) => r.rating === stars).length }));
  const fits = all.filter((r) => r.fit);
  // Fit meter position: 0 = runs small, 0.5 = true to size, 1 = runs large.
  const fitScore = fits.length ? fits.reduce((t, r) => t + (r.fit === "SMALL" ? 0 : r.fit === "LARGE" ? 1 : 0.5), 0) / fits.length : null;
  const avg = all.length ? all.reduce((t, r) => t + r.rating, 0) / all.length : 0;
  return { list, histogram, count: all.length, avg, fitScore };
}

/** All size charts, for the size-guide tabs (Women / Men / Teens / conversion). */
export const getSizeCharts = cache(async (): Promise<SizeChartData[]> => {
  const rows = await db().sizeChart.findMany({ include: { hub: true }, orderBy: { hub: { sort: "asc" } } });
  return rows.map((r) => {
    const payload = r.rows as unknown as { title: string; rows: SizeRow[] };
    return { hub: r.hub.slug, hubName: r.hub.name, productType: r.productType, title: payload.title, rows: payload.rows };
  });
});

/** "Complete the look": pieces from a lookbook containing this product, else other categories in the same hub line. */
export async function completeTheLook(p: ProductRow) {
  const looks = await db().collection.findMany({ where: { productIds: { has: p.id } }, select: { productIds: true } });
  const fromLooks = [...new Set(looks.flatMap((l) => l.productIds))].filter((id) => id !== p.id).slice(0, 4);
  const cards = await cardsByIds(fromLooks);
  if (cards.length >= 4) return cards;
  const more = await cardsWhere(
    { hubId: p.hubId, line: p.line, categoryId: { not: p.categoryId }, id: { notIn: [p.id, ...fromLooks] } },
    { take: 4 - cards.length, orderBy: [{ ratingCount: "desc" }, { sort: "asc" }] },
  );
  return [...cards, ...more];
}

/** "You may also like": same category first, then same hub line. */
export async function youMayAlsoLike(p: ProductRow) {
  const same = await cardsWhere({ categoryId: p.categoryId, id: { not: p.id } }, { take: 4 });
  if (same.length >= 4) return same;
  const more = await cardsWhere(
    { hubId: p.hubId, line: p.line, id: { notIn: [p.id] }, slug: { notIn: same.map((s) => s.slug) } },
    { take: 4 - same.length, orderBy: [{ publishedAt: "desc" }] },
  );
  return [...same, ...more];
}

export function productPath(p: { hub: { slug: string }; line: "PROFESSIONAL" | "CASUAL" | null; category: { slug: string } }) {
  return `/${p.hub.slug}/${slugFromLine(p.line)}/${p.category.slug}`;
}
