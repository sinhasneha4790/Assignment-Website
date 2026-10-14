import Link from "next/link";
import { siteUrl } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb plus BreadcrumbList JSON-LD. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${siteUrl}${c.href}` } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-muted py-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ol className="flex flex-wrap gap-1">
        {all.map((c, i) => (
          <li key={i} className="flex gap-1">
            {i > 0 && <span aria-hidden>›</span>}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="text-muted hover:text-olive">{c.label}</Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
