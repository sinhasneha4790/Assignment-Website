import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { SizeGuide } from "@/components/shop/SizeGuide";
import { hasDatabase } from "@/lib/db";
import { getSizeCharts } from "@/lib/product";
import { getSavedSize } from "@/lib/saved-size";

export const metadata: Metadata = {
  title: "Size guide",
  description: "Body measurements for women, men and teens in cm and inches, with international size conversion.",
  alternates: { canonical: "/size-guide" },
};

export default async function SizeGuidePage({ searchParams }: { searchParams: Promise<{ hub?: string }> }) {
  if (!hasDatabase) return <CatalogueUnavailable />;
  const [{ hub }, charts, savedSize] = await Promise.all([searchParams, getSizeCharts(), getSavedSize()]);
  return (
    <div className="wrap pb-[72px] max-w-[880px]!">
      <Breadcrumb items={[{ label: "Size guide" }]} />
      <h1 className="serif text-[44px] mb-2 max-sm:text-[34px]">Size guide</h1>
      <p className="text-muted mb-8">Find your size in cm or inches. Still unsure? A stylist can fit you for free, in store or on video.</p>
      <SizeGuide charts={charts} initialHub={hub ?? "women"} savedSize={savedSize} />
    </div>
  );
}
