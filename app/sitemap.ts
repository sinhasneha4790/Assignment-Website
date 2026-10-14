import type { MetadataRoute } from "next";
import { slugFromLine } from "@/lib/catalog";
import { db, hasDatabase } from "@/lib/db";
import { siteUrl } from "@/lib/site";

// Rebuilt hourly so new products appear without a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed: MetadataRoute.Sitemap = ["/", "/new-in", "/sale", "/size-guide"].map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "daily", priority: p === "/" ? 1 : 0.7 }));
  if (!hasDatabase) return fixed;

  const [hubs, categories, products] = await Promise.all([
    db().hub.findMany({ select: { slug: true } }),
    db().category.findMany({ where: { products: { some: { status: "ACTIVE" } } }, select: { slug: true, line: true, hub: { select: { slug: true } } } }),
    db().product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    ...fixed,
    ...hubs.map((h) => ({ url: `${siteUrl}/${h.slug}`, changeFrequency: "daily" as const, priority: 0.9 })),
    ...categories.map((c) => ({ url: `${siteUrl}/${c.hub.slug}/${slugFromLine(c.line)}/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${siteUrl}/p/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
