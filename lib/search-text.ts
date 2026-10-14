/**
 * Builds the lower-cased text the trigram search matches against.
 * Admin product saves must call this too so search stays in sync.
 */
export function buildSearchText(p: {
  name: string;
  category: string;
  hub: string;
  line: "PROFESSIONAL" | "CASUAL" | null;
  fabric: string | null;
  colours: string[];
}): string {
  const line = p.line === "PROFESSIONAL" ? "professional work office" : p.line === "CASUAL" ? "casual weekend" : "";
  const hubWords = p.hub === "Women" ? "women womens ladies" : p.hub === "Men" ? "men mens" : "teens teen kids";
  return [p.name, p.category, hubWords, line, p.fabric ?? "", ...p.colours]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
