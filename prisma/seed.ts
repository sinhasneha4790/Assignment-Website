/**
 * Seeds the database with the mockup's sample catalogue and content.
 * Safe to re-run: every write is an upsert keyed on a slug, code or key.
 *   npx prisma db seed
 */
import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Line, type ServiceFormat } from "../generated/prisma/client";
import { buildSearchText } from "../lib/search-text";
import {
  categories,
  coupons,
  galleryScenes,
  hubContent,
  hubOccasions,
  hubs,
  homeCarousel,
  homeEdits,
  homePromises,
  homeReviews,
  homeStylistBanner,
  lookbooks,
  popularSearches,
  products,
  questions,
  reviewers,
  reviews,
  services,
  siteSettings,
  sizeCharts,
  stores,
  stylists,
} from "./seed-data";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

/** Looks up a key that the seed itself just created. */
function must(map: Record<string, string>, key: string): string {
  const v = map[key];
  if (!v) throw new Error(`Seed data refers to unknown key "${key}"`);
  return v;
}

const skuPart = (s: string) => s.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
const slugCode = (slug: string) => createHash("sha1").update(slug).digest("hex").slice(0, 6).toUpperCase();
const lineKey = (line: string | null) => line ?? "ALL";

async function main() {
  const hubIds: Record<string, string> = {};
  for (const h of hubs) {
    const row = await prisma.hub.upsert({
      where: { slug: h.slug },
      update: { name: h.name, tagline: h.tagline, image: h.image, sort: h.sort },
      create: { slug: h.slug, name: h.name, tagline: h.tagline, image: h.image, sort: h.sort },
    });
    hubIds[h.slug] = row.id;
  }

  const categoryIds: Record<string, string> = {};
  const categoryNames: Record<string, string> = {};
  for (const [i, c] of categories.entries()) {
    const hubId = must(hubIds, c.hub);
    const existing = await prisma.category.findFirst({ where: { hubId, slug: c.slug, line: c.line as Line | null } });
    const data = { hubId, line: c.line as Line | null, slug: c.slug, name: c.name, image: c.image, sort: i };
    const row = existing
      ? await prisma.category.update({ where: { id: existing.id }, data })
      : await prisma.category.create({ data });
    categoryIds[`${c.hub}/${lineKey(c.line)}/${c.slug}`] = row.id;
    categoryNames[row.id] = c.name;
  }

  const chartIds: Record<string, string> = {};
  for (const sc of sizeCharts) {
    const hubId = must(hubIds, sc.hub);
    const rows = { title: sc.title, rows: sc.rows };
    const row = await prisma.sizeChart.upsert({
      where: { hubId_productType: { hubId, productType: sc.productType } },
      update: { rows },
      create: { hubId, productType: sc.productType, rows },
    });
    chartIds[`${sc.hub}/${sc.productType}`] = row.id;
  }

  const productIds: Record<string, string> = {};
  for (const [i, p] of products.entries()) {
    const hub = hubs.find((h) => h.slug === p.hub)!;
    const categoryId = must(categoryIds, `${p.hub}/${lineKey(p.line)}/${p.category}`);
    const scenes = galleryScenes[p.hub];
    const wearable = p.type === "tops" || p.type === "bottoms";
    const data = {
      name: p.name,
      description: p.description,
      fabric: p.fabric,
      fabricType: p.fabricType,
      care: p.care,
      fit: p.fit,
      fitNote: p.fitNote,
      modelInfo: wearable ? scenes.modelInfo : null,
      hubId: must(hubIds, p.hub),
      categoryId,
      line: p.line as Line | null,
      basePrice: p.price,
      compareAtPrice: p.compareAt ?? null,
      badges: p.badges ?? [],
      occasions: p.occasions,
      status: "ACTIVE" as const,
      sort: i,
      sizeChartId: chartIds[`${p.hub}/${p.type}`] ?? null,
      searchText: buildSearchText({
        name: p.name,
        category: categoryNames[categoryId] ?? "",
        hub: hub.name,
        line: p.line,
        fabric: p.fabric,
        colours: p.colours.map((c) => c.name),
      }),
      seoTitle: p.name,
      seoDescription: p.description.slice(0, 155),
      // New-in items sort first by publish date.
      publishedAt: new Date(Date.UTC(2026, 9, 1) + (p.newIn ? 86_400_000 * 10 : 0) - i * 60_000),
    };
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
    productIds[p.slug] = product.id;

    // Rebuild images so the seed stays in sync with seed-data.ts; variants are upserted to keep cart references valid.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (const [ci, c] of p.colours.entries()) {
      let colour = await prisma.colour.findFirst({ where: { productId: product.id, name: c.name } });
      colour = colour
        ? await prisma.colour.update({ where: { id: colour.id }, data: { hex: c.hex, family: c.family } })
        : await prisma.colour.create({ data: { productId: product.id, name: c.name, hex: c.hex, family: c.family } });

      const label = c.name.toLowerCase();
      await prisma.productImage.createMany({
        data: [
          { productId: product.id, colourId: colour.id, url: c.image, alt: `${p.name} in ${label}, front`, sort: 0, kind: "FRONT" },
          { productId: product.id, colourId: colour.id, url: c.image, alt: `${p.name} in ${label}, fabric close-up`, sort: 1, kind: "DETAIL" },
        ],
      });

      const last = p.sizes.length - 1;
      for (const [si, size] of p.sizes.entries()) {
        const sku = `FF-${slugCode(p.slug)}-${skuPart(c.name)}-${skuPart(size)}`;
        // First colour: largest size sold out, second-largest low, so the UI shows real stock states.
        const stock = ci === 0 && last > 0 && si === last ? 0 : ci === 0 && last > 1 && si === last - 1 ? 2 : 12;
        await prisma.variant.upsert({
          where: { productId_colourId_size: { productId: product.id, colourId: colour.id, size } },
          update: { sku, stock, reserved: 0 },
          create: { productId: product.id, colourId: colour.id, size, sku, stock },
        });
      }
    }
    if (wearable) {
      await prisma.productImage.createMany({
        data: [
          { productId: product.id, url: scenes.model, alt: `Model wearing the ${p.name}`, sort: 2, kind: "MODEL" },
          { productId: product.id, url: scenes.styled, alt: `${p.name} styled for the weekend`, sort: 3, kind: "STYLED" },
        ],
      });
    }
  }

  // Sample customers for reviews (no password, so they cannot sign in).
  const userIds: string[] = [];
  for (const r of reviewers) {
    const u = await prisma.user.upsert({ where: { email: r.email }, update: { name: r.name }, create: { email: r.email, name: r.name } });
    userIds.push(u.id);
  }
  await prisma.review.deleteMany({ where: { userId: { in: userIds } } });
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        productId: must(productIds, r.product),
        userId: userIds[r.by]!,
        rating: r.rating,
        title: r.title,
        body: r.body,
        fit: r.fit,
        sizeBought: r.size,
        photos: r.photos ?? [],
        verifiedBuyer: true,
        status: "PUBLISHED",
        createdAt: new Date(Date.UTC(2026, 9, 14) - r.daysAgo * 86_400_000),
      },
    });
  }
  // Denormalise ratings for sorting and cards.
  const agg = await prisma.review.groupBy({ by: ["productId"], where: { status: "PUBLISHED" }, _avg: { rating: true }, _count: true });
  await prisma.product.updateMany({ data: { ratingAvg: 0, ratingCount: 0 } });
  for (const a of agg) {
    await prisma.product.update({ where: { id: a.productId }, data: { ratingAvg: a._avg.rating ?? 0, ratingCount: a._count } });
  }

  for (const q of questions) {
    const productId = must(productIds, q.product);
    const existing = await prisma.question.findFirst({ where: { productId, body: q.q } });
    if (!existing) {
      await prisma.question.create({ data: { productId, body: q.q, answers: { create: { body: q.a, staffName: "Folk & Form team" } } } });
    }
  }

  for (const l of lookbooks) {
    const data = { title: l.title, heroImage: l.image, story: l.alt, isLookbook: true, productIds: l.productSlugs.map((s) => must(productIds, s)) };
    await prisma.collection.upsert({ where: { slug: l.slug }, update: data, create: { slug: l.slug, ...data } });
  }

  const blocks: Record<string, unknown> = {
    "site.settings": siteSettings,
    "home.carousel": homeCarousel,
    "home.edits": homeEdits,
    "home.stylist": homeStylistBanner,
    "home.lookbook": lookbooks.map((l) => l.slug),
    "home.reviews": homeReviews,
    "home.promises": homePromises,
    "search.popular": popularSearches,
  };
  for (const h of hubs) {
    blocks[`hub.${h.slug}`] = { lines: hubContent[h.slug], occasions: hubOccasions[h.slug] };
  }
  for (const [key, payload] of Object.entries(blocks)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: { payload: payload as object },
      create: { key, payload: payload as object },
    });
  }

  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: { type: c.type, value: c.value, minOrder: c.minOrder }, create: c });
  }

  const storeIds: Record<string, string> = {};
  for (const s of stores) {
    const row = await prisma.store.upsert({ where: { slug: s.slug }, update: s, create: s });
    storeIds[s.slug] = row.id;
  }

  for (const [i, s] of services.entries()) {
    const data = {
      name: s.name,
      description: s.description,
      format: s.format as ServiceFormat,
      formats: [...s.formats] as ServiceFormat[],
      durationMin: s.durationMin,
      price: s.price,
      deposit: s.deposit,
      creditBack: s.creditBack,
      capacity: "capacity" in s ? s.capacity : 1,
      sort: i,
    };
    await prisma.service.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
  }

  for (const s of stylists) {
    const data = {
      name: s.name,
      bio: s.bio,
      photo: s.photo,
      specialities: s.specialities,
      languages: s.languages,
      storeId: must(storeIds, s.store),
    };
    const row = await prisma.stylist.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
    const rules = await prisma.availabilityRule.count({ where: { stylistId: row.id } });
    if (rules === 0) {
      // Tuesday–Sunday, 11:00–19:00 IST.
      await prisma.availabilityRule.createMany({
        data: [0, 2, 3, 4, 5, 6].map((weekday) => ({ stylistId: row.id, weekday, start: "11:00", end: "19:00" })),
      });
    }
  }

  console.log(`Seeded ${hubs.length} hubs, ${categories.length} categories, ${products.length} products, ${reviews.length} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
