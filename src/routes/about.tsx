import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/sections/About";
import { Community } from "@/components/sections/Community";
import { CtaBand } from "@/components/sections/CtaBand";
import { Founder } from "@/components/sections/Founder";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/seo";

const title = "About Champs Construction | Building Partners You Can Trust";
const description =
  "Champs Construction is a Zimbabwean building company led by Mr. R Gwenyambira. Meet the team accountable for your build, from the first quotation to the day you get the keys.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title,
      description,
      path: "/about",
      keywords:
        "about Champs Construction, Zimbabwean building company, R Gwenyambira, construction team Harare",
    }),
    links: canonical("/about"),
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <section className="relative bg-brand-gradient pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              About Us
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
              Building partners you can trust
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Everyone has heard the story of the build that stalled, the money that went missing
              and the owner who could never get a straight answer. Champs Construction exists to be
              the opposite of that.
            </p>
          </Reveal>
        </div>
      </section>

      <About />
      <Founder />
      <Team />
      <WhyUs />
      <Testimonials />
      <Community />
      <CtaBand />
    </SiteShell>
  );
}
