import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useSiteData } from "@/components/site/use-site-data";
import { FALLBACK_PROJECTS, type ProjectRecord, type Stage } from "@/data/site-data";

const stages: { label: Stage; title: string; body: string }[] = [
  {
    label: "Before",
    title: "A cleared stand and a team ready",
    body: "Site preparation: the stand is cleared and set out, materials arrive and our team is on site. You get the first photos in your weekly report.",
  },
  {
    label: "During",
    title: "Foundation to roof, week by week",
    body: "Walls go up and the roof goes on. Every week you receive photos and a progress update, so you can see the build moving from wherever you are.",
  },
  {
    label: "After",
    title: "Finished, inspected, handed over",
    body: "Plumbing, electrical, tiling and painting complete the house. We inspect it together, then put the keys in your hands.",
  },
];

const badge =
  "rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.16em] uppercase shadow-soft";

/** The first visible photo for a stage, or the shipped one if the owner removed them all. */
function photoFor(projects: ProjectRecord[], stage: Stage): ProjectRecord {
  return (
    projects.find((p) => p.stage === stage) ?? FALLBACK_PROJECTS.find((p) => p.stage === stage)!
  );
}

/*
 * A build told as a scroll story.
 *
 * Desktop: the section is three screens tall and its content is pinned; scroll
 * position picks the stage (before -> during -> after) and the photos crossfade.
 * One passive scroll listener batched into requestAnimationFrame; React only
 * re-renders when the stage actually changes.
 *
 * Phones: no pinning — the three stages stack as a simple vertical timeline.
 */
export function Transformation() {
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState(0);
  const { projects } = useSiteData();
  const photos = stages.map((s) => photoFor(projects, s.label));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!desktop.matches) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / travel));
      if (barRef.current) barRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      setStage(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    desktop.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Clicking a stage scrolls to the middle of that stage's stretch of the section.
  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * (i * 0.33 + 0.16), behavior: "smooth" });
  };

  const layer = (i: number) =>
    `absolute inset-0 transition-all duration-700 ease-out ${
      stage === i ? "opacity-100 scale-100" : "pointer-events-none scale-[1.04] opacity-0"
    }`;

  return (
    <section
      ref={sectionRef}
      id="transformation"
      className="relative overflow-x-clip bg-white lg:h-[300vh]"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:pt-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-[1fr_1.05fr] lg:px-8 lg:py-0">
          {/* Story */}
          <div>
            <Reveal>
              <span className="eyebrow text-brand">
                <span className="h-[3px] w-8 rounded-full bg-accent-gold" aria-hidden />
                Weekly Progress Reports
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 text-3xl leading-[1.1] font-semibold text-brand-ink sm:text-4xl lg:text-5xl">
                See your house rise, without being there
              </h2>
            </Reveal>

            {/* Desktop: stage list with a progress rail that fills as you scroll. */}
            <ol className="relative mt-10 hidden space-y-2 pl-10 lg:block">
              <span
                aria-hidden
                className="absolute top-3 bottom-3 left-[13px] w-0.5 rounded bg-border"
              />
              <span
                ref={barRef}
                aria-hidden
                className="absolute top-3 bottom-3 left-[13px] w-0.5 origin-top scale-y-0 rounded bg-accent-gradient"
              />
              {stages.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={stage === i ? "step" : undefined}
                    className="group relative block w-full rounded-2xl p-4 text-left transition-colors duration-500 hover:bg-surface"
                  >
                    <span
                      aria-hidden
                      className={`absolute top-5 -left-10 grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-bold transition-all duration-500 ${
                        stage >= i
                          ? "border-transparent bg-accent-gradient text-brand-ink shadow-accent"
                          : "border-border bg-white text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors duration-500 ${
                        stage === i ? "text-brand-ink" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                    <span
                      className={`mt-1 block text-xl font-semibold transition-colors duration-500 ${
                        stage === i ? "text-brand-ink" : "text-brand-ink/40"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`grid transition-all duration-500 ${
                        stage === i
                          ? "mt-2 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <Reveal delay={200}>
              <Link
                to="/"
                hash="projects"
                className="group mt-8 hidden items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 lg:inline-flex"
              >
                See our work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* Desktop: one frame, three crossfading layers. */}
          <div className="relative mx-auto hidden aspect-[4/5] h-[72vh] max-h-[44rem] lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-brand-ink shadow-lift">
              {photos.map((photo, i) => (
                <div key={stages[i]!.label} className={layer(i)}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-transparent to-transparent" />
                  <p className="absolute right-6 bottom-6 left-6 text-sm font-semibold text-white">
                    {photo.caption}
                  </p>
                </div>
              ))}
            </div>

            {/* The earlier stage floats outside the frame, so the change is obvious. */}
            <div
              className={`absolute -top-6 -right-8 w-[34%] -rotate-3 rounded-2xl border-[6px] border-white bg-white shadow-lift transition-all duration-700 ${
                stage > 0
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-6 opacity-0"
              }`}
            >
              <img
                src={photos[stage > 0 ? stage - 1 : 0]!.src}
                alt=""
                className="aspect-[3/4] w-full rounded-lg object-cover"
              />
              <p className="px-1 pt-2 pb-1 text-xs font-bold text-brand-ink">
                {stages[stage > 0 ? stage - 1 : 0]!.label}
              </p>
            </div>

            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span
                className={`${badge} transition-colors duration-500 ${
                  stage === 0
                    ? "bg-white text-brand-ink"
                    : stage === 1
                      ? "bg-accent-gold text-brand-ink"
                      : "bg-brand-ink text-accent-gold"
                }`}
              >
                {stages[stage]?.label}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-brand-ink">
                {stage + 1} / 3
              </span>
            </div>
          </div>

          {/* Phones: a vertical timeline, one stage after another. */}
          <ol className="relative space-y-12 border-l-2 border-border pl-7 lg:hidden">
            {stages.map((s, i) => (
              <li key={s.label} className="relative">
                <span className="absolute top-0 -left-[43px] grid h-7 w-7 place-items-center rounded-full bg-accent-gradient text-[11px] font-bold text-brand-ink shadow-accent">
                  {i + 1}
                </span>
                <Reveal>
                  <span className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
                    {s.label}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-brand-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-5 overflow-hidden rounded-3xl shadow-lift">
                    <img
                      src={photos[i]!.src}
                      alt={photos[i]!.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
            <li>
              <Link
                to="/"
                hash="projects"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white"
              >
                See our work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
