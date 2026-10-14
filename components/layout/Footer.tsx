import Link from "next/link";
import { footerNav } from "@/lib/nav";
import { NewsletterForm } from "./NewsletterForm";

const linkCls = "text-on-dark hover:text-paper";

function Column({ label, title, links }: { label: string; title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={label} className="flex-[1_1_140px] flex flex-col gap-2.5 text-sm">
      <div className="eyebrow text-on-dark-muted!">{title}</div>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={linkCls}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

/** Newsletter, Shop / Help / Company columns, payment methods, legal links. */
export function Footer({ blurb }: { blurb: string }) {
  return (
    <footer className="w-full bg-ink text-on-dark pt-14 pb-7 max-sm:pb-28">
      <div className="wrap flex flex-wrap gap-12">
        <div className="flex-[1_1_300px] flex flex-col gap-3.5">
          <div className="serif text-[30px] text-paper">Folk &amp; Form</div>
          <p className="text-sm text-on-dark-soft">{blurb}</p>
          <NewsletterForm />
        </div>
        <Column label="Shop" title="Shop" links={footerNav.shop} />
        <Column label="Help" title="Help" links={footerNav.help} />
        <Column label="Company" title="Folk & Form" links={footerNav.company} />
      </div>
      <div className="wrap mt-11 pt-5 border-t border-on-dark-line flex flex-wrap gap-4 justify-between text-xs text-on-dark-muted">
        <span>© {new Date().getFullYear()} Folk &amp; Form · folknform.com</span>
        <span>UPI · Cards · Net banking · Wallets · Cash on delivery · EMI</span>
        <span>
          {footerNav.legal.map((l, i) => (
            <span key={l.href}>
              {i > 0 && " · "}
              <Link href={l.href} className="text-on-dark-muted hover:text-paper">{l.label}</Link>
            </span>
          ))}
        </span>
      </div>
    </footer>
  );
}
