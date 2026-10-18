import houseSite from "@/assets/stock-house-scaffolding.jpg";
import { ParallaxBg } from "@/components/site/ParallaxBg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { process } from "@/lib/site-data";

export function Process() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-brand-ink py-24 lg:py-32">
      <ParallaxBg src={houseSite} position="50% 50%" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/60 to-brand-ink/85"
      />
      <div className="relative mx-auto max-w-7xl px-5 [text-shadow:0_2px_14px_rgb(0_0_0/0.55)] lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Your Build, Step by Step"
          subtitle="Six clear stages, each one signed off before the next begins, so you always know what happens next."
          tone="dark"
        />

        <div className="relative mt-20">
          <span
            aria-hidden
            className="absolute top-8 right-0 left-0 hidden h-[2px] bg-gradient-to-r from-white/10 via-accent-gold/70 to-white/10 lg:block"
          />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 90} as="li">
                <div className="group relative text-center lg:text-left">
                  <span className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-gradient font-display text-lg font-bold text-brand-ink shadow-soft [text-shadow:none] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3 lg:mx-0">
                    {step.step}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
