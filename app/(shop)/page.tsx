import Link from "next/link";
import { HeroCarousel } from "@/components/shop/HeroCarousel";
import { ProductCard } from "@/components/shop/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChipLink } from "@/components/ui/Chip";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { getHomeContent } from "@/lib/content";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import { mainNav } from "@/lib/nav";
import { siteName, siteUrl } from "@/lib/site";

// Re-render at most every 5 minutes; admin edits also call /api/revalidate.
export const revalidate = 300;

const editTone = {
  dark: { box: "bg-ph-dark", eyebrow: "text-on-dark-soft!", title: "text-paper", link: "text-on-dark border-on-dark" },
  clay: { box: "bg-ph-clay", eyebrow: "", title: "text-ink", link: "text-ink border-ink" },
};

function SectionHead({ title, link }: { title: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex justify-between items-end mb-6 flex-wrap gap-3 max-sm:mb-3">
      <h2 className="serif text-4xl max-sm:text-2xl">{title}</h2>
      {link && (
        <Link href={link.href} className="text-[13px] underline">
          {link.label}
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const home = await getHomeContent();

  const organization = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
  };

  return (
    <div className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <h1 className="sr-only">Folk &amp; Form — clothes for teens, women and men</h1>

      {/* Phone: hub chip row above the hero */}
      <nav aria-label="Hubs" className="sm:hidden flex gap-2 px-4 py-3 overflow-x-auto">
        {mainNav.filter((n) => n.label !== "New in").map((n) => (
          <ChipLink key={n.label} href={n.href}>
            {n.label}
          </ChipLink>
        ))}
      </nav>

      <HeroCarousel slides={home.carousel} />

      <section className="wrap pb-[72px] max-sm:pb-6">
        <SectionHead title="Shop by hub" link={{ href: "/size-guide", label: "Find your size" }} />
        <div className="grid-cards grid-cols-3 max-sm:gap-2!">
          {home.hubs.map((h) => (
            <Link key={h.slug} href={`/${h.slug}`} className="flex flex-col gap-3 max-sm:gap-1.5">
              <ImageFrame src={h.image} alt={`${h.name}'s collection`} sizes="(max-width: 760px) 33vw, 380px" className="h-[380px] max-sm:h-[140px]" />
              <div className="flex justify-between max-sm:flex-col">
                <span className="serif text-2xl max-sm:font-sans max-sm:text-[13px] max-sm:font-bold max-sm:tracking-normal">{h.name}</span>
                <span className="text-[13px] text-muted max-sm:hidden">{h.tagline}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap pb-[72px] max-sm:pb-6">
        <div className="grid-cards grid-cols-2 max-md:grid-cols-1">
          {home.edits.map((e) => {
            const t = editTone[e.tone];
            return (
              <Link key={e.title} href={e.href} className={cx("h-[300px] flex flex-col items-start justify-end gap-2 p-8 max-sm:h-[220px] max-sm:p-5", t.box)}>
                <span className={cx("eyebrow", t.eyebrow)}>{e.eyebrow}</span>
                <span className={cx("serif text-[34px] max-sm:text-[26px]", t.title)}>{e.title}</span>
                <span className={cx("text-sm border-b", t.link)}>{e.cta}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap pb-[72px] max-sm:pb-6">
        <SectionHead title="New in" link={{ href: "/new-in", label: "View all" }} />
        <div className="grid-cards grid-cols-4 max-md:grid-cols-2 max-sm:gap-3!">
          {home.newIn.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-olive text-paper py-16 mb-[72px] max-sm:mx-4 max-sm:mb-6 max-sm:p-5">
        <div className="wrap flex flex-wrap gap-10 items-center max-sm:p-0! max-sm:gap-2.5">
          <div className="flex-[1_1_420px] flex flex-col gap-3.5 max-sm:gap-2.5">
            <div className="eyebrow text-olive-tint!">{home.stylist.eyebrow}</div>
            <h2 className="serif text-[42px] leading-[1.1] max-sm:text-2xl">{home.stylist.title}</h2>
            <p className="text-olive-soft max-w-[460px] max-sm:hidden">{home.stylist.text}</p>
            <p className="text-olive-soft text-[13px] sm:hidden">{home.stylist.mobileText}</p>
          </div>
          <div className="flex gap-3 flex-wrap max-sm:w-full">
            <ButtonLink href={home.stylist.cta.href} variant="light" className="max-sm:w-full">{home.stylist.cta.label}</ButtonLink>
            <ButtonLink href={home.stylist.cta2.href} variant="outline-light" className="max-sm:hidden">{home.stylist.cta2.label}</ButtonLink>
          </div>
        </div>
      </section>

      <section className="wrap pb-[72px] max-sm:pb-6">
        <SectionHead title="Lookbook: Monday to Sunday" />
        <div className="grid-cards grid-cols-3 max-md:grid-cols-1">
          {home.lookbooks.map((l) => (
            <Link key={l.slug} href={`/collections/${l.slug}`} className="flex flex-col gap-2.5">
              <ImageFrame src={l.image} alt={l.alt} caption={l.title} sizes="(max-width: 900px) 100vw, 380px" className="h-[440px] max-sm:h-[320px]" />
              <span className="text-[13px] underline">
                Shop the look · {l.pieces} pieces from {formatPrice(l.total)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap pb-[72px] max-sm:pb-6">
        <SectionHead title="What customers say" />
        <div className="grid-cards grid-cols-3 max-md:grid-cols-1">
          {home.reviews.map((r) => (
            <Card key={r.author} className="flex flex-col gap-3">
              <div role="img" aria-label={`${r.rating} out of 5 stars`} className="text-olive tracking-[2px]">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <p className="serif text-[19px]">“{r.quote}”</p>
              <div className="text-[13px] text-muted">{r.author}</div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="Our promises" className="border-y border-line bg-paper max-sm:border-0 max-sm:bg-transparent max-sm:px-4 max-sm:pb-10">
        <div className="wrap grid-cards grid-cols-4 max-md:grid-cols-2 py-7 max-sm:py-4! max-sm:px-4! max-sm:bg-paper max-sm:border max-sm:border-line max-sm:rounded-[4px] max-sm:gap-3!">
          {home.promises.map((p, i) => (
            <div key={p.title} className={cx(i > 1 && "max-sm:hidden")}>
              <div className="font-bold max-sm:text-[13px]">{p.title}</div>
              <div className="text-[13px] text-muted">{p.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
