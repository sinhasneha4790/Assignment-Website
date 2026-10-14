/**
 * Sample catalogue and content for Folk & Form.
 * Everything here is seed data: prices, names and copy are placeholders the owner
 * replaces through the admin CMS. Money is integer paise.
 */

export const rs = (rupees: number) => rupees * 100;

export type SeedLine = "PROFESSIONAL" | "CASUAL" | null;

export const hubs = [
  { slug: "women", name: "Women", tagline: "20–60 · Professional & Casual", image: "/seed/s-woman-dress.svg", sort: 0 },
  { slug: "men", name: "Men", tagline: "20–60 · Professional & Casual", image: "/seed/s-man-suit.svg", sort: 1 },
  { slug: "teens", name: "Teens", tagline: "13–19 · College & weekend", image: "/seed/s-teen.svg", sort: 2 },
] as const;

export type HubSlug = (typeof hubs)[number]["slug"];

type SeedCategory = { hub: HubSlug; line: SeedLine; slug: string; name: string; image: string };

const cat = (hub: HubSlug, line: SeedLine, slug: string, name: string, image: string): SeedCategory => ({ hub, line, slug, name, image: `/seed/${image}.svg` });

export const categories: SeedCategory[] = [
  cat("women", "PROFESSIONAL", "shirts-blouses", "Shirts & blouses", "p-shirt-ecru"),
  cat("women", "PROFESSIONAL", "tailored-trousers", "Tailored trousers", "p-trouser-stone"),
  cat("women", "PROFESSIONAL", "blazers", "Blazers", "p-blazer"),
  cat("women", "PROFESSIONAL", "workwear-dresses", "Workwear dresses", "p-dress-shirt"),
  cat("women", "PROFESSIONAL", "blouses", "Blouses", "p-blouse"),
  cat("women", "PROFESSIONAL", "knitwear", "Knitwear", "p-knit"),
  cat("women", "PROFESSIONAL", "formal-footwear", "Formal footwear", "p-loafer"),
  cat("women", "PROFESSIONAL", "bags-belts", "Bags & belts", "p-tote"),
  cat("women", "CASUAL", "tees-tops", "Tees & tops", "p-tee"),
  cat("women", "CASUAL", "linen-shirts", "Linen shirts", "p-shirt-sage"),
  cat("women", "CASUAL", "relaxed-dresses", "Relaxed dresses", "p-dress-tier"),
  cat("women", "CASUAL", "knitwear", "Knitwear", "p-knit-oat"),
  cat("women", "CASUAL", "denim", "Denim", "p-jeans"),
  cat("women", "CASUAL", "scarves", "Scarves", "p-scarf"),
  cat("men", "PROFESSIONAL", "shirts", "Shirts", "p-shirt-stripe"),
  cat("men", "PROFESSIONAL", "blazers-suits", "Blazers & suits", "p-blazer-dark"),
  cat("men", "PROFESSIONAL", "trousers", "Trousers", "p-chino"),
  cat("men", "PROFESSIONAL", "knitwear", "Knitwear", "p-knit"),
  cat("men", "PROFESSIONAL", "formal-footwear", "Formal footwear", "p-loafer"),
  cat("men", "PROFESSIONAL", "belts", "Belts", "p-belt"),
  cat("men", "CASUAL", "overshirts", "Overshirts", "p-overshirt"),
  cat("men", "CASUAL", "polos-tees", "Polos & tees", "p-polo"),
  cat("men", "CASUAL", "linen-shirts", "Linen shirts", "p-shirt-rust"),
  cat("men", "CASUAL", "denim", "Denim", "p-jeans"),
  cat("men", "CASUAL", "bags", "Bags", "p-tote"),
  cat("teens", null, "shirts", "Shirts", "p-overshirt-olive"),
  cat("teens", null, "everyday-tees", "Everyday tees", "p-tee-white"),
  cat("teens", null, "denim", "Denim", "p-jeans"),
  cat("teens", null, "knitwear", "Knitwear", "p-knit-oat"),
];

export type SeedColour = { name: string; hex: string; family: string; image: string };

/** The swatch families the colour filter offers, in display order. */
export const colourFamilies: { name: string; hex: string }[] = [
  { name: "Ecru", hex: "#EDE6D6" },
  { name: "White", hex: "#F7F5EF" },
  { name: "Sage", hex: "#9BA88C" },
  { name: "Olive", hex: "#5F6B4E" },
  { name: "Rust", hex: "#A0583A" },
  { name: "Navy", hex: "#2E3A4F" },
  { name: "Black", hex: "#26251F" },
  { name: "Blue", hex: "#8EA0B4" },
  { name: "Neutral", hex: "#CDBB9A" },
  { name: "Brown", hex: "#6E4A33" },
];

const C = {
  ecru: { name: "Ecru", hex: "#EDE6D6", family: "Ecru", image: "/seed/p-shirt-ecru.svg" },
  navyShirt: { name: "Navy", hex: "#2E3A4F", family: "Navy", image: "/seed/p-shirt-navy.svg" },
  sageShirt: { name: "Sage", hex: "#9BA88C", family: "Sage", image: "/seed/p-shirt-sage.svg" },
  rustShirt: { name: "Rust", hex: "#A0583A", family: "Rust", image: "/seed/p-shirt-rust.svg" },
  stripe: { name: "Blue stripe", hex: "#8EA0B4", family: "Blue", image: "/seed/p-shirt-stripe.svg" },
  whiteBlouse: { name: "White", hex: "#F4F1EA", family: "White", image: "/seed/p-blouse.svg" },
  oliveTrouser: { name: "Olive", hex: "#5F6B4E", family: "Olive", image: "/seed/p-trouser-olive.svg" },
  stoneTrouser: { name: "Stone", hex: "#CFC5B3", family: "Neutral", image: "/seed/p-trouser-stone.svg" },
  sandChino: { name: "Sand", hex: "#C9B48F", family: "Neutral", image: "/seed/p-chino.svg" },
  camelBlazer: { name: "Camel", hex: "#B48A5E", family: "Neutral", image: "/seed/p-blazer.svg" },
  navyBlazer: { name: "Navy", hex: "#2E3A4F", family: "Navy", image: "/seed/p-blazer-dark.svg" },
  oatDress: { name: "Oat", hex: "#D9C9A8", family: "Neutral", image: "/seed/p-dress-shirt.svg" },
  tierDress: { name: "Biscuit", hex: "#E3CDB6", family: "Neutral", image: "/seed/p-dress-tier.svg" },
  oatKnit: { name: "Oat", hex: "#D9CBB2", family: "Neutral", image: "/seed/p-knit-oat.svg" },
  stoneKnit: { name: "Stone", hex: "#C8BBA2", family: "Neutral", image: "/seed/p-knit.svg" },
  oatTee: { name: "Oat", hex: "#E2D6C2", family: "Ecru", image: "/seed/p-tee.svg" },
  whiteTee: { name: "White", hex: "#F7F5EF", family: "White", image: "/seed/p-tee-white.svg" },
  rustOvershirt: { name: "Rust", hex: "#9A5534", family: "Rust", image: "/seed/p-overshirt.svg" },
  oliveOvershirt: { name: "Olive", hex: "#5F6B4E", family: "Olive", image: "/seed/p-overshirt-olive.svg" },
  sandPolo: { name: "Sand", hex: "#CDBB9A", family: "Neutral", image: "/seed/p-polo.svg" },
  indigo: { name: "Indigo", hex: "#3D4E6E", family: "Navy", image: "/seed/p-jeans.svg" },
  brownBelt: { name: "Brown", hex: "#6E4A33", family: "Brown", image: "/seed/p-belt.svg" },
  natural: { name: "Natural", hex: "#D8CDB8", family: "Neutral", image: "/seed/p-tote.svg" },
  ochre: { name: "Ochre", hex: "#C99A4E", family: "Rust", image: "/seed/p-scarf.svg" },
  brownLoafer: { name: "Brown", hex: "#5A3A2A", family: "Brown", image: "/seed/p-loafer.svg" },
} satisfies Record<string, SeedColour>;

export type SeedProduct = {
  slug: string;
  name: string;
  hub: HubSlug;
  line: SeedLine;
  category: string;
  price: number;
  compareAt?: number;
  badges?: string[];
  occasions: string[];
  fabric: string;
  fabricType: string;
  fit: "Slim" | "Regular" | "Relaxed" | "One size";
  fitNote: string;
  description: string;
  care: string;
  colours: SeedColour[];
  sizes: string[];
  newIn?: boolean;
  /** Product type used to pick the size chart. */
  type: "tops" | "bottoms" | "footwear" | "accessories";
};

const APPAREL = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const WAIST = ["26", "28", "30", "32", "34", "36", "38"];
const SHOES = ["5", "6", "7", "8", "9", "10", "11"];
const ONE = ["One size"];

const CARE_LINEN = "Machine wash cold, gentle. Line dry in shade. Warm iron while damp.";
const CARE_COTTON = "Machine wash cold with similar colours. Do not tumble dry. Warm iron.";
const CARE_WOOL = "Dry clean, or hand wash cold. Dry flat. Steam to refresh.";
const CARE_LEATHER = "Wipe clean with a damp cloth. Condition every few months.";

type Base = Pick<SeedProduct, "fabric" | "fabricType" | "care" | "type">;
const linen: Base = { fabric: "100% European linen, 160 gsm", fabricType: "Linen", care: CARE_LINEN, type: "tops" };
const linenBottom: Base = { ...linen, fabric: "Viscose-linen twill", fabricType: "Linen", type: "bottoms" };
const cotton: Base = { fabric: "Cotton poplin, 120 gsm", fabricType: "Cotton", care: CARE_COTTON, type: "tops" };
const jersey: Base = { fabric: "Organic cotton jersey, 180 gsm", fabricType: "Cotton", care: CARE_COTTON, type: "tops" };
const viscose: Base = { fabric: "Viscose crepe", fabricType: "Viscose", care: "Hand wash cold or dry clean. Cool iron.", type: "tops" };
const silk: Base = { fabric: "Silk-cotton blend", fabricType: "Silk blend", care: "Dry clean only.", type: "tops" };
const wool: Base = { fabric: "Wool-blend suiting, half-lined", fabricType: "Wool blend", care: CARE_WOOL, type: "tops" };
const woolBottom: Base = { ...wool, type: "bottoms" };
const knit: Base = { fabric: "Cotton-wool knit", fabricType: "Cotton", care: CARE_WOOL, type: "tops" };
const denim: Base = { fabric: "13 oz cotton denim", fabricType: "Denim", care: "Wash inside out, cold. Line dry.", type: "bottoms" };
const twill: Base = { fabric: "Stretch cotton twill", fabricType: "Cotton", care: CARE_COTTON, type: "bottoms" };
const leather: Base = { fabric: "Full-grain leather", fabricType: "Leather", care: CARE_LEATHER, type: "accessories" };
const shoe: Base = { ...leather, fabric: "Full-grain leather upper, leather sole", type: "footwear" };
const canvas: Base = { fabric: "Waxed cotton canvas", fabricType: "Cotton", care: "Spot clean only.", type: "accessories" };

type Row = [slug: string, name: string, hub: HubSlug, line: SeedLine, category: string, rupees: number, base: Base, fit: SeedProduct["fit"], colours: SeedColour[], extra?: Partial<SeedProduct>];

const rows: Row[] = [
  // Women · Professional
  ["linen-workday-shirt", "Linen Workday Shirt", "women", "PROFESSIONAL", "shirts-blouses", 2490, linen, "Regular", [C.ecru, C.sageShirt, C.rustShirt, C.navyShirt], { badges: ["Bestseller"], newIn: true, occasions: ["Office days", "Client meetings", "Travel"], fitNote: "Fits true to size · Regular fit, slightly longer back", description: "A crisp, breathable shirt in pure linen with a soft collar, hidden placket and a curved hem that sits neatly tucked or loose. Made to go from a full workday to dinner without a second thought." }],
  ["band-collar-blouse", "Band Collar Blouse", "women", "PROFESSIONAL", "shirts-blouses", 2190, cotton, "Regular", [C.whiteBlouse, C.ecru, C.sageShirt], { badges: ["New"], newIn: true }],
  ["oversized-poplin-shirt", "Oversized Poplin Shirt", "women", "PROFESSIONAL", "shirts-blouses", 2690, cotton, "Relaxed", [C.stripe, C.whiteBlouse]],
  ["tie-neck-blouse", "Tie-neck Blouse", "women", "PROFESSIONAL", "blouses", 2390, viscose, "Regular", [C.rustShirt, C.ecru, C.navyShirt]],
  ["mandarin-linen-shirt", "Mandarin Linen Shirt", "women", "PROFESSIONAL", "shirts-blouses", 2390, linen, "Regular", [C.whiteBlouse, C.ecru, C.sageShirt, C.navyShirt]],
  ["relaxed-stripe-shirt", "Relaxed Stripe Shirt", "women", "PROFESSIONAL", "shirts-blouses", 2490, cotton, "Relaxed", [C.navyShirt]],
  ["pintuck-blouse", "Pintuck Blouse", "women", "PROFESSIONAL", "blouses", 2590, silk, "Regular", [C.whiteBlouse, C.ecru]],
  ["utility-shirt", "Utility Shirt", "women", "PROFESSIONAL", "shirts-blouses", 2790, cotton, "Relaxed", [C.oliveOvershirt, C.sandPolo]],
  ["silk-blend-shell", "Silk-blend Shell Top", "women", "PROFESSIONAL", "blouses", 2990, silk, "Slim", [C.whiteBlouse], { compareAt: 3490, badges: ["Sale"] }],
  ["pleated-wide-trouser", "Pleated Wide Trouser", "women", "PROFESSIONAL", "tailored-trousers", 3290, linenBottom, "Relaxed", [C.oliveTrouser, C.stoneTrouser], { badges: ["New"], newIn: true, sizes: WAIST, occasions: ["Office days", "Client meetings"] }],
  ["straight-suit-trouser", "Straight Suit Trouser", "women", "PROFESSIONAL", "tailored-trousers", 3490, woolBottom, "Regular", [C.stoneTrouser], { sizes: WAIST }],
  ["soft-shoulder-blazer", "Soft-shoulder Blazer", "women", "PROFESSIONAL", "blazers", 5490, wool, "Regular", [C.camelBlazer, C.navyBlazer], { occasions: ["Office days", "Client meetings", "Festive"] }],
  ["midi-shirt-dress", "Midi Shirt Dress", "women", "PROFESSIONAL", "workwear-dresses", 3690, cotton, "Regular", [C.oatDress], { occasions: ["Office days", "Weekend brunch"] }],
  ["fine-knit-cardigan", "Fine Knit Cardigan", "women", "PROFESSIONAL", "knitwear", 2890, knit, "Regular", [C.stoneKnit]],
  ["block-heel-loafer", "Block Heel Loafer", "women", "PROFESSIONAL", "formal-footwear", 3990, shoe, "Regular", [C.brownLoafer], { sizes: SHOES }],
  ["canvas-work-tote", "Canvas Work Tote", "women", "PROFESSIONAL", "bags-belts", 1990, canvas, "One size", [C.natural], { sizes: ONE }],
  // Women · Casual
  ["organic-cotton-tee", "Organic Cotton Tee", "women", "CASUAL", "tees-tops", 1190, jersey, "Relaxed", [C.oatTee, C.whiteTee], { occasions: ["Weekend brunch", "Travel", "Work from home"] }],
  ["linen-popover", "Linen Popover", "women", "CASUAL", "linen-shirts", 2290, linen, "Relaxed", [C.sageShirt, C.ecru], { badges: ["New"], newIn: true }],
  ["camp-collar-linen-shirt-women", "Camp Collar Linen Shirt", "women", "CASUAL", "linen-shirts", 2590, linen, "Relaxed", [C.rustShirt]],
  ["linen-shirt-dress", "Linen Shirt Dress", "women", "CASUAL", "relaxed-dresses", 3490, linen, "Relaxed", [C.oatDress]],
  ["tiered-cotton-dress", "Tiered Cotton Dress", "women", "CASUAL", "relaxed-dresses", 2990, cotton, "Relaxed", [C.tierDress], { compareAt: 3490, badges: ["Sale"], occasions: ["Weekend brunch", "Festive", "Wedding guest"] }],
  ["waffle-knit-jumper", "Waffle Knit Jumper", "women", "CASUAL", "knitwear", 3190, knit, "Relaxed", [C.oatKnit, C.stoneKnit]],
  ["wide-leg-jeans", "Wide Leg Jeans", "women", "CASUAL", "denim", 2890, denim, "Relaxed", [C.indigo], { sizes: WAIST }],
  ["printed-cotton-scarf", "Printed Cotton Scarf", "women", "CASUAL", "scarves", 1190, { ...canvas, fabric: "Cotton mul", care: "Hand wash cold." }, "One size", [C.ochre], { sizes: ONE }],
  ["silk-twill-scarf", "Silk Twill Scarf", "women", "CASUAL", "scarves", 1490, { ...silk, type: "accessories" }, "One size", [C.ochre], { sizes: ONE, compareAt: 1890, badges: ["Sale"] }],
  // Men · Professional
  ["linen-oxford-shirt", "Linen Oxford Shirt", "men", "PROFESSIONAL", "shirts", 2690, linen, "Regular", [C.stripe, C.whiteBlouse, C.navyShirt], { occasions: ["Office days", "Client meetings"] }],
  ["poplin-dress-shirt", "Poplin Dress Shirt", "men", "PROFESSIONAL", "shirts", 2290, cotton, "Slim", [C.whiteBlouse, C.stripe]],
  ["navy-wool-blend-suit", "Navy Wool-blend Suit", "men", "PROFESSIONAL", "blazers-suits", 9990, wool, "Slim", [C.navyBlazer], { occasions: ["Office days", "Festive", "Wedding guest"] }],
  ["unstructured-blazer", "Unstructured Blazer", "men", "PROFESSIONAL", "blazers-suits", 5990, wool, "Regular", [C.camelBlazer], { badges: ["New"], newIn: true }],
  ["pleated-chino", "Pleated Chino", "men", "PROFESSIONAL", "trousers", 2790, twill, "Regular", [C.sandChino, C.oliveTrouser], { sizes: WAIST }],
  ["merino-crew-jumper", "Merino Crew Jumper", "men", "PROFESSIONAL", "knitwear", 3490, { ...knit, fabric: "Extra-fine merino wool", fabricType: "Wool blend" }, "Regular", [C.stoneKnit]],
  ["leather-penny-loafer", "Leather Penny Loafer", "men", "PROFESSIONAL", "formal-footwear", 4290, shoe, "Regular", [C.brownLoafer], { sizes: ["6", "7", "8", "9", "10", "11", "12"] }],
  ["woven-leather-belt", "Woven Leather Belt", "men", "PROFESSIONAL", "belts", 1290, leather, "Regular", [C.brownBelt], { sizes: ["S", "M", "L"] }],
  // Men · Casual
  ["brushed-cotton-overshirt", "Brushed Cotton Overshirt", "men", "CASUAL", "overshirts", 2990, { ...cotton, fabric: "Brushed cotton twill" }, "Relaxed", [C.rustOvershirt, C.oliveOvershirt], { badges: ["New"], newIn: true, occasions: ["Weekend brunch", "Travel"] }],
  ["relaxed-knit-polo", "Relaxed Knit Polo", "men", "CASUAL", "polos-tees", 1890, knit, "Relaxed", [C.sandPolo], { badges: ["New"], newIn: true }],
  ["heavyweight-tee", "Heavyweight Tee", "men", "CASUAL", "polos-tees", 1290, jersey, "Relaxed", [C.whiteTee, C.oatTee]],
  ["camp-collar-linen-shirt", "Camp Collar Linen Shirt", "men", "CASUAL", "linen-shirts", 2590, linen, "Relaxed", [C.rustShirt, C.sageShirt]],
  ["linen-grandad-shirt", "Linen Grandad Shirt", "men", "CASUAL", "linen-shirts", 2390, linen, "Regular", [C.navyShirt, C.ecru]],
  ["straight-leg-jeans", "Straight Leg Jeans", "men", "CASUAL", "denim", 2790, denim, "Regular", [C.indigo], { sizes: ["28", "30", "32", "34", "36", "38", "40"] }],
  ["canvas-weekender", "Canvas Weekender", "men", "CASUAL", "bags", 3290, canvas, "One size", [C.natural], { sizes: ONE, compareAt: 3990, badges: ["Sale"] }],
  // Teens
  ["linen-boxy-shirt", "Linen Boxy Shirt", "teens", null, "shirts", 1690, { ...linen, fabric: "Linen-cotton" }, "Relaxed", [C.oliveOvershirt, C.ecru], { occasions: ["College", "Weekend brunch"] }],
  ["everyday-tee", "Everyday Tee", "teens", null, "everyday-tees", 890, jersey, "Relaxed", [C.whiteTee, C.oatTee], { occasions: ["College"] }],
  ["graphic-pocket-tee", "Pocket Tee", "teens", null, "everyday-tees", 990, jersey, "Relaxed", [C.oatTee], { badges: ["New"], newIn: true }],
  ["teen-straight-jeans", "Straight Jeans", "teens", null, "denim", 1990, denim, "Regular", [C.indigo], { sizes: ["24", "26", "28", "30", "32"] }],
  ["chunky-knit-sweater", "Chunky Knit Sweater", "teens", null, "knitwear", 2290, knit, "Relaxed", [C.oatKnit], { compareAt: 2690, badges: ["Sale"] }],
];

const DEFAULT_FIT_NOTE: Record<SeedProduct["fit"], string> = {
  Slim: "Slim fit · size up for a relaxed look",
  Regular: "Fits true to size · Regular fit",
  Relaxed: "Relaxed fit · size down for a closer fit",
  "One size": "One size",
};

export const products: SeedProduct[] = rows.map(([slug, name, hub, line, category, rupees, base, fit, colours, extra = {}]) => ({
  slug,
  name,
  hub,
  line,
  category,
  price: rs(rupees),
  ...base,
  fit,
  colours,
  occasions: extra.occasions ?? (line === "PROFESSIONAL" ? ["Office days"] : line === "CASUAL" ? ["Weekend brunch"] : ["College"]),
  fitNote: extra.fitNote ?? DEFAULT_FIT_NOTE[fit],
  description: extra.description ?? `${name} in ${base.fabric.toLowerCase()}. Cut for everyday wear in a ${fit.toLowerCase()} fit.`,
  sizes: extra.sizes ?? APPAREL,
  ...extra,
  compareAt: extra.compareAt ? rs(extra.compareAt) : undefined,
}));

/** Model-shot scenes used as the gallery's MODEL and STYLED images per hub. */
export const galleryScenes: Record<HubSlug, { model: string; styled: string; modelInfo: string }> = {
  women: { model: "/seed/s-woman-work.svg", styled: "/seed/s-woman-weekend.svg", modelInfo: "Model is 5′6″ and wears M" },
  men: { model: "/seed/s-man-suit.svg", styled: "/seed/s-man-cafe.svg", modelInfo: "Model is 6′0″ and wears L" },
  teens: { model: "/seed/s-teen.svg", styled: "/seed/s-trio.svg", modelInfo: "Model is 5′7″ and wears S" },
};

// ─── Size charts (body measurements in cm; sample values) ────────────────────

export type SizeRow = { size: string; bust?: number; chest?: number; waist: number; hip: number; intl: string };

export const sizeCharts: { hub: HubSlug; productType: string; title: string; rows: SizeRow[] }[] = [
  {
    hub: "women", productType: "tops", title: "Tops & shirts — body measurements",
    rows: [
      { size: "XS", bust: 82, waist: 66, hip: 90, intl: "6 / 2" },
      { size: "S", bust: 86, waist: 70, hip: 94, intl: "8 / 4" },
      { size: "M", bust: 92, waist: 76, hip: 100, intl: "10 / 6" },
      { size: "L", bust: 98, waist: 82, hip: 106, intl: "12 / 8" },
      { size: "XL", bust: 104, waist: 88, hip: 112, intl: "14 / 10" },
      { size: "2XL", bust: 110, waist: 94, hip: 118, intl: "16 / 12" },
      { size: "3XL", bust: 116, waist: 100, hip: 124, intl: "18 / 14" },
    ],
  },
  {
    hub: "men", productType: "tops", title: "Shirts & tops — body measurements",
    rows: [
      { size: "XS", chest: 86, waist: 72, hip: 88, intl: "34" },
      { size: "S", chest: 92, waist: 78, hip: 94, intl: "36" },
      { size: "M", chest: 98, waist: 84, hip: 100, intl: "38" },
      { size: "L", chest: 104, waist: 90, hip: 106, intl: "40" },
      { size: "XL", chest: 110, waist: 96, hip: 112, intl: "42" },
      { size: "2XL", chest: 116, waist: 102, hip: 118, intl: "44" },
      { size: "3XL", chest: 122, waist: 108, hip: 124, intl: "46" },
    ],
  },
  {
    hub: "teens", productType: "tops", title: "Tops & shirts — body measurements",
    rows: [
      { size: "XS", chest: 76, waist: 62, hip: 80, intl: "13–14 yrs" },
      { size: "S", chest: 82, waist: 66, hip: 86, intl: "14–15 yrs" },
      { size: "M", chest: 88, waist: 70, hip: 92, intl: "15–16 yrs" },
      { size: "L", chest: 94, waist: 74, hip: 98, intl: "17–18 yrs" },
      { size: "XL", chest: 100, waist: 78, hip: 104, intl: "18–19 yrs" },
      { size: "2XL", chest: 106, waist: 84, hip: 110, intl: "19 yrs" },
      { size: "3XL", chest: 112, waist: 90, hip: 116, intl: "19 yrs" },
    ],
  },
];

// ─── Reviews & questions ─────────────────────────────────────────────────────

export const reviewers = [
  { name: "Priya S.", email: "priya.sample@example.com", city: "Guwahati" },
  { name: "Neha B.", email: "neha.sample@example.com", city: "Shillong" },
  { name: "Rahul M.", email: "rahul.sample@example.com", city: "Shillong" },
  { name: "Ankita D.", email: "ankita.sample@example.com", city: "Guwahati" },
];

export const reviews: { product: string; by: number; rating: number; title: string; body: string; fit: "SMALL" | "TRUE" | "LARGE"; size: string; photos?: string[]; daysAgo: number }[] = [
  { product: "linen-workday-shirt", by: 0, rating: 5, title: "Crisp all day, soft by evening", body: "Wore it to a full day of client meetings — barely creased. The longer back stays tucked in. Ordered the sage one too.", fit: "TRUE", size: "M", photos: ["/seed/p-shirt-ecru.svg", "/seed/s-woman-work.svg"], daysAgo: 12 },
  { product: "linen-workday-shirt", by: 1, rating: 4, title: "Lovely fabric, size down if between", body: "Beautiful linen and the buttons feel sturdy. L was a touch roomy on me — exchanged for M in two days, no fuss.", fit: "LARGE", size: "L", daysAgo: 20 },
  { product: "linen-workday-shirt", by: 3, rating: 5, title: "My new work uniform", body: "Bought three colours. Washes well and looks pressed with a quick steam.", fit: "TRUE", size: "S", daysAgo: 35 },
  { product: "pleated-wide-trouser", by: 3, rating: 5, title: "Finally, a real waist size", body: "Sits right at the waist and the pleats fall beautifully.", fit: "TRUE", size: "30", daysAgo: 9 },
  { product: "pleated-wide-trouser", by: 0, rating: 4, title: "Great with flats or heels", body: "Long enough for heels; I hemmed one pair for flats.", fit: "TRUE", size: "28", daysAgo: 25 },
  { product: "brushed-cotton-overshirt", by: 2, rating: 5, title: "Soft and heavy in the best way", body: "Wear it as a jacket most days. Colour is richer in person.", fit: "TRUE", size: "L", daysAgo: 6 },
  { product: "straight-leg-jeans", by: 2, rating: 4, title: "Classic cut", body: "Stiff for a week, then perfect.", fit: "SMALL", size: "32", daysAgo: 40 },
  { product: "soft-shoulder-blazer", by: 1, rating: 5, title: "Polished without trying", body: "Light enough for Guwahati summers, smart enough for board meetings.", fit: "TRUE", size: "M", daysAgo: 15 },
];

export const questions: { product: string; q: string; a: string }[] = [
  { product: "linen-workday-shirt", q: "Is it see-through in white?", a: "Not in Ecru or Sage; the white is slightly sheer, so wear a nude camisole." },
  { product: "pleated-wide-trouser", q: "What is the inside leg length?", a: "81 cm on size 30; our stores can hem for free." },
];

export const hubContent: Record<HubSlug, Partial<Record<"professional" | "casual" | "all", { eyebrow: string; intro: string; image: string; alt: string; caption: string }>>> = {
  women: {
    professional: { eyebrow: "Women · 20–60", intro: "Shirts, tailoring and workwear dresses cut for long days — breathable fabrics, real pockets, relaxed and regular fits.", image: "/seed/s-woman-work.svg", alt: "Woman in a camel blazer and olive wide trousers", caption: "Professional · Blazer ₹5,490 + Wide trouser ₹3,290" },
    casual: { eyebrow: "Women · 20–60", intro: "Easy linen, soft knits and dresses for weekends, travel and everything in between.", image: "/seed/s-woman-weekend.svg", alt: "Woman in a white tee and jeans", caption: "Casual · Organic Cotton Tee ₹1,190" },
  },
  men: {
    professional: { eyebrow: "Men · 20–60", intro: "Linen oxfords, wool-blend suiting and chinos that keep their shape from the first meeting to the last.", image: "/seed/s-man-suit.svg", alt: "Man in a navy suit", caption: "Professional · Navy Wool-blend Suit ₹9,990" },
    casual: { eyebrow: "Men · 20–60", intro: "Overshirts, knit polos and straight-leg denim for slow Sundays and short trips.", image: "/seed/s-man-cafe.svg", alt: "Man in an overshirt at a café", caption: "Casual · Brushed Cotton Overshirt ₹2,990" },
  },
  teens: {
    all: { eyebrow: "Teens · 13–19", intro: "Boxy shirts, everyday tees and denim for college days and weekends — in sizes that grow with them.", image: "/seed/s-teen.svg", alt: "Teenager in a tee and jeans", caption: "Linen Boxy Shirt ₹1,690" },
  },
};

export const hubOccasions: Record<HubSlug, string[]> = {
  women: ["Office days", "Client meetings", "Weekend brunch", "Travel", "Festive", "Wedding guest", "Work from home"],
  men: ["Office days", "Client meetings", "Weekend brunch", "Travel", "Festive", "Wedding guest"],
  teens: ["College", "Weekend brunch", "Festive"],
};

export const popularSearches = ["co-ord sets", "overshirt", "festive kurta", "linen shirt", "wide trousers"];

// ─── Home page content blocks (admin-editable) ───────────────────────────────

export type CarouselSlide = {
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  cta2: { label: string; href: string };
  image: string;
  alt: string;
  tag: string;
  bg: string;
};

export const homeCarousel: CarouselSlide[] = [
  {
    eyebrow: "Autumn–Winter 2026",
    title: "Dressed for the desk, made for the weekend.",
    text: "Quiet, well-cut clothes for teens, women and men — one wardrobe from Monday meetings to Sunday markets.",
    cta: { label: "Shop Women", href: "/women" },
    cta2: { label: "Shop Men", href: "/men" },
    image: "/seed/s-woman-work.svg",
    alt: "Woman in a camel blazer and olive wide trousers",
    tag: "Soft-shoulder Blazer · ₹5,490",
    bg: "#E9E0D1",
  },
  {
    eyebrow: "The Work edit",
    title: "Tailoring that breathes.",
    text: "Linen shirts from ₹2,190, wool-blend suiting and blazers from ₹5,490 — cut in regular and relaxed fits.",
    cta: { label: "Shop Professional", href: "/women?line=professional" },
    cta2: { label: "Size guide", href: "/size-guide" },
    image: "/seed/s-man-suit.svg",
    alt: "Man in a navy suit",
    tag: "Navy Wool-blend Suit · ₹9,990",
    bg: "#DADDE2",
  },
  {
    eyebrow: "The Weekend edit",
    title: "Soft layers, easy fits.",
    text: "Organic tees from ₹1,190, straight-leg denim and knits made for slow Sundays.",
    cta: { label: "Shop Casual", href: "/women?line=casual" },
    cta2: { label: "Shop Teens", href: "/teens" },
    image: "/seed/s-woman-weekend.svg",
    alt: "Woman in a white tee and jeans",
    tag: "Organic Cotton Tee · ₹1,190",
    bg: "#EAD8CA",
  },
  {
    eyebrow: "Personal styling",
    title: "Your wardrobe, sorted in an hour.",
    text: "A free 60-minute session with a stylist, in store in Guwahati or on video. Your picks land in your account.",
    cta: { label: "Book a stylist", href: "/book" },
    cta2: { label: "How it works", href: "/styling" },
    image: "/seed/s-stylist.svg",
    alt: "A stylist with a client beside a clothes rail",
    tag: "Free · 60 min",
    bg: "#DDE2D2",
  },
];

export const homeEdits = [
  { eyebrow: "The Work edit", title: "Tailoring that breathes", cta: "Shop Professional", href: "/women?line=professional", tone: "dark" as const },
  { eyebrow: "The Weekend edit", title: "Soft layers, easy fits", cta: "Shop Casual", href: "/women?line=casual", tone: "clay" as const },
];

export const homeStylistBanner = {
  eyebrow: "Personal styling",
  title: "A stylist, in store or on video.",
  text: "Build a work capsule, plan a festive look, or sort your wardrobe in an hour. Your stylist sends the picks straight to your account.",
  mobileText: "Free 60-min session · picks sent to your account",
  cta: { label: "Book a session", href: "/book" },
  cta2: { label: "How it works", href: "/styling" },
};

/** Lookbooks are Collections with isLookbook = true; the total is computed from product prices. */
export const lookbooks = [
  {
    slug: "look-01-the-commute", title: "Look 01 · The commute", image: "/seed/s-duo.svg", alt: "Two people in workwear",
    productSlugs: ["linen-workday-shirt", "pleated-wide-trouser", "woven-leather-belt", "canvas-work-tote"],
  },
  {
    slug: "look-02-lunch-to-late-meeting", title: "Look 02 · Lunch to late meeting", image: "/seed/s-woman-dress.svg", alt: "Woman in a terracotta dress",
    productSlugs: ["tiered-cotton-dress", "waffle-knit-jumper", "printed-cotton-scarf"],
  },
  {
    slug: "look-03-slow-sunday", title: "Look 03 · Slow Sunday", image: "/seed/s-trio.svg", alt: "Three people in weekend clothes",
    productSlugs: ["organic-cotton-tee", "straight-leg-jeans", "relaxed-knit-polo", "canvas-weekender"],
  },
];

export const homeReviews = [
  { rating: 5, quote: "The linen shirt survived a 12-hour workday and still looked pressed. Ordered a second colour.", author: "Priya S., Guwahati · Verified buyer" },
  { rating: 5, quote: "Finally trousers with a real waist size. The size exchange took two days.", author: "Rahul M., Shillong · Verified buyer" },
  { rating: 5, quote: "My stylist built ten office outfits from eight pieces. Best hour I’ve spent shopping.", author: "Ankita D., Guwahati · Styling client" },
];

export const homePromises = [
  { title: "Easy returns", text: "15-day returns & size exchanges", short: "Free size exchange", shortTitle: "15-day returns" },
  { title: "Pay your way", text: "UPI, cards, net banking, COD", short: "UPI, cards, COD", shortTitle: "Pay your way" },
  { title: "Free styling", text: "In store or on video" },
  { title: "Sizes XS–3XL", text: "Regular, relaxed & slim fits" },
];

export const siteSettings = {
  announcement: "Free delivery over ₹2,999 · Pay by UPI, card or cash on delivery · Free styling sessions",
  announcementShort: "Free delivery over ₹2,999 · COD available",
  freeDeliveryThreshold: rs(2999),
  deliveryFee: rs(99),
  giftWrapFee: rs(99),
  codFee: rs(49),
  expressFee: rs(149),
  bookingDeposit: rs(499),
  newsletterBlurb: "Dressed for the desk, made for the weekend. New drops and styling notes, once a fortnight.",
};

// ─── Stores, stylists and services ───────────────────────────────────────────

export const stores = [
  { slug: "guwahati", name: "Folk & Form Guwahati", address: "GS Road, Christian Basti, Guwahati 781005", city: "Guwahati", hours: "Mon–Sun · 11 am – 9 pm" },
  { slug: "shillong", name: "Folk & Form Shillong", address: "Police Bazar, Shillong 793001", city: "Shillong", hours: "Mon–Sat · 11 am – 8 pm" },
];

export const services = [
  { slug: "personal-styling", name: "Personal styling session", description: "One-to-one advice on fit, colour and what to wear for your week.", format: "STORE", formats: ["STORE", "VIDEO"], durationMin: 60, price: 0, deposit: 0, creditBack: false },
  { slug: "work-capsule", name: "Work capsule wardrobe", description: "Build 15–20 pieces that make a month of office outfits.", format: "STORE", formats: ["STORE", "VIDEO"], durationMin: 90, price: rs(1499), deposit: rs(499), creditBack: true },
  { slug: "festive-wedding", name: "Festive & wedding planning", description: "Outfits for every function, for you and your partner.", format: "STORE", formats: ["STORE"], durationMin: 90, price: rs(999), deposit: rs(499), creditBack: true },
  { slug: "wardrobe-makeover", name: "Wardrobe makeover", description: "We edit your wardrobe with you and fill the gaps.", format: "HOME", formats: ["HOME"], durationMin: 120, price: rs(2999), deposit: rs(499), creditBack: false },
  { slug: "wardrobe-audit", name: "Workwear wardrobe audit", description: "Show us what you own; we tell you what to keep, pair and add.", format: "VIDEO", formats: ["VIDEO"], durationMin: 45, price: 0, deposit: 0, creditBack: false },
  { slug: "style-workshop", name: "Style workshop", description: "Small-group evenings on dressing for work, colour and layering.", format: "GROUP", formats: ["GROUP"], durationMin: 120, price: rs(799), deposit: rs(799), creditBack: false, capacity: 8 },
] as const;

export const stylists = [
  { slug: "meera", name: "Meera Baruah", bio: "Ten years dressing Guwahati’s working women; loves a good trouser.", photo: "/seed/s-stylist.svg", specialities: ["Workwear", "Capsule wardrobes"], languages: ["English", "Assamese", "Hindi"], store: "guwahati" },
  { slug: "arjun", name: "Arjun Das", bio: "Tailoring nerd who can fit a suit in five minutes flat.", photo: "/seed/s-man-cafe.svg", specialities: ["Menswear", "Wedding"], languages: ["English", "Hindi", "Bengali"], store: "guwahati" },
  { slug: "iba", name: "Iba Lyngdoh", bio: "Colour and layering for Shillong weather.", photo: "/seed/s-woman-weekend.svg", specialities: ["Colour", "Teens"], languages: ["English", "Khasi"], store: "shillong" },
];

export const coupons = [
  { code: "WELCOME10", type: "PERCENT" as const, value: 10, minOrder: rs(1999) },
  { code: "FOLK200", type: "FLAT" as const, value: rs(200), minOrder: rs(2499) },
];
