import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "solid" | "outline" | "olive" | "light" | "outline-light";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-ink text-paper border-ink hover:bg-olive hover:border-olive hover:text-paper",
  outline: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  olive: "bg-olive text-paper border-olive hover:bg-ink hover:border-ink hover:text-paper",
  // For dark or olive backgrounds
  light: "bg-paper text-ink border-paper hover:bg-cream hover:text-ink",
  "outline-light": "bg-transparent text-paper border-paper hover:bg-paper hover:text-ink",
};

export function buttonClass(variant: ButtonVariant = "solid", block = false, className?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 min-h-12 px-[26px] border rounded-[2px] font-sans text-sm font-semibold tracking-[0.04em] whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    block && "w-full",
    className,
  );
}

type Common = { variant?: ButtonVariant; block?: boolean };

export function Button({ variant, block, className, type = "button", ...props }: Common & ComponentProps<"button">) {
  return <button type={type} className={buttonClass(variant, block, className)} {...props} />;
}

export function ButtonLink({ variant, block, className, ...props }: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClass(variant, block, className)} {...props} />;
}
