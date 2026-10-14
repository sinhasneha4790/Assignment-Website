import Image from "next/image";
import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

type Props = {
  src: string;
  alt: string;
  /** Responsive `sizes` hint for next/image. */
  sizes: string;
  caption?: string;
  badge?: string | null;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** The mockup's `pic`: a sand frame with a cover-fit image, optional badge and caption tag. */
export function ImageFrame({ src, alt, sizes, caption, badge, priority, className, style }: Props) {
  return (
    <div className={cx("relative overflow-hidden bg-sand block", className)} style={style}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {badge && (
        <span className="absolute top-3 left-3 z-[1] bg-paper text-ink text-[11px] font-semibold px-2 py-1 tracking-[0.08em] uppercase">
          {badge}
        </span>
      )}
      {caption && (
        <span className="absolute left-3 bottom-3 z-[1] bg-paper/90 text-ink text-xs font-semibold px-2.5 py-1 tracking-[0.04em]">
          {caption}
        </span>
      )}
    </div>
  );
}
