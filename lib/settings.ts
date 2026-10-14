import type { PricingSettings } from "@/lib/pricing";
import type { SiteSettings } from "@/lib/content";

export const pricingSettings = (s: SiteSettings): PricingSettings => ({
  freeDeliveryThreshold: s.freeDeliveryThreshold,
  deliveryFee: s.deliveryFee,
  giftWrapFee: s.giftWrapFee,
  codFee: s.codFee,
  expressFee: s.expressFee,
});
