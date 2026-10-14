import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { ProductCardData } from "@/lib/content";
import { formatPrice } from "@/lib/format";

/** 3:4 image, optional badge top-left, name and price on one row, line or colour note under. */
export function ProductCard({
  product,
  sizes = "(max-width: 900px) 50vw, 280px",
  showSwatches = false,
  priority = false,
}: {
  product: ProductCardData;
  sizes?: string;
  showSwatches?: boolean;
  priority?: boolean;
}) {
  return (
    <Link href={`/p/${product.slug}`} className="flex flex-col gap-2 group">
      <ImageFrame src={product.image} alt={product.alt} badge={product.badge} sizes={sizes} priority={priority} className="aspect-[3/4]" />
      <div className="flex justify-between gap-2 max-sm:flex-col max-sm:gap-0">
        <span className="group-hover:underline max-sm:text-[13px]">{product.name}</span>
        <span className="font-semibold whitespace-nowrap max-sm:text-[13px]">
          {formatPrice(product.price)}
          {product.compareAtPrice && (
            <span className="text-muted line-through font-normal ml-1.5">
              <span className="sr-only">was </span>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </span>
      </div>
      {showSwatches && product.swatches?.length ? (
        <div className="flex gap-1.5" aria-label={`${product.swatches.length} colours`}>
          {product.swatches.slice(0, 5).map((s) => (
            <span key={s.name} title={s.name} className="w-3 h-3 rounded-full border border-ink/15" style={{ background: s.hex }} />
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-muted max-sm:hidden">{product.note}</div>
      )}
    </Link>
  );
}
