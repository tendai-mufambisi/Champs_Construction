import * as Icons from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteShell } from "@/components/site/SiteShell";
import { useContact } from "@/components/site/use-site-data";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/seo";
import { labourOnly, labourWhatsappText } from "@/lib/site-data";

const title = "Labour-Only Builders in Zimbabwe | Champs Construction";
const description =
  "Have your own building materials? Champs Construction provides vetted, foreman-led artisan teams on fixed milestone pricing, for a whole build or specific stages.";

export const Route = createFileRoute("/labour-only")({
  head: () => ({
    meta: pageMeta({
      title,
      description,
      path: "/labour-only",
      image: "/images/people/ceiling-crew.jpg",
      imageAlt: "The Champs crew fitting a ceiling inside a house under construction",
      keywords:
        "labour only builders Zimbabwe, labour only contract Harare, builders for hire Zimbabwe, bricklayers Harare, milestone pricing construction",
    }),
    links: canonical("/labour-only"),
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Labour-Only Contracting", path: "/labour-only" },
      ]),
    ],
  }),
  component: LabourOnlyPage,
});

function LabourOnlyPage() {
  const contact = useContact();
  const whatsapp = contact.whatsappLink(labourWhatsappText);

  return (
    <SiteShell>
      <section className="relative bg-brand-gradient pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              {labourOnly.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
              {labourOnly.title}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {labourOnly.intro}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <CtaButtons whatsapp={whatsapp} />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <img
              src="/images/people/ceiling-crew.jpg"
              alt="The Champs crew fitting a ceiling inside a house under construction"
              loading="lazy"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Why Champs Labour"
              title="No absentee artisans. No wasted materials."
              align="left"
            />
            <Reveal delay={160}>
              <p className="mt-6 leading-relaxed text-muted-foreground">{labourOnly.pitfalls}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="What We Provide" title="A disciplined, supervised team" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {labourOnly.provide.map((item, i) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[item.icon];
              return (
                <Reveal key={item.title} delay={i * 90}>
                  <article className="h-full rounded-3xl border border-border bg-white p-7 shadow-soft">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-accent-gold">
                      {Icon ? <Icon className="h-6 w-6" /> : null}
                    </span>
                    <h3 className="mt-6 text-lg font-semibold text-brand-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Stages of Engagement"
              title="The whole build, or just the stage you need"
              subtitle="Contract our labour teams for an entire build or for specific structural phases."
              align="left"
            />
            <ul className="mt-10 space-y-5">
              {labourOnly.stages.map((stage, i) => (
                <Reveal key={stage.title} delay={i * 70}>
                  <li className="flex gap-4">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden />
                    <div>
                      <p className="font-semibold text-brand-ink">{stage.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {stage.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="How It Works" title="Four clear steps" align="left" />
            <ol className="mt-10 space-y-5">
              {labourOnly.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 70}>
                  <li className="flex gap-5 rounded-2xl border border-border bg-surface p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-gradient font-display font-bold text-brand-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-ink">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-surface pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="rounded-[2rem] bg-brand-gradient px-8 py-12 text-center shadow-lift lg:px-12">
              <p className="eyebrow justify-center text-accent-gold">Ready to Build?</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                Have your materials ready to go?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/70">
                Partner with a disciplined, supervised team that delivers clean structural work and
                respects your budget.
              </p>
              <div className="flex justify-center">
                <CtaButtons whatsapp={whatsapp} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

function CtaButtons({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="mt-9 flex flex-wrap gap-4">
      <Link
        to="/"
        hash="enquiry"
        className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-0.5"
      >
        Request a Labour Quote
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-white hover:text-brand-ink"
      >
        <MessageCircle className="h-4 w-4" />
        Chat on WhatsApp
      </a>
    </div>
  );
}
