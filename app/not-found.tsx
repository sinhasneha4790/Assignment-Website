import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

// Minimal 404 for phase 1; the full artboard (search, hub links, illustration) lands in phase 6.
export default function NotFound() {
  return (
    <main id="main" className="wrap py-24 flex flex-col items-start gap-5">
      <div className="eyebrow">Error 404</div>
      <h1 className="serif text-[44px] leading-tight max-sm:text-[38px]">We couldn’t find that page.</h1>
      <p className="text-muted max-w-[480px]">It may have moved, or it isn’t built yet. Try a hub instead.</p>
      <div className="flex gap-3 flex-wrap">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/women" variant="outline">Women</ButtonLink>
        <ButtonLink href="/men" variant="outline">Men</ButtonLink>
        <ButtonLink href="/teens" variant="outline">Teens</ButtonLink>
      </div>
      <Link href="/styling" className="text-[13px] underline">Or book a free stylist session</Link>
    </main>
  );
}
