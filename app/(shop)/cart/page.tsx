import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CartLineControls } from "@/components/cart/CartLineControls";
import { CouponForm } from "@/components/cart/CouponForm";
import { GiftWrapToggle } from "@/components/cart/GiftWrapToggle";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ProductCard } from "@/components/shop/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCartView, MAX_QTY } from "@/lib/cart";
import { cardsWhere } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";
import { hasDatabase } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { formatDeliveryDate, addWorkingDays } from "@/lib/pincode";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

const ACCESSORY_CATEGORIES = ["bags-belts", "belts", "bags", "scarves", "formal-footwear"];

export default async function CartPage() {
  if (!hasDatabase) return <CatalogueUnavailable />;
  const [cart, settings] = await Promise.all([getCartView(), getSiteSettings()]);
  const { totals } = cart;
  const deliveryBy = formatDeliveryDate(addWorkingDays(new Date(), 4));
  const goesWell = await cardsWhere(
    { category: { slug: { in: ACCESSORY_CATEGORIES } }, slug: { notIn: cart.lines.map((l) => l.productSlug) } },
    { take: 4, orderBy: [{ ratingCount: "desc" }, { sort: "asc" }] },
  );
  const progress = Math.min(100, Math.round(((settings.freeDeliveryThreshold - totals.freeDeliveryRemaining) / settings.freeDeliveryThreshold) * 100));

  if (cart.lines.length === 0) {
    return (
      <div className="wrap py-20 pb-[72px]">
        <h1 className="serif text-[44px] max-sm:text-[34px]">Your bag is empty</h1>
        <p className="text-muted mt-2 mb-6">Save time next visit: sign in to see anything you added before.</p>
        <div className="flex gap-3 flex-wrap">
          <ButtonLink href="/new-in">Shop new in</ButtonLink>
          <ButtonLink href="/login?next=/cart" variant="outline">Sign in</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-[72px]">
      <div className="wrap grid grid-cols-[minmax(0,1fr)_340px] gap-12 pt-10 max-md:grid-cols-1 max-md:gap-8 max-sm:pt-6">
        <div>
          <h1 className="serif text-[48px] leading-tight max-sm:text-[34px]">
            Your bag <span className="text-[24px] text-muted">({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})</span>
          </h1>

          <div className="bg-paper border border-line rounded-[4px] px-5 py-4 mt-6">
            <p className="text-sm mb-3">
              {totals.freeDeliveryRemaining > 0 ? (
                <>Add <b>{formatPrice(totals.freeDeliveryRemaining)}</b> more for free delivery.</>
              ) : (
                "You have free delivery."
              )}
            </p>
            <div className="h-1.5 bg-line rounded-full overflow-hidden" role="progressbar" aria-label="Progress to free delivery" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span className="block h-full bg-olive" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="mt-6">
            {cart.lines.map((l) => (
              <li key={l.id} className="flex gap-5 py-5 border-b border-line max-sm:gap-3">
                <Link href={`/p/${l.productSlug}`} className="relative w-[120px] h-[160px] bg-sand shrink-0 max-sm:w-[90px] max-sm:h-[120px]">
                  <Image src={l.image} alt={l.name} fill sizes="120px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between gap-3">
                    <Link href={`/p/${l.productSlug}`} className="font-semibold">{l.name}</Link>
                    <span className="font-semibold whitespace-nowrap">{formatPrice(l.unitPrice * l.qty)}</span>
                  </div>
                  <p className="text-[13px] text-muted">{l.colour} · Size {l.size} · {l.note}</p>
                  <p className="text-[13px] text-muted">
                    {l.available >= l.qty ? `In stock · Delivery by ${deliveryBy}` : <span className="text-clay">Only {l.available} left — reduce the quantity</span>}
                  </p>
                  <div className="mt-auto pt-3">
                    <CartLineControls itemId={l.id} qty={l.qty} max={Math.min(MAX_QTY, l.available)} name={l.name} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <GiftWrapToggle on={cart.giftWrap} fee={formatPrice(settings.giftWrapFee)} />
          </div>
        </div>

        <aside aria-label="Order summary" className="flex flex-col gap-4 md:sticky md:top-[140px] self-start w-full">
          <Card className="flex flex-col gap-4">
            <h2 className="serif text-[28px]">Order summary</h2>
            <CouponForm applied={cart.couponCode} error={cart.couponError} />
            <dl className="flex flex-col gap-3 text-[15px]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Discount</dt><dd>{totals.discount ? formatPrice(-totals.discount) : "– ₹0"}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{totals.delivery ? formatPrice(totals.delivery) : "Free"}</dd></div>
              {totals.giftWrap > 0 && <div className="flex justify-between"><dt>Gift wrap</dt><dd>{formatPrice(totals.giftWrap)}</dd></div>}
              <div className="text-[13px] text-muted">Prices include GST</div>
              <div className="flex justify-between border-t border-line pt-4 text-[19px] font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
            </dl>
            <ButtonLink href="/checkout" block>Checkout securely</ButtonLink>
            <p className="text-[12px] text-muted text-center">UPI · Cards · Net banking · Wallets · COD · EMI</p>
          </Card>
          <Card className="py-4! px-4!">
            <p className="font-semibold">Free returns &amp; size exchanges</p>
            <p className="text-[13px] text-muted">Within 15 days of delivery. Pickup from your door.</p>
          </Card>
        </aside>
      </div>

      {goesWell.length > 0 && (
        <section className="wrap pt-16">
          <h2 className="serif text-4xl mb-6 max-sm:text-[26px]">Goes well with</h2>
          <ul className="grid-cards grid-cols-4 max-md:grid-cols-2 max-sm:gap-3!">
            {goesWell.map((c) => (
              <li key={c.slug}>
                <ProductCard product={{ ...c, badge: null }} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
