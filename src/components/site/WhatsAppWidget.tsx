import { MessageCircle } from "lucide-react";
import { useContact } from "./use-site-data";

// One tap to WhatsApp with the enquiry pre-filled. Most visitors arrive on phones
// from Facebook, so it stays a compact button that never covers the page.
export function WhatsAppWidget() {
  const contact = useContact();

  return (
    <a
      href={contact.whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Champs Construction on WhatsApp"
      className="floaty fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-300 hover:scale-105"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#25D366]"
        style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
      />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
