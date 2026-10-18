import { createFileRoute } from "@tanstack/react-router";

import { Contact } from "@/components/sections/Contact";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Faq } from "@/components/sections/Faq";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/seo";

const title = "Contact Champs Construction | Harare, Zimbabwe";
const description =
  "Talk to Champs Construction about your build. Call, WhatsApp or send an enquiry, and we will come back to you with honest advice and a clear next step.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title,
      description,
      path: "/contact",
      keywords:
        "contact Champs Construction, construction company Harare contact, building quote Zimbabwe",
    }),
    links: canonical("/contact"),
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="relative bg-brand-gradient pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              Contact
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
              Tell us what you want to build
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Whether you have a stand and a plan or only an idea, start the conversation. We
              answer honestly about cost and time before anyone commits to anything.
            </p>
          </Reveal>
        </div>
      </section>

      <EnquiryForm />
      <Contact />
      <Faq />
    </SiteShell>
  );
}
