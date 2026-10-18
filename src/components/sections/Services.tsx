import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ParallaxBg } from "@/components/site/ParallaxBg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { services } from "@/lib/site-data";

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-brand-ink">
      {/* The photo sits behind the whole section, cards included. A light, even
          overlay keeps it clear; the cards carry their own tint for legibility. */}
      <ParallaxBg src="/images/projects/bulawayo/inspection.jpg" position="50% 50%" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand-ink/85 via-brand-ink/60 to-brand-ink/80"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 [text-shadow:0_2px_14px_rgb(0_0_0/0.45)] lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="Our Services"
            title="Everything from the stand to the keys"
            subtitle="We do everything from supplying materials and all construction work until you have the keys in your hands — handled by one accountable team."
            tone="dark"
            align="left"
          />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon];
            return (
              <Reveal key={service.title} delay={(i % 5) * 90}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/15 bg-brand-ink/60 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-lift">
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-brand-gradient transition-transform duration-500 group-hover:scale-y-100"
                  />
                  <div className="relative">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-accent-gold transition-colors duration-500 group-hover:bg-accent-gradient group-hover:text-brand-ink">
                      {Icon ? <Icon className="h-6 w-6" /> : null}
                    </span>
                    <h3 className="mt-6 text-lg font-semibold text-white">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75 transition-colors duration-500 group-hover:text-white/85">
                      {service.body}
                    </p>
                    <Link
                      to="/"
                      hash="enquiry"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-accent-gold"
                    >
                      Enquire
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
