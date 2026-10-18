import type { ReactNode } from "react";

import { BackToTop } from "@/components/site/BackToTop";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { PageLoader } from "@/components/site/PageLoader";
import { WhatsAppWidget } from "@/components/site/WhatsAppWidget";

/**
 * The chrome every public page shares.
 *
 * The site used to be one long scrolling page, so this lived inline in the index
 * route. Now that there are five pages it sits here, which also means the loader
 * and the nav keep identical behaviour everywhere instead of drifting apart.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppWidget />
      <BackToTop />
    </>
  );
}
