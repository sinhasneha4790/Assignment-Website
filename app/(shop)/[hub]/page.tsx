import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { HubView, type HubLineData } from "@/components/shop/HubView";
import { categoriesWithProducts, cardsWhere, getHub, isHubSlug, slugFromLine } from "@/lib/catalog";
import { db, hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";
import { hubContent, hubOccasions, type HubSlug } from "@/prisma/seed-data";

type Params = { hub: string };

type HubBlock = { lines: (typeof hubContent)[HubSlug]; occasions: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { hub } = await params;
  if (!isHubSlug(hub)) return {};
  const name = hub[0]!.toUpperCase() + hub.slice(1);
  return {
    title: `${name}’s clothing`,
    description: hubContent[hub].professional?.intro ?? hubContent[hub].all?.intro,
    alternates: { canonical: `/${hub}` },
  };
}

export default async function HubPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<RawParams> }) {
  const { hub: slug } = await params;
  if (!isHubSlug(slug)) notFound();
  if (!hasDatabase) return <CatalogueUnavailable />;
  const hub = await getHub(slug);
  if (!hub) notFound();

  const block = await db().contentBlock.findUnique({ where: { key: `hub.${slug}` } });
  const content = (block?.payload as HubBlock | undefined) ?? { lines: hubContent[slug], occasions: hubOccasions[slug] };
  // Fixed order: JSON from Postgres doesn't keep key order.
  const lineKeys = (["professional", "casual", "all"] as const).filter((k) => content.lines[k]);

  const lines: HubLineData[] = await Promise.all(
    lineKeys.map(async (key) => {
      const line = key === "professional" ? "PROFESSIONAL" : key === "casual" ? "CASUAL" : null;
      const [cats, trending] = await Promise.all([
        categoriesWithProducts(hub.id, line, 8),
        cardsWhere({ hubId: hub.id, line }, { take: 4, orderBy: [{ ratingCount: "desc" }, { sort: "asc" }] }),
      ]);
      return {
        key,
        label: key === "professional" ? "Professional" : key === "casual" ? "Casual" : "All",
        ...content.lines[key]!,
        categories: cats.map((c) => ({ name: c.name, image: c.image ?? "/seed/p-tee.svg", href: `/${slug}/${slugFromLine(line)}/${c.slug}` })),
        trending,
        allHref: `/${slug}/${slugFromLine(line)}`,
      };
    }),
  );

  const sp = await searchParams;
  const initial = lines.find((l) => l.key === sp.line)?.key ?? lines[0]!.key;
  return <HubView hubSlug={slug} hubName={hub.name} lines={lines} initialLine={initial} occasions={content.occasions} />;
}
