import { describe, expect, it } from "vitest";
import { buildSearchText } from "@/lib/search-text";
import { parseWishlist, serialiseWishlist } from "@/lib/wishlist";

describe("buildSearchText", () => {
  it("lower-cases and joins the searchable fields with synonyms", () => {
    const t = buildSearchText({ name: "Linen Workday Shirt", category: "Shirts & blouses", hub: "Women", line: "PROFESSIONAL", fabric: "100% European linen", colours: ["Ecru", "Sage"] });
    expect(t).toContain("linen workday shirt");
    expect(t).toContain("womens");
    expect(t).toContain("office");
    expect(t).toContain("sage");
    expect(t).not.toMatch(/[&%]/);
  });
});

describe("wishlist cookie", () => {
  it("round-trips slugs and drops junk", () => {
    expect(parseWishlist(serialiseWishlist(["a-1", "b-2", "a-1"]))).toEqual(["a-1", "b-2"]);
    expect(parseWishlist("good.<script>.also-good")).toEqual(["good", "also-good"]);
    expect(parseWishlist(undefined)).toEqual([]);
  });
});
