import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ListingView } from "@/components/shop/ListingView";
import { db, hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";

type Params = { slug: string };

const getCollection = async (slug: string) => (hasDatabase ? db().collection.findUnique({ where: { slug } }) : null);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = await getCollection((await params).slug);
  return c ? { title: c.title, description: c.story ?? undefined, alternates: { canonical: `/collections/${c.slug}` } } : {};
}

export default async function CollectionPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<RawParams> }) {
  if (!hasDatabase) return <CatalogueUnavailable />;
  const c = await getCollection((await params).slug);
  if (!c) notFound();
  return (
    <ListingView
      title={c.title}
      context={c.isLookbook ? "Shop the look" : undefined}
      crumbs={[{ label: c.isLookbook ? "Lookbook" : "Collections" }, { label: c.title }]}
      scope={{ productIds: c.productIds }}
      searchParams={await searchParams}
      basePath={`/collections/${c.slug}`}
    />
  );
}
