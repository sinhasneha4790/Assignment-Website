import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { chipClass } from "@/components/ui/Chip";
import type { getReviews, ProductRow, ReviewFilter } from "@/lib/product";

type Data = Awaited<ReturnType<typeof getReviews>>;

const fitLabel = { SMALL: "Runs small", TRUE: "True to size", LARGE: "Slightly large" } as const;
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
const date = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** Rating summary, star breakdown, fit meter, filters, reviews with photos, and Q&A. */
export function Reviews({ product, data, filter, savedSize }: { product: ProductRow; data: Data; filter: ReviewFilter; savedSize: string | null }) {
  const filters: { key: ReviewFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "photos", label: "With photos" },
    ...(savedSize ? [{ key: `size-${savedSize}` as ReviewFilter, label: `Size ${savedSize}` }] : []),
    { key: "recent", label: "Most recent" },
  ];
  const max = Math.max(1, ...data.histogram.map((h) => h.count));

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="wrap grid grid-cols-[320px_minmax(0,1fr)] gap-12 pb-[72px] max-md:grid-cols-1 max-md:gap-6 scroll-mt-32">
      <div className="flex flex-col gap-4">
        <h2 id="reviews-title" className="serif text-4xl max-sm:text-[26px]">Reviews</h2>
        {data.count > 0 ? (
          <>
            <p>
              <span className="serif text-[52px] leading-none">{data.avg.toFixed(1)}</span>
              <span className="text-muted text-sm"> / 5 · {data.count} {data.count === 1 ? "review" : "reviews"}</span>
            </p>
            <dl className="flex flex-col gap-1.5">
              {data.histogram.map((h) => (
                <div key={h.stars} className="flex items-center gap-2 text-[13px]">
                  <dt className="w-6">{h.stars}★</dt>
                  <dd className="flex-1 h-1.5 bg-line rounded-full overflow-hidden" aria-label={`${h.count} reviews`}>
                    <span className="block h-full bg-olive" style={{ width: `${(h.count / max) * 100}%` }} />
                  </dd>
                </div>
              ))}
            </dl>
            {data.fitScore !== null && (
              <div className="bg-paper border border-line rounded-[4px] p-4">
                <div className="font-semibold text-sm mb-2">How it fits</div>
                <div className="flex justify-between text-[12px] text-muted mb-2">
                  <span>Runs small</span>
                  <span>True to size</span>
                  <span>Runs large</span>
                </div>
                <div className="relative h-1 bg-line rounded-full" role="img" aria-label={data.fitScore < 0.4 ? "Runs small" : data.fitScore > 0.6 ? "Runs large" : "True to size"}>
                  <span className="absolute -top-1.5 w-4 h-4 rounded-full bg-ink -translate-x-1/2" style={{ left: `${data.fitScore * 100}%` }} />
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted">No reviews yet. Be the first to tell others how it fits.</p>
        )}
        {/* Writing reviews needs an account (phase 4). */}
        <Link href={`/login?next=/p/${product.slug}%23reviews`} className={buttonClass("outline", true)}>Write a review</Link>
      </div>

      <div className="min-w-0">
        {data.count > 0 && (
          <nav aria-label="Filter reviews" className="flex flex-wrap gap-2 mb-6">
            {filters.map((f) => (
              <Link key={f.key} href={f.key === "all" ? `/p/${product.slug}#reviews` : `/p/${product.slug}?reviews=${f.key}#reviews`} scroll={false} aria-current={filter === f.key ? "true" : undefined} className={chipClass(filter === f.key)}>
                {f.label}
              </Link>
            ))}
          </nav>
        )}
        {data.list.length === 0 && data.count > 0 && <p className="text-muted mb-6">No reviews match this filter.</p>}
        <ul className="flex flex-col">
          {data.list.map((r) => (
            <li key={r.id} className="border-b border-line py-5 first:pt-0">
              <div className="flex justify-between text-[13px]">
                <span className="text-olive tracking-[2px]" role="img" aria-label={`${r.rating} out of 5 stars`}>{stars(r.rating)}</span>
                <span className="text-muted">{date(r.createdAt)}</span>
              </div>
              <h3 className="font-semibold mt-2">{r.title}</h3>
              <p className="text-muted mt-1">{r.body}</p>
              <p className="text-[12px] text-muted mt-2">
                {r.user.name}
                {r.verifiedBuyer && " · Verified buyer"}
                {r.sizeBought && ` · Bought ${r.sizeBought}`}
                {r.fit && ` · Fit: ${fitLabel[r.fit]}`}
              </p>
              {r.photos.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {r.photos.map((src) => (
                    <div key={src} className="relative w-[72px] h-[88px] bg-sand">
                      <Image src={src} alt={`Photo from ${r.user.name ?? "a customer"}`} fill sizes="72px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="pt-6">
          <h3 className="font-semibold mb-3">Questions &amp; answers</h3>
          {product.questions.length === 0 && <p className="text-[13px] text-muted">No questions yet.</p>}
          <ul className="flex flex-col gap-3">
            {product.questions.map((q) => (
              <li key={q.id} className="text-[13px]">
                <b>Q.</b> {q.body}
                {q.answers.map((a) => (
                  <span key={a.id}>
                    {" "}— <b>A.</b> {a.body} <span className="text-muted">— {a.staffName}</span>
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <Link href={`/login?next=/p/${product.slug}%23reviews`} className="inline-block text-[13px] underline mt-3">Ask a question</Link>
        </div>
      </div>
    </section>
  );
}
