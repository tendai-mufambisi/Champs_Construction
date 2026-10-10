import { Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useSiteData } from "@/components/site/use-site-data";
import { FOUNDER_PLACEHOLDER_SRC } from "@/data/site-data";

// Name, quote and photo are set in the dashboard. Until the client confirms them the
// quote shows "[FOUNDER QUOTE — TO CONFIRM]". No biography details are invented here.
export function Founder() {
  const { founder } = useSiteData();
  const photo = founder.photo ?? {
    src: FOUNDER_PLACEHOLDER_SRC,
    width: 1024,
    height: 1280,
    alt: "Placeholder for a photo of the founder",
  };

  return (
    <section id="founder" className="relative overflow-hidden bg-surface py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 -left-32 h-[26rem] w-[26rem] rounded-full bg-accent-gold/15 blur-[130px]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <span
              aria-hidden
              className="absolute -top-5 -left-5 h-32 w-32 rounded-3xl border-4 border-accent-gold"
            />
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              width={photo.width}
              height={photo.height}
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift"
            />
            <div className="absolute right-4 -bottom-6 rounded-2xl bg-white px-6 py-4 shadow-lift">
              <p className="font-display text-lg font-semibold text-brand-ink">{founder.name}</p>
              <p className="text-xs font-bold tracking-[0.16em] text-brand uppercase">Founder</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow text-brand">
              <span className="h-[3px] w-8 rounded-full bg-accent-gold" aria-hidden />
              Leadership
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-brand-ink sm:text-4xl lg:text-5xl">
              Meet Our Founder
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <blockquote className="relative mt-8 rounded-3xl border border-border bg-white p-8 shadow-soft lg:p-10">
              <Quote className="absolute -top-5 left-8 h-10 w-10 rounded-xl bg-accent-gradient p-2 text-brand-ink" />
              <p className="text-lg leading-relaxed text-brand-ink/90 lg:text-xl">
                “{founder.quote}”
              </p>
              <footer className="mt-8 border-t border-border pt-6">
                <p className="font-display text-2xl font-semibold text-brand-ink">{founder.name}</p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  Founder · Champs Construction
                </p>
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-8 font-display text-2xl font-semibold text-brand sm:text-3xl">
              Building Back Home, Done Right.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
