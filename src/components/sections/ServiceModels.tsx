import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { serviceModels } from "@/lib/site-data";

/**
 * The three ways to engage Champs: turnkey, labour-only and independent project
 * management. Without this, the site reads as fix-and-supply only, and the client
 * who already has materials or a builder never finds out we can help.
 */
export function ServiceModels() {
  return (
    <section id="service-models" className="relative bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="How We Can Work With You"
          title="Three ways to build with Champs"
          subtitle="Choose the service that matches your budget and how involved you want to be. Every option comes with the same accountable team and a weekly progress report system."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {serviceModels.map((model, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[model.icon];
            return (
              <Reveal key={model.title} delay={i * 90}>
                <article className="group flex h-full flex-col rounded-3xl border border-border bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-accent-gold transition-transform duration-500 group-hover:scale-105">
                      {Icon ? <Icon className="h-6 w-6" /> : null}
                    </span>
                    <span className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-bold text-brand-ink">
                      {model.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-brand-ink">{model.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.body}</p>

                  <p className="mt-5 flex gap-2 text-sm font-semibold text-brand-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <span>Ideal for: {model.idealFor}</span>
                  </p>

                  <div className="mt-auto pt-7">
                    {model.link ? (
                      <Link
                        to={model.link}
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-ink"
                      >
                        See how labour-only works
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <Link
                        to="/"
                        hash="enquiry"
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-ink"
                      >
                        Enquire about this
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    )}
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
