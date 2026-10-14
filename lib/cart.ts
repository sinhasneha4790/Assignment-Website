import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { BAG_COUNT_COOKIE } from "@/lib/bag-count";
import { getSiteSettings } from "@/lib/content";
import { db } from "@/lib/db";
import { lineLabel } from "@/lib/format";
import { checkCoupon, computeTotals, type Totals } from "@/lib/pricing";
import { pricingSettings } from "@/lib/settings";

/** httpOnly cookie identifying a guest cart; merged into the account cart on login (phase 4). */
export const CART_COOKIE = "ff_cart";
export const MAX_QTY = 10;

const secure = process.env.NODE_ENV === "production";

export async function getCartRow(create: boolean) {
  const jar = await cookies();
  let anonId = jar.get(CART_COOKIE)?.value;
  if (anonId) {
    const cart = await db().cart.findUnique({ where: { anonId } });
    if (cart) return cart;
  }
  if (!create) return null;
  anonId = randomUUID();
  jar.set(CART_COOKIE, anonId, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 60 });
  return db().cart.create({ data: { anonId } });
}

export type CartLine = {
  id: string;
  variantId: string;
  productSlug: string;
  name: string;
  colour: string;
  size: string;
  note: string;
  image: string;
  unitPrice: number;
  compareAtPrice: number | null;
  qty: number;
  available: number;
};

export type CartView = {
  id: string | null;
  lines: CartLine[];
  giftWrap: boolean;
  couponCode: string | null;
  couponError: string | null;
  totals: Totals;
};

/** Loads the cart and prices it from the database (never from the browser). */
export async function getCartView(): Promise<CartView> {
  const settings = pricingSettings(await getSiteSettings());
  const cart = await getCartRow(false);
  const empty = { id: null, lines: [], giftWrap: false, couponCode: null, couponError: null, totals: computeTotals({ lines: [], settings }) };
  if (!cart) return empty;

  const items = await db().cartItem.findMany({
    where: { cartId: cart.id },
    orderBy: { createdAt: "asc" },
    include: {
      variant: {
        include: {
          colour: true,
          product: { include: { hub: true, images: { where: { kind: "FRONT" }, orderBy: { sort: "asc" } } } },
        },
      },
    },
  });

  const lines: CartLine[] = items
    .filter((i) => i.variant.product.status === "ACTIVE")
    .map((i) => {
      const v = i.variant;
      const p = v.product;
      const img = p.images.find((x) => x.colourId === v.colourId) ?? p.images[0];
      return {
        id: i.id,
        variantId: v.id,
        productSlug: p.slug,
        name: p.name,
        colour: v.colour.name,
        size: v.size,
        note: lineLabel(p.hub.name, p.line),
        image: img?.url ?? "/seed/p-tee.svg",
        unitPrice: v.price ?? p.basePrice,
        compareAtPrice: p.compareAtPrice,
        qty: i.qty,
        available: Math.max(0, v.stock - v.reserved),
      };
    });

  let discount = 0;
  let couponError: string | null = null;
  const subtotal = lines.reduce((t, l) => t + l.unitPrice * l.qty, 0);
  if (cart.couponCode) {
    const coupon = await db().coupon.findUnique({ where: { code: cart.couponCode } });
    const check = coupon ? checkCoupon(coupon, subtotal) : ({ ok: false, reason: "This code is no longer valid." } as const);
    if (check.ok) discount = check.discount;
    else couponError = check.reason;
  }

  return {
    id: cart.id,
    lines,
    giftWrap: cart.giftWrap,
    couponCode: cart.couponCode,
    couponError,
    totals: computeTotals({ lines, settings, discount, giftWrap: cart.giftWrap }),
  };
}

/** Keeps the header's bag count cookie in step with the cart. */
export async function syncBagCount(cartId: string) {
  const agg = await db().cartItem.aggregate({ where: { cartId }, _sum: { qty: true } });
  const count = agg._sum.qty ?? 0;
  (await cookies()).set(BAG_COUNT_COOKIE, String(count), { sameSite: "lax", secure, path: "/", maxAge: 60 * 60 * 24 * 60 });
  return count;
}
