import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { trustPillars } from "@/lib/site-data";

// A moving strip of the Champs trust pillars straight under the hero, so diaspora
// visitors see the promise within the first scroll.
export function WorkStrip() {
  const loop = [...trustPillars, ...trustPillars];

  return (
    <section
      aria-label="Why clients trust Champs"
      className="relative overflow-hidden bg-brand-ink py-10 lg:py-14"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5 lg:px-8">
        <div>
          <span className="eyebrow text-accent-gold">
            <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
            Build From Anywhere
          </span>
          <p className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            You stay informed. We do the hard work.
          </p>
        </div>
        <Link
          to="/"
          hash="how-it-works"
          className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-0.5"
        >
          How It Works
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 overflow-hidden">
        <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map((pillar, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[pillar.icon];
            return (
              <li
                key={i}
                aria-hidden={i >= trustPillars.length}
                className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-gold text-brand-ink">
                  {Icon ? <Icon className="h-6 w-6" /> : null}
                </span>
                <span className="font-display text-lg font-semibold whitespace-nowrap text-white">
                  {pillar.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
