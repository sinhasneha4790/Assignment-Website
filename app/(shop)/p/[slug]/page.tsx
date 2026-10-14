import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { CatalogueUnavailable } from "@/components/shop/CatalogueUnavailable";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductHero, type HeroProduct } from "@/components/shop/ProductHero";
import { Reviews } from "@/components/shop/Reviews";
import { Accordion } from "@/components/ui/Accordion";
import { sortSizes } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { hasDatabase } from "@/lib/db";
import { completeTheLook, getProduct, getReviews, getSizeCharts, productPath, youMayAlsoLike, type ReviewFilter } from "@/lib/product";
import { getSavedSize } from "@/lib/saved-size";
import { siteUrl } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  if (!hasDatabase) return {};
  const p = await getProduct((await params).slug);
  if (!p) return {};
  const image = p.images[0]?.url;
  return {
    title: p.seoTitle ?? p.name,
    description: p.seoDescription ?? p.description,
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { title: p.name, description: p.description, images: image ? [image] : undefined },
  };
}

const lineName = (l: "PROFESSIONAL" | "CASUAL" | null) => (l === "PROFESSIONAL" ? "Professional" : l === "CASUAL" ? "Casual" : null);

export default async function ProductPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!hasDatabase) return <CatalogueUnavailable />;
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const sp = await searchParams;
  const rf = typeof sp.reviews === "string" && /^(photos|recent|size-[A-Za-z0-9 ]{1,10})$/.test(sp.reviews) ? (sp.reviews as ReviewFilter) : "all";
  const [savedSize, charts, reviews, look, alsoLike, settings] = await Promise.all([getSavedSize(), getSizeCharts(), getReviews(p.id, rf), completeTheLook(p), youMayAlsoLike(p), getSiteSettings()]);

  const line = lineName(p.line);
  const sizes = sortSizes(p.variants.map((v) => v.size));
  const hero: HeroProduct = {
    slug: p.slug,
    name: p.name,
    eyebrow: [p.hub.name, line].filter(Boolean).join(" · "),
    hub: p.hub.slug,
    price: p.basePrice,
    compareAtPrice: p.compareAtPrice,
    ratingAvg: reviews.avg,
    ratingCount: reviews.count,
    fit: p.fit,
    fitNote: p.fitNote,
    modelInfo: p.modelInfo,
    colours: p.colours.map((c) => ({ id: c.id, name: c.name, hex: c.hex })),
    images: p.images.map((i) => ({ url: i.url, alt: i.alt, kind: i.kind, colourId: i.colourId })),
    variants: p.variants.map((v) => ({ id: v.id, colourId: v.colourId, size: v.size, available: Math.max(0, v.stock - v.reserved) })),
    sizes,
  };

  const inStock = p.variants.some((v) => v.stock - v.reserved > 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.variants[0]?.sku,
    image: p.images.filter((i) => i.kind !== "DETAIL").map((i) => `${siteUrl}${i.url}`),
    brand: { "@type": "Brand", name: "Folk & Form" },
    material: p.fabric ?? undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/p/${p.slug}`,
      priceCurrency: "INR",
      price: (p.basePrice / 100).toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(reviews.count > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: reviews.avg.toFixed(1), reviewCount: reviews.count } } : {}),
  };

  const details = (
    <div>
      <Accordion title="Description" defaultOpen>
        <p>{p.description}</p>
      </Accordion>
      <Accordion title="Fabric & care">
        <p>{p.fabric}</p>
        {p.care && <p className="mt-2">{p.care}</p>}
      </Accordion>
      <Accordion title="Fit & measurements">
        <p>{[p.fitNote, p.modelInfo].filter(Boolean).join(". ")}.</p>
        <p className="mt-2">Open the size guide for body measurements in cm and inches.</p>
      </Accordion>
      <Accordion title="Shipping & returns">
        <p>
          Free standard delivery over {formatPrice(settings.freeDeliveryThreshold)} (3–5 days), otherwise {formatPrice(settings.deliveryFee)}. Express delivery 1–2 days for {formatPrice(settings.expressFee)}. Cash on delivery available.
        </p>
        <p className="mt-2">
          Easy returns and free size exchanges within 15 days of delivery for unworn items with tags. <Link href="/policies/returns" className="underline">Returns policy</Link>
        </p>
      </Accordion>
      <Link href={`/book?service=personal-styling&product=${p.slug}`} className="mt-6 flex items-center justify-between gap-4 bg-olive-soft border border-line rounded-[4px] px-5 py-4 hover:text-ink">
        <span>
          <span className="block font-semibold">Style this with a stylist</span>
          <span className="block text-[13px] text-muted">Free 60-min session, in store or on video</span>
        </span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: p.hub.name, href: `/${p.hub.slug}` },
            ...(line ? [{ label: line, href: `/${p.hub.slug}/${line.toLowerCase()}` }] : []),
            { label: p.category.name, href: productPath(p) },
            { label: p.name },
          ]}
        />
        <div className="pb-[72px]">
          <ProductHero product={hero} charts={charts} savedSize={savedSize} details={details} />
        </div>
      </div>

      {look.length > 0 && (
        <section className="wrap pb-[72px]">
          <h2 className="serif text-4xl mb-6 max-sm:text-[26px]">Complete the look</h2>
          <ul className="grid-cards grid-cols-4 max-md:grid-cols-2 max-sm:gap-3!">
            {look.map((c) => (
              <li key={c.slug}>
                <ProductCard product={{ ...c, badge: null }} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Reviews product={p} data={reviews} filter={rf} savedSize={savedSize} />

      {alsoLike.length > 0 && (
        <section className="wrap pb-[72px]">
          <h2 className="serif text-4xl mb-6 max-sm:text-[26px]">You may also like</h2>
          <ul className="grid-cards grid-cols-4 max-md:grid-cols-2 max-sm:gap-3!">
            {alsoLike.map((c) => (
              <li key={c.slug}>
                <ProductCard product={{ ...c, badge: null }} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
