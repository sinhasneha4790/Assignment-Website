import type { Metadata } from "next";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ListingView } from "@/components/shop/ListingView";
import { hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";

export const metadata: Metadata = { title: "New in", alternates: { canonical: "/new-in" } };

export default async function NewInPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  if (!hasDatabase) return <CatalogueUnavailable />;
  const sp = await searchParams;
  return (
    <ListingView
      title="New in"
      context="Women, men & teens"
      crumbs={[{ label: "New in" }]}
      scope={{ newIn: true }}
      searchParams={{ sort: "newest", ...sp }}
      basePath="/new-in"
    />
  );
}
