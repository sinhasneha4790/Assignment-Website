"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { getCartRow, getCartView, MAX_QTY, syncBagCount } from "@/lib/cart";
import { db, hasDatabase } from "@/lib/db";
import { addToWishlistCookie } from "@/lib/wishlist";

export type AddToBagResult =
  | { ok: true; count: number; item: { name: string; colour: string; size: string; image: string; price: number }; subtotal: number }
  | { ok: false; error: string };

const addSchema = z.object({ variantId: z.string().min(1).max(40), qty: z.number().int().min(1).max(MAX_QTY) });

export async function addToBag(input: { variantId: string; qty?: number }): Promise<AddToBagResult> {
  if (!hasDatabase) return { ok: false, error: "The shop isn’t connected yet. Please try again soon." };
  const parsed = addSchema.safeParse({ variantId: input.variantId, qty: input.qty ?? 1 });
  if (!parsed.success) return { ok: false, error: "Please choose a size." };

  const variant = await db().variant.findUnique({
    where: { id: parsed.data.variantId },
    include: { colour: true, product: { include: { images: { where: { kind: "FRONT" }, orderBy: { sort: "asc" } } } } },
  });
  if (!variant || variant.product.status !== "ACTIVE") return { ok: false, error: "This item is no longer available." };

  const cart = (await getCartRow(true))!;
  const existing = await db().cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } } });
  const wanted = (existing?.qty ?? 0) + parsed.data.qty;
  const available = variant.stock - variant.reserved;
  if (available <= 0) return { ok: false, error: `Size ${variant.size} is sold out.` };
  if (wanted > Math.min(available, MAX_QTY)) {
    return { ok: false, error: available < MAX_QTY ? `Only ${available} left in size ${variant.size}.` : `You can add up to ${MAX_QTY} of each item.` };
  }

  await db().cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
    update: { qty: wanted },
    create: { cartId: cart.id, variantId: variant.id, qty: parsed.data.qty },
  });
  const count = await syncBagCount(cart.id);
  revalidatePath("/cart");

  const view = await getCartView();
  const img = variant.product.images.find((i) => i.colourId === variant.colourId) ?? variant.product.images[0];
  return {
    ok: true,
    count,
    subtotal: view.totals.subtotal,
    item: { name: variant.product.name, colour: variant.colour.name, size: variant.size, image: img?.url ?? "/seed/p-tee.svg", price: variant.price ?? variant.product.basePrice },
  };
}

async function ownLine(itemId: string) {
  const cart = await getCartRow(false);
  if (!cart) return null;
  const item = await db().cartItem.findFirst({ where: { id: itemId, cartId: cart.id }, include: { variant: { include: { product: true } } } });
  return item ? { cart, item } : null;
}

export async function updateQty(itemId: string, qty: number): Promise<{ error?: string }> {
  const n = z.number().int().min(1).max(MAX_QTY).safeParse(qty);
  if (!n.success) return { error: `Choose between 1 and ${MAX_QTY}.` };
  const own = await ownLine(itemId);
  if (!own) return { error: "That item isn’t in your bag." };
  const available = own.item.variant.stock - own.item.variant.reserved;
  if (n.data > available) return { error: `Only ${available} left in size ${own.item.variant.size}.` };
  await db().cartItem.update({ where: { id: itemId }, data: { qty: n.data } });
  await syncBagCount(own.cart.id);
  revalidatePath("/cart");
  return {};
}

export async function removeItem(itemId: string): Promise<{ error?: string }> {
  const own = await ownLine(itemId);
  if (!own) return { error: "That item isn’t in your bag." };
  await db().cartItem.delete({ where: { id: itemId } });
  await syncBagCount(own.cart.id);
  revalidatePath("/cart");
  return {};
}

export async function moveToWishlist(itemId: string): Promise<{ error?: string }> {
  const own = await ownLine(itemId);
  if (!own) return { error: "That item isn’t in your bag." };
  await addToWishlistCookie(await cookies(), own.item.variant.product.slug);
  await db().cartItem.delete({ where: { id: itemId } });
  await syncBagCount(own.cart.id);
  revalidatePath("/cart");
  return {};
}

export async function setGiftWrap(on: boolean): Promise<void> {
  const cart = await getCartRow(false);
  if (!cart) return;
  await db().cart.update({ where: { id: cart.id }, data: { giftWrap: on } });
  revalidatePath("/cart");
}

export type CouponState = { error?: string; ok?: string };

export async function applyCoupon(_prev: CouponState, form: FormData): Promise<CouponState> {
  // TODO(phase 3): rate-limit coupon attempts per IP with Upstash.
  const code = z.string().trim().toUpperCase().min(3).max(30).regex(/^[A-Z0-9-]+$/).safeParse(form.get("code"));
  if (!code.success) return { error: "Enter a valid code." };
  const cart = await getCartRow(false);
  if (!cart) return { error: "Your bag is empty." };
  const coupon = await db().coupon.findUnique({ where: { code: code.data } });
  if (!coupon) return { error: "We don’t recognise that code." };
  await db().cart.update({ where: { id: cart.id }, data: { couponCode: coupon.code } });
  revalidatePath("/cart");
  const view = await getCartView();
  if (view.couponError) return { error: view.couponError };
  return { ok: `${coupon.code} applied.` };
}

export async function removeCoupon(): Promise<void> {
  const cart = await getCartRow(false);
  if (!cart) return;
  await db().cart.update({ where: { id: cart.id }, data: { couponCode: null } });
  revalidatePath("/cart");
}
