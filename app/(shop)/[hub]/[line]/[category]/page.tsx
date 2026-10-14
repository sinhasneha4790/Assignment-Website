import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ListingView } from "@/components/shop/ListingView";
import { getCategory, getHub, isHubSlug, lineFromSlug } from "@/lib/catalog";
import { hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";

type Params = { hub: string; line: string; category: string };

async function load({ hub: hubSlug, line: lineSlug, category: catSlug }: Params) {
  const line = lineFromSlug(lineSlug);
  if (!isHubSlug(hubSlug) || line === undefined || !hasDatabase) return null;
  const hub = await getHub(hubSlug);
  if (!hub) return null;
  const category = await getCategory(hub.id, line, catSlug);
  return category ? { hub, line, category } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await params;
  const data = await load(p);
  if (!data) return {};
  return {
    title: `${data.hub.name}’s ${data.category.name.toLowerCase()}`,
    description: `Shop ${data.category.name.toLowerCase()} for ${data.hub.name.toLowerCase()} at Folk & Form — sizes XS–3XL, free size exchanges and cash on delivery.`,
    // Filtered variants of this listing all point at the clean URL.
    alternates: { canonical: `/${p.hub}/${p.line}/${p.category}` },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<RawParams> }) {
  const p = await params;
  if (!hasDatabase) return <CatalogueUnavailable />;
  const data = await load(p);
  if (!data) notFound();
  const { hub, line, category } = data;
  const lineName = line === "PROFESSIONAL" ? "Professional" : line === "CASUAL" ? "Casual" : null;

  return (
    <ListingView
      title={category.name}
      context={lineName ? `${hub.name} · ${lineName}` : hub.name}
      crumbs={[
        { label: hub.name, href: `/${hub.slug}` },
        ...(lineName ? [{ label: lineName, href: `/${hub.slug}/${p.line}` }] : []),
        { label: category.name },
      ]}
      scope={{ hubSlug: hub.slug, categoryId: category.id }}
      searchParams={await searchParams}
      basePath={`/${p.hub}/${p.line}/${p.category}`}
      showLineFilter={false}
    />
  );
}
