import type { ReactNode } from "react";

/** Native details/summary for product details and FAQs. */
export function Accordion({ title, children, defaultOpen }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="border-b border-line py-4 group" open={defaultOpen}>
      <summary className="cursor-pointer font-semibold min-h-11 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-2 text-muted">{children}</div>
    </details>
  );
}
