import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ListingView } from "@/components/shop/ListingView";
import { getHub, isHubSlug, lineFromSlug } from "@/lib/catalog";
import { hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";

type Params = { hub: string; line: string };

const lineName = (l: "PROFESSIONAL" | "CASUAL" | null) => (l === "PROFESSIONAL" ? "Professional" : l === "CASUAL" ? "Casual" : "All");

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { hub, line } = await params;
  const l = lineFromSlug(line);
  if (!isHubSlug(hub) || l === undefined) return {};
  const hubName = hub[0]!.toUpperCase() + hub.slice(1);
  return {
    title: l ? `${hubName} · ${lineName(l)}` : `All ${hubName.toLowerCase()}`,
    alternates: { canonical: `/${hub}/${line}` },
  };
}

export default async function LinePage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<RawParams> }) {
  const { hub: hubSlug, line: lineSlug } = await params;
  const line = lineFromSlug(lineSlug);
  if (!isHubSlug(hubSlug) || line === undefined) notFound();
  if (hubSlug === "teens" ? line !== null : line === null) notFound();
  if (!hasDatabase) return <CatalogueUnavailable />;
  const hub = await getHub(hubSlug);
  if (!hub) notFound();

  const title = line ? `${hub.name} · ${lineName(line)}` : `All ${hub.name.toLowerCase()}`;
  return (
    <ListingView
      title={title}
      crumbs={[{ label: hub.name, href: `/${hub.slug}` }, ...(line ? [{ label: lineName(line) }] : [{ label: "All" }])]}
      scope={{ hubSlug: hub.slug, line }}
      searchParams={await searchParams}
      basePath={`/${hub.slug}/${lineSlug}`}
      showLineFilter={false}
    />
  );
}
