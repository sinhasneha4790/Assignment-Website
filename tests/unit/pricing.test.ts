import { describe, expect, it } from "vitest";
import { checkCoupon, computeTotals, gstRate, type CouponRule, type PricingSettings } from "@/lib/pricing";

const settings: PricingSettings = { freeDeliveryThreshold: 299_900, deliveryFee: 9_900, giftWrapFee: 9_900, codFee: 4_900, expressFee: 14_900 };
const coupon = (over: Partial<CouponRule> = {}): CouponRule => ({ code: "X", type: "PERCENT", value: 10, minOrder: 0, startsAt: null, endsAt: null, usageLimit: null, usedCount: 0, ...over });

describe("computeTotals", () => {
  it("charges delivery below the free-delivery threshold", () => {
    const t = computeTotals({ lines: [{ unitPrice: 249_000, qty: 1 }], settings });
    expect(t.subtotal).toBe(249_000);
    expect(t.delivery).toBe(9_900);
    expect(t.total).toBe(258_900);
    expect(t.freeDeliveryRemaining).toBe(50_900);
  });

  it("gives free delivery at or above the threshold", () => {
    const t = computeTotals({ lines: [{ unitPrice: 249_000, qty: 1 }, { unitPrice: 329_000, qty: 1 }], settings });
    expect(t.delivery).toBe(0);
    expect(t.total).toBe(578_000);
    expect(t.itemCount).toBe(2);
    expect(t.freeDeliveryRemaining).toBe(0);
  });

  it("applies the threshold after the discount", () => {
    const t = computeTotals({ lines: [{ unitPrice: 300_000, qty: 1 }], settings, discount: 20_000 });
    expect(t.delivery).toBe(9_900);
    expect(t.total).toBe(289_900);
  });

  it("adds gift wrap, COD and express fees", () => {
    const t = computeTotals({ lines: [{ unitPrice: 400_000, qty: 1 }], settings, giftWrap: true, cod: true, deliveryMethod: "EXPRESS" });
    expect(t.total).toBe(400_000 + 9_900 + 4_900 + 14_900);
  });

  it("never discounts below zero and charges nothing for an empty bag", () => {
    expect(computeTotals({ lines: [{ unitPrice: 10_000, qty: 1 }], settings, discount: 50_000 }).discount).toBe(10_000);
    expect(computeTotals({ lines: [], settings, giftWrap: true }).total).toBe(0);
  });

  it("works out the GST included in the price", () => {
    // ₹2,100 at 5 % includes ₹100 GST.
    expect(computeTotals({ lines: [{ unitPrice: 210_000, qty: 1 }], settings }).tax).toBe(10_000);
    expect(gstRate(250_000)).toBe(0.05);
    expect(gstRate(250_100)).toBe(0.18);
  });
});

describe("checkCoupon", () => {
  it("takes a percentage off the subtotal", () => {
    expect(checkCoupon(coupon({ value: 10 }), 500_000)).toEqual({ ok: true, discount: 50_000 });
  });
  it("takes a flat amount off, capped at the subtotal", () => {
    expect(checkCoupon(coupon({ type: "FLAT", value: 20_000 }), 10_000)).toEqual({ ok: true, discount: 10_000 });
  });
  it("enforces the minimum order", () => {
    const r = checkCoupon(coupon({ minOrder: 249_900 }), 200_000);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain("₹499");
  });
  it("respects dates and usage limits", () => {
    const now = new Date("2026-10-14T00:00:00Z");
    expect(checkCoupon(coupon({ endsAt: new Date("2026-10-01") }), 1, now).ok).toBe(false);
    expect(checkCoupon(coupon({ startsAt: new Date("2026-11-01") }), 1, now).ok).toBe(false);
    expect(checkCoupon(coupon({ usageLimit: 5, usedCount: 5 }), 1, now).ok).toBe(false);
  });
});
