import type { Metadata } from "next";
import Link from "next/link";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ListingView } from "@/components/shop/ListingView";
import { SearchBar } from "@/components/shop/SearchBar";
import { chipClass } from "@/components/ui/Chip";
import { slugFromLine } from "@/lib/catalog";
import { db, hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";
import { matchingCategories, searchProductIds, suggestSpelling } from "@/lib/search";
import { popularSearches } from "@/prisma/seed-data";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

const HUB_TABS = [
  { slug: "", label: "All" },
  { slug: "women", label: "Women" },
  { slug: "men", label: "Men" },
  { slug: "teens", label: "Teens" },
];

function EmptyState({ q, suggestion }: { q: string; suggestion: string | null }) {
  return (
    <div className="bg-paper border border-line rounded-[4px] px-6 py-12 text-center flex flex-col items-center gap-4">
      <h2 className="serif text-[30px] max-sm:text-[24px]">No results for “{q}”</h2>
      <p className="text-muted">
        {suggestion ? (
          <>
            Did you mean <Link href={`/search?q=${encodeURIComponent(suggestion)}`} className="underline text-ink">{suggestion}</Link>?{" "}
          </>
        ) : null}
        Check the spelling or try a broader word.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/women" className={chipClass(false)}>Women</Link>
        <Link href="/men" className={chipClass(false)}>Men</Link>
        <Link href="/teens" className={chipClass(false)}>Teens</Link>
        <Link href="/new-in" className={chipClass(false)}>New in</Link>
      </div>
      <Link href="/book?service=personal-styling" className="text-[13px] underline">Or ask a stylist to find it for you</Link>
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().slice(0, 80);
  const hub = typeof sp.hub === "string" && ["women", "men", "teens"].includes(sp.hub) ? sp.hub : "";

  let popular = popularSearches;
  if (hasDatabase) {
    const block = await db().contentBlock.findUnique({ where: { key: "search.popular" } });
    if (Array.isArray(block?.payload)) popular = block.payload as string[];
  }

  if (!q) {
    return (
      <>
        <SearchBar initial="" popular={popular} />
        <div className="wrap py-16 text-muted">Start typing to search the shop.</div>
      </>
    );
  }
  if (!hasDatabase) return <CatalogueUnavailable />;

  const [hits, cats] = await Promise.all([searchProductIds(q), matchingCategories(q)]);
  const suggestion = hits.length === 0 ? await suggestSpelling(q) : null;

  const tabHref = (h: string) => {
    const p = new URLSearchParams({ q });
    if (h) p.set("hub", h);
    return `/search?${p.toString()}`;
  };

  return (
    <>
      <SearchBar initial={q} popular={popular} />
      <ListingView
        title={`Results for “${q}”`}
        crumbs={[{ label: "Search" }]}
        scope={{ q, hubSlug: hub || undefined }}
        searchParams={sp}
        basePath="/search"
        subtitle={
          cats.length > 0 ? (
            <p className="text-[13px] text-muted">
              Also showing{" "}
              {cats.map((c, i) => (
                <span key={`${c.hubSlug}-${c.slug}`}>
                  {i > 0 && " and "}
                  <Link className="underline text-ink" href={`/${c.hubSlug}/${slugFromLine(c.line as "PROFESSIONAL" | "CASUAL" | null)}/${c.slug}`}>
                    {c.hubName}’s {c.name.toLowerCase()}
                  </Link>
                </span>
              ))}
            </p>
          ) : undefined
        }
        toolbar={
          <nav aria-label="Hub" className="flex gap-2 flex-wrap mb-4 max-md:mt-4">
            {HUB_TABS.map((t) => (
              <Link key={t.label} href={tabHref(t.slug)} aria-current={hub === t.slug ? "page" : undefined} className={chipClass(hub === t.slug)}>
                {t.label}
              </Link>
            ))}
          </nav>
        }
        empty={<EmptyState q={q} suggestion={suggestion} />}
      />
    </>
  );
}
