import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { queryListing, type ListingScope } from "@/lib/catalog";
import { activeFilterCount, PAGE_SIZE, parseListingParams, type RawParams } from "@/lib/listing-params";
import { getSavedSize } from "@/lib/saved-size";
import { ActiveFilters } from "./ActiveFilters";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { FilterPanel } from "./FilterPanel";
import { MobileFilters } from "./MobileFilters";
import { ProductCard } from "./ProductCard";
import { RecentlyViewed } from "./RecentlyViewed";
import { SortSelect } from "./SortSelect";

type Props = {
  title: ReactNode;
  /** Shown after the count, e.g. "Women · Professional". */
  context?: string;
  crumbs: Crumb[];
  scope: ListingScope;
  searchParams: RawParams;
  basePath: string;
  showLineFilter?: boolean;
  /** Extra links under the title (search: "also showing …"). */
  subtitle?: ReactNode;
  /** Rendered instead of the grid when nothing matches. */
  empty?: ReactNode;
  /** Above the grid (search hub tabs). */
  toolbar?: ReactNode;
};

/** Breadcrumb, title with count, sort, filters (sidebar / bottom sheet), grid, "Load more", recently viewed. */
export async function ListingView({ title, context, crumbs, scope, searchParams, basePath, showLineFilter = true, subtitle, empty, toolbar }: Props) {
  const filters = parseListingParams(searchParams);
  const { items, total, facets, savedSize } = await queryListing(scope, filters, await getSavedSize());
  // Nothing in scope at all (e.g. a search with no hits): no filters to offer.
  const hasFacets = facets.priceMax > 0;
  const nFilters = activeFilterCount(filters, savedSize);

  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) if (typeof v === "string") next.set(k, v);
  next.set("page", String(filters.page + 1));

  const panel = <FilterPanel facets={facets} savedSize={savedSize} showLine={showLineFilter} />;

  return (
    <div className="wrap pb-[72px]">
      <Breadcrumb items={crumbs} />
      <div className="flex justify-between items-end gap-4 flex-wrap mb-6">
        <div>
          <h1 className="serif text-[44px] leading-tight max-sm:text-[34px]">{title}</h1>
          <p className="text-[13px] text-muted mt-1">
            {total} {total === 1 ? "style" : "styles"}
            {context ? ` · ${context}` : ""}
          </p>
          {subtitle}
        </div>
        <SortSelect value={filters.sort} />
      </div>

      <div className={hasFacets ? "grid grid-cols-[240px_minmax(0,1fr)] gap-10 max-md:grid-cols-1 max-md:gap-4" : ""}>
        {hasFacets && (
          <aside aria-label="Filters" className="max-md:hidden">
            {panel}
          </aside>
        )}
        <div className="min-w-0">
          {hasFacets && (
            <MobileFilters count={nFilters} total={total}>
              {panel}
            </MobileFilters>
          )}
          {toolbar}
          <div className="max-md:mt-4">
            <ActiveFilters savedSize={savedSize} />
          </div>
          {items.length === 0 ? (
            (empty ?? (
              <div className="bg-paper border border-line rounded-[4px] p-10 text-center">
                <p className="serif text-[26px] mb-2">Nothing matches those filters.</p>
                <p className="text-muted">Try removing a filter or clearing them all.</p>
              </div>
            ))
          ) : (
            <>
              <ul className="grid-cards grid-cols-3 max-md:grid-cols-2 max-sm:gap-3!">
                {items.map((p, i) => (
                  <li key={p.slug}>
                    <ProductCard product={p} sizes="(max-width: 900px) 50vw, 290px" priority={i < 3} />
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center gap-3 mt-10">
                <p className="text-[13px] text-muted" aria-live="polite">
                  Showing {items.length} of {total}
                </p>
                {items.length < total && (
                  <Link href={`${basePath}?${next.toString()}`} scroll={false} className={buttonClass("outline")}>
                    Load more
                  </Link>
                )}
              </div>
            </>
          )}
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}

export { PAGE_SIZE };
