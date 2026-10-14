import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Lower-cases, strips punctuation and splits a query into at most 6 terms. */
export function searchTerms(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .slice(0, 6);
}

/** Largest edit distance accepted when correcting a term of this length. */
export function maxEdits(term: string): number {
  return term.length >= 5 ? 2 : term.length >= 3 ? 1 : 0;
}

/**
 * Active product ids matching every term, best first. A term matches when it
 * is a substring of the product's search text or a close trigram match, so
 * "linnen shirt" still finds linen shirts.
 */
export async function searchProductIds(q: string): Promise<{ id: string; score: number }[]> {
  const terms = searchTerms(q);
  if (!terms.length) return [];
  const conds = terms.map(
    (t) => Prisma.sql`("searchText" LIKE ${"%" + t + "%"} OR word_similarity(${t}, "searchText") >= 0.5)`,
  );
  const score = Prisma.join(
    terms.map((t) => Prisma.sql`word_similarity(${t}, "searchText")`),
    " + ",
  );
  return db().$queryRaw<{ id: string; score: number }[]>`
    SELECT id, (${score})::float AS score
    FROM "Product"
    WHERE status = 'ACTIVE' AND ${Prisma.join(conds, " AND ")}
    ORDER BY score DESC, sort ASC
    LIMIT 500`;
}

/**
 * Suggests a corrected query ("linnen shrit" → "linen shirt") using the
 * catalogue's own vocabulary, or null when nothing better is found.
 */
export async function suggestSpelling(q: string): Promise<string | null> {
  const terms = searchTerms(q);
  if (!terms.length) return null;
  let changed = false;
  const fixed: string[] = [];
  for (const t of terms) {
    const limit = maxEdits(t);
    const rows =
      limit === 0
        ? []
        : await db().$queryRaw<{ word: string; d: number }[]>`
            SELECT word, levenshtein(word, ${t}) AS d
            FROM (
              SELECT regexp_split_to_table("searchText", '\\s+') AS word FROM "Product" WHERE status = 'ACTIVE'
            ) w
            WHERE length(word) > 2
            GROUP BY word
            -- Ties (shrit → shirt or suit) go to the word the catalogue uses most.
            ORDER BY levenshtein(word, ${t}) ASC, count(*) DESC, similarity(word, ${t}) DESC
            LIMIT 1`;
    const best = rows[0];
    if (best && best.d > 0 && best.d <= limit) {
      fixed.push(best.word);
      changed = true;
    } else {
      fixed.push(t);
    }
  }
  return changed ? fixed.join(" ") : null;
}

/** Categories whose name resembles the query, for "also showing …" links. */
export async function matchingCategories(q: string, limit = 2) {
  const terms = searchTerms(q);
  if (!terms.length) return [];
  const phrase = terms.join(" ");
  return db().$queryRaw<{ name: string; slug: string; line: string | null; hubSlug: string; hubName: string }[]>`
    SELECT c.name, c.slug, c.line::text AS line, h.slug AS "hubSlug", h.name AS "hubName"
    FROM "Category" c JOIN "Hub" h ON h.id = c."hubId"
    WHERE word_similarity(lower(c.name), ${phrase}) >= 0.5
    ORDER BY word_similarity(lower(c.name), ${phrase}) DESC, h.sort ASC
    LIMIT ${limit}`;
}
