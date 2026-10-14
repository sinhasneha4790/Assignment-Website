import type { Metadata } from "next";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ListingView } from "@/components/shop/ListingView";
import { hasDatabase } from "@/lib/db";
import type { RawParams } from "@/lib/listing-params";

export const metadata: Metadata = { title: "Sale", alternates: { canonical: "/sale" } };

export default async function SalePage({ searchParams }: { searchParams: Promise<RawParams> }) {
  if (!hasDatabase) return <CatalogueUnavailable />;
  return (
    <ListingView
      title={<span className="text-clay">Sale</span>}
      context="Women, men & teens"
      crumbs={[{ label: "Sale" }]}
      scope={{ sale: true }}
      searchParams={await searchParams}
      basePath="/sale"
    />
  );
}
