import { NextResponse, type NextRequest } from "next/server";
import { cardsByIds } from "@/lib/catalog";
import { slugFromLine } from "@/lib/catalog";
import { hasDatabase } from "@/lib/db";
import { matchingCategories, searchProductIds } from "@/lib/search";

/** Instant search suggestions: products and categories, after 2 characters. Public, cached 60 s. */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2 || !hasDatabase) return NextResponse.json({ products: [], categories: [] });

  const ids = (await searchProductIds(q)).slice(0, 5).map((r) => r.id);
  const [products, categories] = await Promise.all([cardsByIds(ids), matchingCategories(q, 3)]);
  return NextResponse.json(
    {
      products: products.map((p) => ({ slug: p.slug, name: p.name, price: p.price, image: p.image, note: p.note })),
      categories: categories.map((c) => ({
        name: `${c.hubName} · ${c.name}`,
        href: `/${c.hubSlug}/${slugFromLine(c.line as "PROFESSIONAL" | "CASUAL" | null)}/${c.slug}`,
      })),
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
