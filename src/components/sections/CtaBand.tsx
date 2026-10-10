import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import roof from "@/assets/stock-roof-scaffolding.jpg";
import { ParallaxBg } from "@/components/site/ParallaxBg";
import { Reveal } from "@/components/site/Reveal";
import { useContact } from "@/components/site/use-site-data";

// Full-bleed call to action between the proof (portfolio, testimonials) and the detail sections.
export function CtaBand() {
  const contact = useContact();

  return (
    <section aria-label="Start your build" className="relative overflow-hidden bg-brand-ink">
      <ParallaxBg src={roof} speed={0.4} position="50% 40%" />
      <div
        aria-hidden
        className="absolute inset-0 bg-brand-ink/75 lg:bg-transparent lg:bg-gradient-to-r lg:from-brand-ink/95 lg:via-brand-ink/75 lg:to-brand-ink/15"
      />
      <div aria-hidden className="diagonal-band absolute inset-0 hidden opacity-90 lg:block" />

      <div className="relative mx-auto flex min-h-[32rem] max-w-7xl items-center px-5 py-24 lg:min-h-[38rem] lg:px-8">
        <div className="max-w-xl">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              Turnkey Construction
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 text-4xl leading-[1.05] font-bold text-white uppercase sm:text-5xl lg:text-6xl">
              From Site Clearance
              <span className="block text-accent-gold">To Keys In Hand.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg">
              We supply the materials, do all the construction work and keep you updated every week
              until you have the keys in your hands. Tell us about your stand and we'll take it from
              there.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/"
                hash="enquiry"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-4 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-1"
              >
                Start My Build
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={contact.whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white transition-colors duration-300 hover:bg-white hover:text-brand-ink"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
