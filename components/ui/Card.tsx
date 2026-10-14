import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

/** Paper background, 1 px line border, 24 px padding. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("bg-paper border border-line rounded-[4px] p-6 max-sm:p-[18px]", className)} {...props} />;
}
