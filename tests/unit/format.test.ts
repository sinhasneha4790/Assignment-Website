import { describe, expect, it } from "vitest";
import { formatPrice, lineLabel } from "@/lib/format";

describe("formatPrice", () => {
  it("formats paise as Indian rupees", () => {
    expect(formatPrice(249000)).toBe("₹2,490");
    expect(formatPrice(99999900)).toBe("₹9,99,999");
    expect(formatPrice(0)).toBe("₹0");
  });
  it("keeps paise when present", () => {
    expect(formatPrice(4950)).toBe("₹49.50");
  });
  it("marks negatives such as discounts", () => {
    expect(formatPrice(-20000)).toBe("−₹200");
  });
});

describe("lineLabel", () => {
  it("joins hub and line", () => {
    expect(lineLabel("Women", "PROFESSIONAL")).toBe("Women · Professional");
    expect(lineLabel("Teens", null)).toBe("Teens");
  });
});
