import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/sections/About";
import { Burbs } from "@/components/sections/Burbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";
import { WorkStrip } from "@/components/sections/WorkStrip";
import { SiteShell } from "@/components/site/SiteShell";
import { company, SITE_URL } from "@/lib/site-data";
import { canonical, pageMeta } from "@/lib/seo";

const title = "Champs Construction | Building Partners You Can Trust";
const description =
  "Turnkey home construction and project management in Zimbabwe. Champs Construction builds or manages your home from groundwork to handover, with one accountable team, even when you are not on the ground.";
const keywords =
  "construction company Harare, home builders Zimbabwe, turnkey construction Zimbabwe, construction project management Zimbabwe, build a house in Zimbabwe, Chivhu stands, Champs Construction";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({ title, description, path: "/", keywords }),
    links: canonical("/"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          name: company.name,
          slogan: company.tagline,
          description,
          url: SITE_URL,
          logo: `${SITE_URL}${company.logo}`,
          image: `${SITE_URL}${company.ogImage}`,
          telephone: ["+263713796159", "+263773975415"],
          email: company.email,
          founder: { "@type": "Person", name: "Mr. R Gwenyambira" },
          areaServed: "Zimbabwe",
          address: {
            "@type": "PostalAddress",
            streetAddress: "110 L. Takawira Street, 5th Floor, Construction House",
            addressLocality: "Harare",
            addressCountry: "ZW",
          },
        }),
      },
    ],
  }),
  component: Index,
});

/**
 * The home page is a shop window, not the whole shop: each section is a teaser
 * that sends the reader to the page that covers it properly. The long-form
 * content lives on /services, /projects and /about so those pages can rank.
 */
function Index() {
  return (
    <SiteShell>
      <Hero />
      <WorkStrip />
      <About />
      <Services />
      <FeaturedProjects />
      <Team />
      <Burbs />
      <Testimonials />
      <CtaBand />
      <WhyUs />
    </SiteShell>
  );
}
