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

export const categories: { hub: HubSlug; line: SeedLine; slug: string; name: string; image: string }[] = [
  { hub: "women", line: "PROFESSIONAL", slug: "shirts-blouses", name: "Shirts & blouses", image: "/seed/p-shirt-ecru.svg" },
  { hub: "women", line: "PROFESSIONAL", slug: "tailored-trousers", name: "Tailored trousers", image: "/seed/p-trouser-stone.svg" },
  { hub: "women", line: "PROFESSIONAL", slug: "blazers", name: "Blazers", image: "/seed/p-blazer.svg" },
  { hub: "women", line: "PROFESSIONAL", slug: "workwear-dresses", name: "Workwear dresses", image: "/seed/p-dress-shirt.svg" },
  { hub: "women", line: "CASUAL", slug: "tees-tops", name: "Tees & tops", image: "/seed/p-tee.svg" },
  { hub: "women", line: "CASUAL", slug: "relaxed-dresses", name: "Relaxed dresses", image: "/seed/p-dress-tier.svg" },
  { hub: "women", line: "CASUAL", slug: "knitwear", name: "Knitwear", image: "/seed/p-knit-oat.svg" },
  { hub: "women", line: "CASUAL", slug: "accessories", name: "Scarves", image: "/seed/p-scarf.svg" },
  { hub: "men", line: "PROFESSIONAL", slug: "shirts", name: "Shirts", image: "/seed/p-shirt-stripe.svg" },
  { hub: "men", line: "PROFESSIONAL", slug: "blazers", name: "Blazers & suits", image: "/seed/p-blazer-dark.svg" },
  { hub: "men", line: "PROFESSIONAL", slug: "footwear", name: "Formal footwear", image: "/seed/p-loafer.svg" },
  { hub: "men", line: "CASUAL", slug: "overshirts", name: "Overshirts", image: "/seed/p-overshirt.svg" },
  { hub: "men", line: "CASUAL", slug: "polos-tees", name: "Polos & tees", image: "/seed/p-polo.svg" },
  { hub: "men", line: "CASUAL", slug: "denim", name: "Denim", image: "/seed/p-jeans.svg" },
  { hub: "men", line: "CASUAL", slug: "accessories", name: "Bags & belts", image: "/seed/p-belt.svg" },
  { hub: "teens", line: null, slug: "shirts", name: "Shirts", image: "/seed/p-overshirt-olive.svg" },
  { hub: "teens", line: null, slug: "everyday-tees", name: "Everyday tees", image: "/seed/p-tee-white.svg" },
];

export type SeedProduct = {
  slug: string;
  name: string;
  hub: HubSlug;
  line: SeedLine;
  category: string;
  price: number;
  compareAt?: number;
  badges?: string[];
  occasions?: string[];
  fabric: string;
  fit: string;
  description: string;
  colours: { name: string; hex: string; image: string }[];
  sizes?: string[];
  newIn?: boolean;
};

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const productList: SeedProduct[] = [
  {
    slug: "linen-workday-shirt", name: "Linen Workday Shirt", hub: "women", line: "PROFESSIONAL", category: "shirts-blouses",
    price: rs(2490), badges: ["New"], occasions: ["Office", "Meetings"], newIn: true,
    fabric: "100% European linen, 160 gsm", fit: "Regular",
    description: "A crisp linen shirt cut to sit neatly under a blazer and still breathe through a long workday.",
    colours: [
      { name: "Ecru", hex: "#EDE6D6", image: "/seed/p-shirt-ecru.svg" },
      { name: "Navy", hex: "#2E3A4F", image: "/seed/p-shirt-navy.svg" },
      { name: "Sage", hex: "#9BA88C", image: "/seed/p-shirt-sage.svg" },
      { name: "Rust", hex: "#A0583A", image: "/seed/p-shirt-rust.svg" },
    ],
  },
  {
    slug: "pleated-wide-trouser", name: "Pleated Wide Trouser", hub: "women", line: "PROFESSIONAL", category: "tailored-trousers",
    price: rs(3290), badges: ["New"], occasions: ["Office"], newIn: true,
    fabric: "Viscose-linen twill", fit: "Relaxed",
    description: "High-rise, double-pleated and wide through the leg, with a real waist size.",
    colours: [
      { name: "Olive", hex: "#5F6B4E", image: "/seed/p-trouser-olive.svg" },
      { name: "Stone", hex: "#CFC5B3", image: "/seed/p-trouser-stone.svg" },
    ],
  },
  {
    slug: "soft-shoulder-blazer", name: "Soft-shoulder Blazer", hub: "women", line: "PROFESSIONAL", category: "blazers",
    price: rs(5490), occasions: ["Office", "Meetings"],
    fabric: "Wool-blend, half-lined", fit: "Regular",
    description: "An unstructured blazer with a soft shoulder that layers over shirts and knits alike.",
    colours: [{ name: "Camel", hex: "#B48A5E", image: "/seed/p-blazer.svg" }],
  },
  {
    slug: "mandarin-linen-shirt", name: "Mandarin Linen Shirt", hub: "women", line: "PROFESSIONAL", category: "shirts-blouses",
    price: rs(2390), occasions: ["Office"],
    fabric: "100% linen", fit: "Regular",
    description: "A collarless linen shirt with a neat mandarin band.",
    colours: [{ name: "White", hex: "#F4F1EA", image: "/seed/p-blouse.svg" }],
  },
  {
    slug: "midi-shirt-dress", name: "Midi Shirt Dress", hub: "women", line: "PROFESSIONAL", category: "workwear-dresses",
    price: rs(3690), occasions: ["Office", "Festive"],
    fabric: "Cotton poplin", fit: "Regular",
    description: "A belted midi shirt dress that goes from desk to dinner.",
    colours: [{ name: "Chambray", hex: "#8EA0B4", image: "/seed/p-dress-shirt.svg" }],
  },
  {
    slug: "organic-cotton-tee", name: "Organic Cotton Tee", hub: "women", line: "CASUAL", category: "tees-tops",
    price: rs(1190), occasions: ["Weekend", "Travel"],
    fabric: "Organic cotton jersey, 180 gsm", fit: "Relaxed",
    description: "The everyday tee: heavy enough to hang well, soft from the first wear.",
    colours: [
      { name: "Oat", hex: "#E2D6C2", image: "/seed/p-tee.svg" },
      { name: "White", hex: "#F7F5EF", image: "/seed/p-tee-white.svg" },
    ],
  },
  {
    slug: "tiered-cotton-dress", name: "Tiered Cotton Dress", hub: "women", line: "CASUAL", category: "relaxed-dresses",
    price: rs(2990), compareAt: rs(3490), badges: ["Sale"], occasions: ["Weekend", "Festive"],
    fabric: "Cotton voile, lined", fit: "Relaxed",
    description: "A tiered midi in airy cotton voile with a soft lining.",
    colours: [{ name: "Terracotta", hex: "#B5674A", image: "/seed/p-dress-tier.svg" }],
  },
  {
    slug: "linen-popover", name: "Linen Popover", hub: "women", line: "CASUAL", category: "tees-tops",
    price: rs(2290), occasions: ["Weekend", "Travel"],
    fabric: "100% linen", fit: "Relaxed",
    description: "A pull-on linen top with a short placket.",
    colours: [{ name: "Sage", hex: "#9BA88C", image: "/seed/p-shirt-sage.svg" }],
  },
  {
    slug: "waffle-knit-jumper", name: "Waffle Knit Jumper", hub: "women", line: "CASUAL", category: "knitwear",
    price: rs(3190), occasions: ["Weekend", "Travel"],
    fabric: "Cotton-wool waffle knit", fit: "Relaxed",
    description: "A textured jumper for cool evenings and slow Sundays.",
    colours: [{ name: "Oat", hex: "#D9CBB2", image: "/seed/p-knit-oat.svg" }],
  },
  {
    slug: "printed-cotton-scarf", name: "Printed Cotton Scarf", hub: "women", line: "CASUAL", category: "accessories",
    price: rs(1190), occasions: ["Weekend", "Festive"],
    fabric: "Cotton mul", fit: "One size",
    description: "A light printed scarf to lift a plain outfit.",
    colours: [{ name: "Ochre", hex: "#C99A4E", image: "/seed/p-scarf.svg" }],
    sizes: ["One size"],
  },
  {
    slug: "linen-oxford-shirt", name: "Linen Oxford Shirt", hub: "men", line: "PROFESSIONAL", category: "shirts",
    price: rs(2690), occasions: ["Office", "Meetings"],
    fabric: "Linen-cotton oxford", fit: "Regular",
    description: "A button-down oxford in a breathable linen blend.",
    colours: [{ name: "Blue stripe", hex: "#7D93AE", image: "/seed/p-shirt-stripe.svg" }],
  },
  {
    slug: "navy-wool-blend-suit", name: "Navy Wool-blend Suit", hub: "men", line: "PROFESSIONAL", category: "blazers",
    price: rs(9990), occasions: ["Office", "Festive", "Wedding"],
    fabric: "Wool-blend, half-canvassed", fit: "Slim",
    description: "A two-piece suit in breathable wool-blend suiting.",
    colours: [{ name: "Navy", hex: "#2E3A4F", image: "/seed/p-blazer-dark.svg" }],
  },
  {
    slug: "leather-penny-loafer", name: "Leather Penny Loafer", hub: "men", line: "PROFESSIONAL", category: "footwear",
    price: rs(4290), occasions: ["Office", "Festive"],
    fabric: "Full-grain leather, leather sole", fit: "True to size",
    description: "A classic penny loafer that softens with every wear.",
    colours: [{ name: "Tan", hex: "#8A5A3B", image: "/seed/p-loafer.svg" }],
    sizes: ["6", "7", "8", "9", "10", "11"],
  },
  {
    slug: "brushed-cotton-overshirt", name: "Brushed Cotton Overshirt", hub: "men", line: "CASUAL", category: "overshirts",
    price: rs(2990), badges: ["New"], occasions: ["Weekend", "Travel"], newIn: true,
    fabric: "Brushed cotton twill", fit: "Relaxed",
    description: "A soft brushed overshirt to wear open over a tee or buttoned on cool days.",
    colours: [
      { name: "Stone", hex: "#BBAE98", image: "/seed/p-overshirt.svg" },
      { name: "Olive", hex: "#6B7556", image: "/seed/p-overshirt-olive.svg" },
    ],
  },
  {
    slug: "relaxed-knit-polo", name: "Relaxed Knit Polo", hub: "men", line: "CASUAL", category: "polos-tees",
    price: rs(1890), badges: ["New"], occasions: ["Weekend", "Office"], newIn: true,
    fabric: "Cotton knit", fit: "Relaxed",
    description: "A knitted polo that dresses up or down.",
    colours: [{ name: "Sand", hex: "#CDBB9A", image: "/seed/p-polo.svg" }],
  },
  {
    slug: "camp-collar-linen-shirt", name: "Camp Collar Linen Shirt", hub: "men", line: "CASUAL", category: "overshirts",
    price: rs(2590), occasions: ["Weekend", "Travel"],
    fabric: "100% linen", fit: "Relaxed",
    description: "A boxy camp-collar shirt for hot afternoons.",
    colours: [{ name: "Rust", hex: "#A0583A", image: "/seed/p-shirt-rust.svg" }],
  },
  {
    slug: "straight-leg-jeans", name: "Straight Leg Jeans", hub: "men", line: "CASUAL", category: "denim",
    price: rs(2790), occasions: ["Weekend"],
    fabric: "13 oz cotton denim", fit: "Straight",
    description: "Mid-rise straight-leg jeans in rigid denim that wears in, not out.",
    colours: [{ name: "Indigo", hex: "#3D4E6E", image: "/seed/p-jeans.svg" }],
    sizes: ["28", "30", "32", "34", "36", "38"],
  },
  {
    slug: "leather-belt", name: "Leather Belt", hub: "men", line: "CASUAL", category: "accessories",
    price: rs(1290), occasions: ["Office", "Weekend"],
    fabric: "Vegetable-tanned leather", fit: "Adjustable",
    description: "A simple leather belt with a brass buckle.",
    colours: [{ name: "Brown", hex: "#6E4A33", image: "/seed/p-belt.svg" }],
    sizes: ["S", "M", "L"],
  },
  {
    slug: "canvas-tote", name: "Canvas Tote", hub: "men", line: "CASUAL", category: "accessories",
    price: rs(1910), occasions: ["Office", "Weekend", "Travel"],
    fabric: "Waxed cotton canvas", fit: "One size",
    description: "A sturdy tote with a laptop sleeve.",
    colours: [{ name: "Natural", hex: "#D8CDB8", image: "/seed/p-tote.svg" }],
    sizes: ["One size"],
  },
  {
    slug: "linen-boxy-shirt", name: "Linen Boxy Shirt", hub: "teens", line: null, category: "shirts",
    price: rs(1690), occasions: ["College", "Weekend"],
    fabric: "Linen-cotton", fit: "Boxy",
    description: "A cropped, boxy linen shirt for college days.",
    colours: [{ name: "Olive", hex: "#6B7556", image: "/seed/p-overshirt-olive.svg" }],
  },
  {
    slug: "everyday-teen-tee", name: "Everyday Tee", hub: "teens", line: null, category: "everyday-tees",
    price: rs(890), occasions: ["College", "Weekend"],
    fabric: "Organic cotton jersey", fit: "Relaxed",
    description: "A soft everyday tee in organic cotton.",
    colours: [{ name: "White", hex: "#F7F5EF", image: "/seed/p-tee-white.svg" }],
  },
];

export const products: (SeedProduct & { sizes: string[] })[] = productList.map((p) => ({ ...p, sizes: p.sizes ?? APPAREL }));

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
    productSlugs: ["linen-workday-shirt", "pleated-wide-trouser", "leather-belt", "canvas-tote"],
  },
  {
    slug: "look-02-lunch-to-late-meeting", title: "Look 02 · Lunch to late meeting", image: "/seed/s-woman-dress.svg", alt: "Woman in a terracotta dress",
    productSlugs: ["tiered-cotton-dress", "waffle-knit-jumper", "printed-cotton-scarf"],
  },
  {
    slug: "look-03-slow-sunday", title: "Look 03 · Slow Sunday", image: "/seed/s-trio.svg", alt: "Three people in weekend clothes",
    productSlugs: ["organic-cotton-tee", "straight-leg-jeans", "relaxed-knit-polo", "canvas-tote"],
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
