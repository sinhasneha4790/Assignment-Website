const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Formats integer paise as rupees, e.g. 249000 → "₹2,490". */
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  const sign = rupees < 0 ? "−" : "";
  const abs = Math.abs(rupees);
  const body = Number.isInteger(abs) ? inr.format(abs) : abs.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sign}₹${body}`;
}

/** "Women · Professional", "Teens" */
export function lineLabel(hubName: string, line: "PROFESSIONAL" | "CASUAL" | null): string {
  if (!line) return hubName;
  return `${hubName} · ${line === "PROFESSIONAL" ? "Professional" : "Casual"}`;
}
