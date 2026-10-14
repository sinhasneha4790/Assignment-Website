import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getSiteSettings } from "@/lib/content";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <div className="sticky top-0 z-50 shadow-[0_2px_12px_rgba(38,37,31,.08)]">
        <Header announcement={settings.announcement} announcementShort={settings.announcementShort} />
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer blurb={settings.newsletterBlurb} />
      <MobileTabBar />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
