import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useSiteData } from "@/components/site/use-site-data";
import { testimonialPlaceholders } from "@/data/site-data";

// Real reviews are added by the owner in /admin/testimonials. The section is off until
// switched on in /admin/settings; if it is on with no reviews, the clearly marked
// placeholders show. Stars only appear on real testimonials.
export function Testimonials() {
  const { testimonials: live, toggles } = useSiteData();
  const isLive = live.length > 0;
  const testimonials = isLive ? live : testimonialPlaceholders;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  // Hidden until the owner switches it on in /admin/settings.
  if (!toggles.testimonialsEnabled) return null;

  const current = Math.min(active, testimonials.length - 1);

  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Client Testimonials"
          title="What our clients say"
          subtitle="Families at home and in the diaspora who trusted us to build for them."
        />

        <Reveal>
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-white p-9 shadow-soft lg:p-12">
              {testimonials.map((t, i) => (
                <figure
                  key={i}
                  aria-hidden={i !== current}
                  className={`transition-all duration-700 ${
                    i === current ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  {isLive ? (
                    <div className="flex gap-1 text-accent-gold">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-5 w-5 fill-current stroke-brand-ink/30" />
                      ))}
                    </div>
                  ) : null}
                  <blockquote className="mt-6 text-lg leading-relaxed text-brand-ink/90 lg:text-xl">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    <span
                      aria-hidden
                      className="grid h-14 w-14 place-items-center rounded-full border-2 border-accent-gold bg-brand-gradient font-display text-lg font-semibold text-accent-gold"
                    >
                      {isLive ? t.name.charAt(0) : "?"}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-ink">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>

            {testimonials.length > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  aria-label="Previous testimonial"
                  onClick={() =>
                    setActive((current - 1 + testimonials.length) % testimonials.length)
                  }
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-brand-ink transition hover:border-brand-ink"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Show testimonial ${i + 1}`}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === current ? "w-8 bg-accent-gradient" : "w-2 bg-border"
                      }`}
                    />
                  ))}
                </div>
                <button
                  aria-label="Next testimonial"
                  onClick={() => setActive((current + 1) % testimonials.length)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-brand-ink transition hover:border-brand-ink"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
