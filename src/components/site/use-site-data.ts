import { useLoaderData } from "@tanstack/react-router";

import {
  FALLBACK_SITE_DATA,
  phoneHref,
  waNumber,
  whatsappUrl,
  type SiteData,
} from "@/data/site-data";
import { whatsappText } from "@/lib/site-data";

/** Owner-editable data, read once by the root loader and shared by every component. */
export function useSiteData(): SiteData {
  const data = useLoaderData({ from: "__root__" }) as SiteData | undefined;
  return data ?? FALLBACK_SITE_DATA;
}

/** Live contact details plus ready-made links. */
export function useContact() {
  const { contact } = useSiteData();
  return {
    ...contact,
    phoneHref: phoneHref(contact.phone),
    phone2Href: contact.phone2 ? phoneHref(contact.phone2) : "",
    /** WhatsApp chat on the main line, pre-filled with the general enquiry. */
    whatsappLink: (text: string = whatsappText) => whatsappUrl(contact.whatsapp, text),
    /** WhatsApp chat on the second line, if it is set. */
    whatsapp2Link: (text: string = whatsappText) =>
      contact.phone2 ? whatsappUrl(waNumber(contact.phone2), text) : "",
  };
}
