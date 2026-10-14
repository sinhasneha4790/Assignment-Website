import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type Props = { selected?: boolean; soldOut?: boolean } & ComponentProps<"button">;

/** Min 52×48 px; selected = ink; sold out = struck through and disabled. */
export function SizeButton({ selected, soldOut, className, children, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      disabled={soldOut || props.disabled}
      className={cx(
        "min-w-[52px] min-h-12 px-2 border rounded-[2px] text-[13px] font-semibold cursor-pointer",
        selected ? "bg-ink text-paper border-ink" : "bg-white text-ink border-field hover:border-ink",
        soldOut && "bg-cream text-faint line-through cursor-not-allowed hover:border-field",
        className,
      )}
      {...props}
    >
      {children}
      {soldOut && <span className="sr-only"> (sold out)</span>}
    </button>
  );
}
