/**
 * Seeds the database with the mockup's sample catalogue and content.
 * Safe to re-run: every write is an upsert keyed on a slug, code or key.
 *   npx prisma db seed
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Line, type ServiceFormat } from "../generated/prisma/client";
import {
  categories,
  hubs,
  homeCarousel,
  homeEdits,
  homePromises,
  homeReviews,
  homeStylistBanner,
  lookbooks,
  products,
  services,
  siteSettings,
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
  for (const [i, c] of categories.entries()) {
    const hubId = must(hubIds, c.hub);
    const existing = await prisma.category.findFirst({ where: { hubId, slug: c.slug, line: c.line as Line | null } });
    const data = { hubId, line: c.line as Line | null, slug: c.slug, name: c.name, image: c.image, sort: i };
    const row = existing
      ? await prisma.category.update({ where: { id: existing.id }, data })
      : await prisma.category.create({ data });
    categoryIds[`${c.hub}/${c.slug}`] = row.id;
  }

  const productIds: Record<string, string> = {};
  for (const [i, p] of products.entries()) {
    const data = {
      name: p.name,
      description: p.description,
      fabric: p.fabric,
      fit: p.fit,
      hubId: must(hubIds, p.hub),
      categoryId: must(categoryIds, `${p.hub}/${p.category}`),
      line: p.line as Line | null,
      basePrice: p.price,
      compareAtPrice: p.compareAt ?? null,
      badges: p.badges ?? [],
      occasions: p.occasions ?? [],
      status: "ACTIVE" as const,
      seoTitle: `${p.name} | Folk & Form`,
      seoDescription: p.description,
      // Newer items sort first in "New in".
      publishedAt: new Date(Date.UTC(2026, 9, 1) + (p.newIn ? 86_400_000 * 10 : 0) - i * 60_000),
    };
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
    productIds[p.slug] = product.id;

    // Rebuild colours, images and variants so the seed stays in sync with seed-data.ts.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (const [ci, c] of p.colours.entries()) {
      let colour = await prisma.colour.findFirst({ where: { productId: product.id, name: c.name } });
      colour = colour
        ? await prisma.colour.update({ where: { id: colour.id }, data: { hex: c.hex } })
        : await prisma.colour.create({ data: { productId: product.id, name: c.name, hex: c.hex } });

      await prisma.productImage.create({
        data: { productId: product.id, colourId: colour.id, url: c.image, alt: `${p.name} in ${c.name.toLowerCase()}`, sort: ci, kind: "FRONT" },
      });

      for (const [si, size] of p.sizes.entries()) {
        const sku = `FF-${skuPart(p.slug)}-${skuPart(c.name)}-${skuPart(size)}`;
        // Every third size of the first colour is sold out so the UI has real sold-out states.
        const stock = ci === 0 && si % 3 === 2 ? 0 : 12;
        await prisma.variant.upsert({
          where: { productId_colourId_size: { productId: product.id, colourId: colour.id, size } },
          update: { sku, stock },
          create: { productId: product.id, colourId: colour.id, size, sku, stock },
        });
      }
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
  };
  for (const [key, payload] of Object.entries(blocks)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: { payload: payload as object },
      create: { key, payload: payload as object },
    });
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

  console.log(`Seeded ${hubs.length} hubs, ${categories.length} categories, ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
