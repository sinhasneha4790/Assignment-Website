/** Primary navigation (header, mobile menu and hub chips). */
export const mainNav = [
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Teens", href: "/teens" },
  { label: "Work", href: "/women?line=professional" },
  { label: "Weekend", href: "/women?line=casual" },
  { label: "New in", href: "/new-in" },
  { label: "Sale", href: "/sale", sale: true },
] as const;

export const footerNav = {
  shop: [
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Teens", href: "/teens" },
    { label: "New in", href: "/new-in" },
    { label: "Sale", href: "/sale" },
    { label: "Gift cards", href: "/gift-cards" },
  ],
  help: [
    { label: "Help centre", href: "/help" },
    { label: "Track order", href: "/track-order" },
    { label: "Size guides", href: "/size-guide" },
    { label: "Shipping", href: "/policies/shipping" },
    { label: "Returns & exchanges", href: "/policies/returns" },
    { label: "Contact us", href: "/contact" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Book a stylist", href: "/styling" },
    { label: "Journal", href: "/journal" },
    { label: "Stores", href: "/stores" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy", href: "/policies/privacy" },
    { label: "Terms", href: "/policies/terms" },
    { label: "Cookies", href: "/policies/cookies" },
    { label: "Booking policy", href: "/policies/booking" },
  ],
};
