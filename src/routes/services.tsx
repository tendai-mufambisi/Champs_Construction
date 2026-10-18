import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { Process } from "@/components/sections/Process";
import { ServiceModels } from "@/components/sections/ServiceModels";
import { Services } from "@/components/sections/Services";
import { Transformation } from "@/components/sections/Transformation";
import { WhyUs } from "@/components/sections/WhyUs";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/seo";

const title = "Construction Services in Zimbabwe | Champs Construction";
const description =
  "Full turnkey builds, labour-only contracting and independent project management in Zimbabwe, plus planning, foundations, roofing, plumbing, electrical, tiling and finishes. Champs Construction, from the stand to the keys.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: pageMeta({
      title,
      description,
      path: "/services",
      keywords:
        "construction services Harare, building contractor Zimbabwe, construction project management Zimbabwe, labour only builders Zimbabwe, house construction services, roofing plumbing electrical Zimbabwe, turnkey builder",
    }),
    links: canonical("/services"),
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <section className="relative bg-brand-gradient pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              What We Do
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
              One team, from the empty stand to the keys in your hand
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              You do not need to line up a builder, a plumber, an electrician and a roofer
              yourself. Champs Construction builds turnkey, supplies supervised labour teams for
              your own materials, or manages your project independently on site.
            </p>
          </Reveal>
        </div>
      </section>

      <ServiceModels />
      <Services />
      <Process />
      <Transformation />
      <WhyUs />
      <Faq />
      <CtaBand />
    </SiteShell>
  );
}
