import Link from "next/link";
import { AccountIcon, HeartIcon, SearchIcon } from "@/components/ui/Icons";
import { mainNav } from "@/lib/nav";
import { BagLink } from "./BagLink";
import { MobileMenu } from "./MobileMenu";

const iconLink = "inline-flex items-center justify-center w-11 h-11";

/** Announcement bar + logo + nav + icon buttons. The layout keeps it sticky on every page. */
export function Header({ announcement, announcementShort }: { announcement: string; announcementShort: string }) {
  return (
    <header className="w-full bg-paper border-b border-line">
      <div className="bg-ink text-paper text-center text-xs tracking-[0.08em] px-4 py-[9px] max-sm:text-[11px] max-sm:py-[7px] max-sm:px-3 max-sm:tracking-normal">
        <span className="max-sm:hidden">{announcement}</span>
        <span className="sm:hidden">{announcementShort}</span>
      </div>
      <div className="wrap flex items-center gap-7 min-h-[72px] py-1 max-sm:gap-2 max-sm:min-h-14 max-sm:px-2! max-sm:justify-between">
        <MobileMenu />
        <Link href="/" className="serif text-[28px] whitespace-nowrap max-sm:text-[22px]">
          Folk &amp; Form
        </Link>
        <nav aria-label="Main" className="flex gap-[22px] flex-wrap text-sm font-medium flex-[1_1_380px] max-sm:hidden">
          {mainNav.map((item) => (
            <Link key={item.label} href={item.href} className={"sale" in item ? "text-clay" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-0.5">
          <Link href="/styling" className="text-[13px] font-bold mr-2.5 border-b border-ink max-sm:hidden">
            Book a stylist
          </Link>
          <Link href="/search" aria-label="Search" className={iconLink}>
            <SearchIcon />
          </Link>
          <Link href="/account" aria-label="Account" className={`${iconLink} max-sm:hidden`}>
            <AccountIcon />
          </Link>
          <Link href="/account/wishlist" aria-label="Wishlist" className={`${iconLink} max-sm:hidden`}>
            <HeartIcon />
          </Link>
          <BagLink />
        </div>
      </div>
    </header>
  );
}
