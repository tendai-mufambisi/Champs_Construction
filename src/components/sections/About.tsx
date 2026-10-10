import { Compass, Eye, ShieldCheck, Target } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To turn a stand into a finished home for Zimbabweans at home and abroad, handling the hard work and keeping the client informed at every stage.",
  },
  {
    icon: Eye,
    title: "Our Promise",
    body: "From site clearance until we hand you the keys, with weekly progress reports, so you always know exactly what is happening, wherever you are.",
  },
  {
    icon: ShieldCheck,
    title: "How We Work",
    body: "Professional, transparent and accountable: quality control at every stage and the client engaged throughout the project.",
  },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative pb-10">
            <Reveal>
              <img
                src="/images/projects/champs-team-on-site.jpg"
                alt="The Champs Construction team in hard hats and safety overalls on site"
                loading="lazy"
                width={637}
                height={318}
                className="aspect-[4/3] w-full rounded-[2rem] object-cover object-left shadow-lift"
              />
            </Reveal>
            <Reveal delay={200}>
              <img
                src="/images/projects/champs-house-during-construction.jpg"
                alt="A single-storey house built by Champs Construction, under construction"
                loading="lazy"
                width={637}
                height={278}
                className="absolute -right-2 bottom-0 hidden w-60 rounded-2xl border-4 border-white object-cover shadow-lift sm:block lg:w-72"
              />
            </Reveal>
            <Reveal delay={300}>
              <div className="absolute bottom-2 left-0 rounded-2xl bg-accent-gradient px-6 py-5 text-brand-ink shadow-lift sm:left-6">
                <p className="font-display text-2xl font-bold">Harare-based</p>
                <p className="text-xs font-bold tracking-[0.16em] uppercase">
                  Local & diaspora clients
                </p>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <span className="eyebrow text-brand">
                <span className="h-[3px] w-8 rounded-full bg-accent-gold" aria-hidden />
                About Champs Construction
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 text-3xl leading-tight font-semibold text-brand-ink sm:text-4xl lg:text-5xl">
                Your stand. Your home. Our hard work.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Champs Construction is a Harare-based residential construction company founded by
                  Mr. Regai. We help Zimbabweans at home and abroad turn a stand into a finished
                  home — handling planning, materials, construction and handover, while keeping the
                  client informed at every stage.
                </p>
                <p>
                  Building from abroad is hard when you can't see the site. That is why every Champs
                  client receives weekly progress reports with photos, and deals with one
                  accountable team from the first consultation to the day the keys are handed over.
                </p>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-8 font-display text-2xl font-semibold text-brand sm:text-3xl">
                Building Partners You Can Trust.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <article className="group h-full rounded-3xl border border-border bg-surface p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-lift">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-accent-gold transition-transform duration-500 group-hover:scale-105">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-brand-ink">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex items-center justify-center gap-3 text-center text-sm font-semibold text-muted-foreground">
            <Compass className="h-4 w-4 shrink-0 text-brand" />
            For Zimbabweans at home and in the diaspora
          </div>
        </Reveal>
      </div>
    </section>
  );
}
