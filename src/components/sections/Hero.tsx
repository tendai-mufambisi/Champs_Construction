import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Images, MessageCircle } from "lucide-react";
import { CompanyProfileButton } from "@/components/site/CompanyProfileButton";
import { Counter, Reveal } from "@/components/site/Reveal";
import { useContact, useSiteData } from "@/components/site/use-site-data";
import { statLabels, trustBadges } from "@/lib/site-data";

// Real Champs sites and team, from the project photos in public/images/projects.
const slides = [
  {
    src: "/images/projects/mvurwi/finished-front.jpg",
    alt: "A finished four-bedroom Champs home in Mvurwi with a face-brick front and chimney",
    position: "50% 55%",
  },
  {
    src: "/images/projects/executive/roofing.jpg",
    alt: "Champs roofers fixing red roof sheets on a large brick house",
    position: "50% 50%",
  },
  {
    src: "/images/projects/executive/team.jpg",
    alt: "The Champs Construction team in hard hats and orange overalls on site",
    position: "50% 35%",
  },
  {
    src: "/images/projects/mvurwi/roofing.jpg",
    alt: "Builders fixing the roof on a Champs house under construction",
    position: "50% 45%",
  },
  {
    src: "/images/projects/family-home/side.jpg",
    alt: "A completed Champs family home with cream walls and dark aluminium windows",
    position: "50% 50%",
  },
];

const SLIDE_MS = 5000;

/** A confirmed number animates; an unconfirmed one shows "[X]" (never a made-up figure). */
function StatValue({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!value) return <span>[X]</span>;
  if (!match) return <span>{value}</span>;
  return <Counter value={Number(match[1])} suffix={match[2] ?? ""} />;
}

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const contact = useContact();
  const { stats } = useSiteData();

  // Parallax on desktop only: the transform is written straight to the layer
  // inside requestAnimationFrame, so scrolling never re-renders the hero.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = desktop.matches ? Math.min(window.scrollY, 900) * 0.2 : 0;
      layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame && window.scrollY < 1200) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div ref={layerRef} className="absolute inset-0 lg:will-change-transform">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1920}
            height={1280}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            style={{ objectPosition: slide.position }}
            className={`absolute inset-0 h-[115vh] w-full object-cover transition-opacity duration-[1800ms] ease-in-out ${
              i === active ? "kenburns-slide opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      {/* Mobile stacks the copy full-width, so it needs a flat scrim; from lg the
          directional gradient takes over and keeps the right of the photo clear. */}
      <div className="absolute inset-0 bg-brand-ink/70 lg:bg-brand-ink/20" />
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{ background: "var(--gradient-overlay)" }}
      />
      {/* The diagonal yellow band from the Champs flyers. */}
      <div aria-hidden className="diagonal-band absolute inset-0 hidden opacity-90 lg:block" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-32 pb-24 lg:px-8">
        <Reveal>
          <span className="eyebrow text-accent-gold">
            <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
            Turnkey Home Construction
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-bold text-white uppercase sm:text-6xl lg:text-7xl">
            Building Back Home,
            <span className="block text-accent-gold">Done Right.</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Building in Zimbabwe, at home or from abroad? Champs Construction builds and manages
            your project from groundwork to handover, so it runs properly even when you are not on
            the ground, with one accountable team at every stage.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={contact.whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-4 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-1"
            >
              <MessageCircle className="h-4 w-4" />
              Start My Build — WhatsApp
            </a>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-brand-ink"
            >
              <Images className="h-4 w-4" />
              See Our Work
            </Link>
            {/* Appears only once a PDF has been uploaded in the dashboard. */}
            <CompanyProfileButton tone="outline-dark" className="px-7 py-4" />
          </div>
        </Reveal>

        <Reveal delay={400}>
          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {trustBadges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-2 text-sm font-semibold text-white/90"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-gold">
                  <Check className="h-3 w-3 text-brand-ink" />
                </span>
                {badge}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={500}>
          <div className="glass mt-14 grid grid-cols-3 gap-y-8 rounded-3xl px-4 py-8 sm:px-6 lg:max-w-3xl">
            {statLabels.map((s) => (
              <div
                key={s.key}
                className="text-center sm:border-r sm:border-white/10 sm:last:border-none"
              >
                <p className="font-display text-2xl font-semibold text-white sm:text-5xl">
                  <StatValue value={stats[s.key]} />
                </p>
                <p className="mt-2 text-[10px] font-semibold tracking-[0.14em] text-white/60 uppercase sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Link
        to="/"
        hash="about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/60 transition hover:text-white lg:block"
      >
        <ChevronDown className="floaty h-7 w-7" />
      </Link>
    </section>
  );
}
