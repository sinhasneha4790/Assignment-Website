import { ChatIcon } from "@/components/ui/Icons";

/** Floating WhatsApp chat link. Hidden until NEXT_PUBLIC_WHATSAPP_NUMBER is set. */
export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-30 right-4 bottom-4 max-sm:bottom-20 w-12 h-12 rounded-full bg-olive text-paper inline-flex items-center justify-center shadow-[0_4px_16px_rgba(38,37,31,.2)] hover:bg-ink hover:text-paper"
    >
      <ChatIcon size={22} />
    </a>
  );
}
