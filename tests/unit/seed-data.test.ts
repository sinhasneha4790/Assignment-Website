import { describe, expect, it } from "vitest";
import { categories, colourFamilies, homeCarousel, hubs, lookbooks, products } from "@/prisma/seed-data";

describe("seed data", () => {
  it("stores every price as whole paise", () => {
    for (const p of products) {
      expect(Number.isInteger(p.price)).toBe(true);
      expect(p.price % 100).toBe(0);
    }
  });
  it("points every product at a real hub and category", () => {
    for (const p of products) {
      expect(hubs.some((h) => h.slug === p.hub)).toBe(true);
      expect(categories.some((c) => c.hub === p.hub && c.line === p.line && c.slug === p.category)).toBe(true);
    }
  });
  it("has unique product slugs", () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });
  it("only references existing products in lookbooks", () => {
    for (const l of lookbooks) for (const s of l.productSlugs) expect(products.some((p) => p.slug === s)).toBe(true);
  });
  it("only uses colour families the filter knows", () => {
    for (const p of products) for (const c of p.colours) expect(colourFamilies.some((f) => f.name === c.family)).toBe(true);
  });
  it("gives every hub line at least one category with products", () => {
    for (const c of categories) expect(products.some((p) => p.hub === c.hub && p.line === c.line && p.category === c.slug)).toBe(true);
  });
  it("has four carousel slides and four New in products", () => {
    expect(homeCarousel).toHaveLength(4);
    expect(products.filter((p) => p.newIn).length).toBeGreaterThanOrEqual(4);
  });
});
