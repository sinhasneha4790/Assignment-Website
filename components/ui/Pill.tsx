import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

const tones = {
  good: "bg-olive-soft text-olive",
  neutral: "bg-neutral-bg text-muted",
  warn: "bg-warn-bg text-warn-fg",
};

/** Status badge: olive (good), grey (neutral), warn. */
export function Pill({ tone = "good", className, ...props }: { tone?: keyof typeof tones } & ComponentProps<"span">) {
  return <span className={cx("inline-block px-2.5 py-[3px] rounded-full text-xs font-semibold", tones[tone], className)} {...props} />;
}
