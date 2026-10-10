import * as Icons from "lucide-react";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { comparison, trustPillars } from "@/lib/site-data";

export function WhyUs() {
  return (
    <section id="why-champs" className="relative bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Champs"
          title="Building from abroad, without the stress"
          subtitle="We know the stories. That is why every Champs build runs on one accountable team and weekly reports you can see for yourself."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-white p-8 shadow-soft lg:p-10">
              <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                The usual way
              </p>
              <h3 className="mt-2 text-xl font-semibold text-brand-ink lg:text-2xl">
                {comparison.usual.title}:
              </h3>
              <ul className="mt-6 space-y-4">
                {comparison.usual.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-brand-ink/80">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                      <X className="h-4 w-4" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-3xl bg-brand-gradient p-8 text-white shadow-lift lg:p-10">
              <p className="text-xs font-bold tracking-[0.18em] text-accent-gold uppercase">
                The Champs way
              </p>
              <h3 className="mt-2 text-xl font-semibold lg:text-2xl">{comparison.champs.title}:</h3>
              <ul className="mt-6 space-y-4">
                {comparison.champs.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-white/90">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-gold text-brand-ink">
                      <Check className="h-4 w-4" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 space-y-6">
          {trustPillars.map((item, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[item.icon];
            const flip = i % 2 === 1;
            return (
              <Reveal key={item.title} delay={i * 60}>
                <article
                  className={`group flex flex-col gap-6 rounded-3xl border border-border bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:items-center lg:gap-10 lg:p-9 ${
                    flip ? "sm:flex-row-reverse" : "sm:flex-row"
                  }`}
                >
                  <span className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-accent-gold shadow-soft transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                    {Icon ? <Icon className="h-9 w-9" /> : null}
                    <span
                      className="absolute -right-1.5 -bottom-1.5 h-6 w-6 rounded-lg bg-accent-gradient"
                      aria-hidden
                    />
                  </span>
                  <div className={flip ? "sm:text-right" : ""}>
                    <h3 className="text-xl font-semibold text-brand-ink lg:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className={`hidden font-display text-5xl font-semibold text-brand/10 lg:block ${flip ? "sm:mr-auto" : "sm:ml-auto"}`}
                  >
                    0{i + 1}
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
