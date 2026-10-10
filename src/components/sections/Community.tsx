import { MessageCircle, Users } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useContact } from "@/components/site/use-site-data";

// Takes the slot of the original "company profile" band: same layout, with the
// Champs WhatsApp Community as the call to action.
export function Community() {
  const contact = useContact();

  return (
    <section className="relative overflow-hidden bg-brand-gradient py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-accent-gold/20 blur-[130px]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              WhatsApp Community
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-white sm:text-4xl lg:text-5xl">
              Join the Champs WhatsApp Community
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Get updates on our builds, new stands at The Burbs, Chivhu, and practical tips for
              building back home — straight to your phone.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <a
              href={contact.community}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-accent-gradient px-8 py-4 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-1"
            >
              <Users className="h-5 w-5" />
              Join the Community
            </a>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 text-sm text-white/60">
              If you're planning to build, may God bless your plans.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-x-8 top-6 h-full rounded-3xl bg-white/10" aria-hidden />
            <div className="absolute inset-x-4 top-3 h-full rounded-3xl bg-white/20" aria-hidden />
            <div className="relative rounded-3xl bg-white p-7 shadow-lift">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div>
                  <p className="font-display text-lg font-semibold text-brand-ink">
                    Champs Construction
                  </p>
                  <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase">
                    WhatsApp Community
                  </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Build progress from our sites",
                  "New stands at The Burbs, Chivhu",
                  "Tips for building from the diaspora",
                  "Direct line to the Champs team",
                ].map((line, i) => (
                  <div key={line} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent-gold text-[11px] font-bold text-brand-ink">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{line}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 space-y-2" aria-hidden>
                <span className="block h-2 w-full rounded-full bg-secondary" />
                <span className="block h-2 w-4/5 rounded-full bg-secondary" />
                <span className="block h-2 w-2/3 rounded-full bg-secondary" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
