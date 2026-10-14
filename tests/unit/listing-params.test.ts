import { describe, expect, it } from "vitest";
import { activeFilterCount, effectiveSizes, isSavableSize, parseListingParams } from "@/lib/listing-params";

describe("parseListingParams", () => {
  it("reads lists, numbers and flags from the URL", () => {
    const f = parseListingParams({ size: "M,L", line: "professional", colour: "Ecru", min: "999", max: "4999", fabric: "Linen", fit: "Regular", instock: "1", sale: "1", sort: "price-asc", page: "2" });
    expect(f.sizes).toEqual(["M", "L"]);
    expect(f.lines).toEqual(["PROFESSIONAL"]);
    expect(f.priceMin).toBe(999);
    expect(f.priceMax).toBe(4999);
    expect(f.inStock && f.onSale).toBe(true);
    expect(f.sort).toBe("price-asc");
    expect(f.page).toBe(2);
  });

  it("falls back to safe defaults for bad input", () => {
    const f = parseListingParams({ sort: "drop table", page: "-3", min: "abc", line: "nonsense" });
    expect(f.sort).toBe("recommended");
    expect(f.page).toBe(1);
    expect(f.priceMin).toBeNull();
    expect(f.lines).toEqual([]);
  });

  it("uses the saved size only until the shopper chooses or clears sizes", () => {
    expect(effectiveSizes(parseListingParams({}), "M")).toEqual(["M"]);
    expect(effectiveSizes(parseListingParams({ size: "" }), "M")).toEqual([]);
    expect(effectiveSizes(parseListingParams({ size: "L" }), "M")).toEqual(["L"]);
  });

  it("counts active filters including the saved size", () => {
    expect(activeFilterCount(parseListingParams({ fabric: "Linen,Cotton", sale: "1" }), "M")).toBe(4);
  });

  it("only remembers letter sizes", () => {
    expect(isSavableSize("M")).toBe(true);
    expect(isSavableSize("30")).toBe(false);
  });
});
