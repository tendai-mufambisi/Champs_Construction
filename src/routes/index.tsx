import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppWidget } from "@/components/site/WhatsAppWidget";
import { BackToTop } from "@/components/site/BackToTop";
import { PageLoader } from "@/components/site/PageLoader";
import { Hero } from "@/components/sections/Hero";
import { WorkStrip } from "@/components/sections/WorkStrip";
import { About } from "@/components/sections/About";
import { Founder } from "@/components/sections/Founder";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Transformation } from "@/components/sections/Transformation";
import { Burbs } from "@/components/sections/Burbs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { WhyUs } from "@/components/sections/WhyUs";
import { Community } from "@/components/sections/Community";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { company, SITE_URL } from "@/lib/site-data";

const title = "Champs Construction | Build Your House in Zimbabwe from the Diaspora";
const description =
  "Turnkey home construction in Zimbabwe for the diaspora and local clients. Champs Construction handles planning, materials, construction and handover in Harare and beyond, with weekly progress reports at every stage.";
const keywords =
  "construction company Harare, build house in Zimbabwe from diaspora, diaspora home construction Zimbabwe, Chivhu stands, The Burbs Chivhu, Champs Construction";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
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
          logo: `${SITE_URL}/logo.svg`,
          image: `${SITE_URL}/og-image.png`,
          telephone: ["+263713796159", "+263773975415"],
          email: company.email,
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

function Index() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main>
        <Hero />
        <WorkStrip />
        <About />
        <Founder />
        <Services />
        <Process />
        <Projects />
        <Transformation />
        <Burbs />
        <Testimonials />
        <CtaBand />
        <WhyUs />
        <Community />
        <EnquiryForm />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppWidget />
      <BackToTop />
    </>
  );
}
