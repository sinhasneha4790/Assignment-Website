import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

export function chipClass(on = false, className?: string) {
  return cx(
    "inline-flex items-center justify-center min-h-10 px-4 rounded-full border text-[13px] font-medium whitespace-nowrap cursor-pointer transition-colors",
    on ? "bg-ink text-paper border-ink hover:text-paper" : "bg-paper text-ink border-line hover:border-ink",
    className,
  );
}

type ChipProps = { on?: boolean } & ComponentProps<"button">;

export function Chip({ on, className, type = "button", ...props }: ChipProps) {
  return <button type={type} aria-pressed={on} className={chipClass(on, className)} {...props} />;
}

export function ChipLink({ on, className, ...props }: { on?: boolean } & ComponentProps<typeof Link>) {
  return <Link aria-current={on ? "page" : undefined} className={chipClass(on, className)} {...props} />;
}
