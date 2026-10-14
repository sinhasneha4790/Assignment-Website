"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountIcon, HeartIcon, HomeIcon, ShopIcon, StylistIcon } from "@/components/ui/Icons";
import { cx } from "@/lib/cx";

const tabs = [
  { label: "Home", href: "/", Icon: HomeIcon, match: (p: string) => p === "/" },
  { label: "Shop", href: "/women", Icon: ShopIcon, match: (p: string) => /^\/(women|men|teens|new-in|sale|collections|p|search)(\/|$)/.test(p) },
  { label: "Stylist", href: "/styling", Icon: StylistIcon, match: (p: string) => p.startsWith("/styling") || p.startsWith("/book") },
  { label: "Wishlist", href: "/account/wishlist", Icon: HeartIcon, match: (p: string) => p.startsWith("/account/wishlist") },
  { label: "Account", href: "/account", Icon: AccountIcon, match: (p: string) => p.startsWith("/account") && !p.startsWith("/account/wishlist") },
];

/** Phone-only bottom tab bar (Home, Shop, Stylist, Wishlist, Account). */
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-paper border-t border-line grid grid-cols-5 pt-1.5 pb-[max(10px,env(safe-area-inset-bottom))] text-[11px] text-center">
      {tabs.map(({ label, href, Icon, match }) => {
        const on = match(pathname);
        return (
          <Link key={label} href={href} aria-current={on ? "page" : undefined} className={cx("flex flex-col items-center justify-center gap-0.5 min-h-11", on && "font-bold text-olive")}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
