/**
 * Cart and order maths. Pure functions: the server re-prices from the database
 * and runs these; the browser never decides a price. All amounts in paise.
 */

export type PricingSettings = {
  freeDeliveryThreshold: number;
  deliveryFee: number;
  giftWrapFee: number;
  codFee: number;
  expressFee: number;
};

export type CouponRule = {
  code: string;
  type: "PERCENT" | "FLAT";
  /** PERCENT: whole percent (10 = 10 %). FLAT: paise. */
  value: number;
  minOrder: number;
  startsAt: Date | null;
  endsAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
};

export type CouponCheck = { ok: true; discount: number } | { ok: false; reason: string };

export function checkCoupon(c: CouponRule, subtotal: number, now = new Date()): CouponCheck {
  if (c.startsAt && now < c.startsAt) return { ok: false, reason: "This code isn’t active yet." };
  if (c.endsAt && now > c.endsAt) return { ok: false, reason: "This code has expired." };
  if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return { ok: false, reason: "This code has been fully used." };
  if (subtotal < c.minOrder) return { ok: false, reason: `Add items worth ₹${Math.ceil((c.minOrder - subtotal) / 100).toLocaleString("en-IN")} more to use this code.` };
  const raw = c.type === "PERCENT" ? Math.round((subtotal * Math.min(c.value, 100)) / 100) : c.value;
  return { ok: true, discount: Math.min(raw, subtotal) };
}

/**
 * GST rate on apparel and footwear by unit selling price (2025 slabs: 5 % up to
 * ₹2,500, 18 % above). Confirm with the owner's accountant before go-live.
 */
export function gstRate(unitPrice: number): number {
  return unitPrice <= 250_000 ? 0.05 : 0.18;
}

export type PricedLine = { unitPrice: number; qty: number };

export type Totals = {
  subtotal: number;
  discount: number;
  delivery: number;
  giftWrap: number;
  codFee: number;
  /** GST already included in the total (shown on the invoice). */
  tax: number;
  total: number;
  itemCount: number;
  /** Paise still needed for free standard delivery (0 when reached). */
  freeDeliveryRemaining: number;
};

export function computeTotals(input: {
  lines: PricedLine[];
  settings: PricingSettings;
  discount?: number;
  giftWrap?: boolean;
  deliveryMethod?: "STANDARD" | "EXPRESS" | "PICKUP";
  cod?: boolean;
}): Totals {
  const { lines, settings } = input;
  const subtotal = lines.reduce((t, l) => t + l.unitPrice * l.qty, 0);
  const itemCount = lines.reduce((t, l) => t + l.qty, 0);
  const discount = Math.min(Math.max(input.discount ?? 0, 0), subtotal);
  const afterDiscount = subtotal - discount;

  const method = input.deliveryMethod ?? "STANDARD";
  const freeDelivery = afterDiscount >= settings.freeDeliveryThreshold;
  let delivery = 0;
  if (itemCount > 0) {
    if (method === "EXPRESS") delivery = settings.expressFee;
    else if (method === "STANDARD") delivery = freeDelivery ? 0 : settings.deliveryFee;
  }
  const giftWrap = input.giftWrap && itemCount > 0 ? settings.giftWrapFee : 0;
  const codFee = input.cod && itemCount > 0 ? settings.codFee : 0;

  // Included GST on goods, with the discount spread proportionally across lines.
  const share = subtotal > 0 ? afterDiscount / subtotal : 0;
  const tax = Math.round(
    lines.reduce((t, l) => {
      const r = gstRate(l.unitPrice);
      return t + (l.unitPrice * l.qty * share * r) / (1 + r);
    }, 0),
  );

  return {
    subtotal,
    discount,
    delivery,
    giftWrap,
    codFee,
    tax,
    total: afterDiscount + delivery + giftWrap + codFee,
    itemCount,
    freeDeliveryRemaining: Math.max(0, settings.freeDeliveryThreshold - afterDiscount),
  };
}
