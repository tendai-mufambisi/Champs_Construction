import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ZoomIn } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Lightbox } from "@/components/site/Lightbox";
import { useContact, useSiteData } from "@/components/site/use-site-data";
import { isPlaceholder, stages, type Stage } from "@/data/site-data";

const filters = ["All", ...stages] as const;

const stageTone: Record<Stage, string> = {
  Before: "bg-white/95 text-brand-ink",
  During: "bg-accent-gold text-brand-ink",
  After: "bg-brand-ink text-accent-gold",
};

// Photos are managed by the owner from /admin/projects. The first visible photo is
// shown large; every card opens the full-screen viewer.
export function Projects() {
  const { workPhotos: projects } = useSiteData();
  const contact = useContact();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.stage === filter)),
    [filter, projects],
  );
  const images = filtered.map((p) => p.src);

  return (
    <section id="projects" className="relative bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Work"
          title="Before. During. After."
          subtitle="Every build follows the same path. Here is a look at our sites, stage by stage."
        />

        <Reveal>
          <div
            className="mt-12 flex flex-wrap justify-center gap-2.5"
            role="tablist"
            aria-label="Filter projects by stage"
          >
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  filter === f
                    ? "border-transparent bg-brand-gradient text-white shadow-soft"
                    : "border-border bg-white text-brand-ink hover:border-brand-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            Photos for this stage are coming soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => {
              // The first photo is shown large in whichever shape fills the 3-column
              // grid without a gap: 2x2 when the count is a multiple of 3, otherwise
              // two columns wide when that completes the last row.
              const n = filtered.length;
              const tall = i === 0 && n >= 3 && n % 3 === 0;
              const wide = i === 0 && !tall && n >= 2 && (n + 1) % 3 === 0;
              const featured = tall || wide;
              return (
                <Reveal
                  key={project.id}
                  delay={(i % 3) * 90}
                  className={tall ? "sm:col-span-2 lg:row-span-2" : wide ? "sm:col-span-2" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={`View photo: ${project.caption}`}
                    className="group relative block h-full w-full overflow-hidden rounded-[1.75rem] border border-border bg-white text-left shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift"
                  >
                    <img
                      src={project.src}
                      alt={project.alt}
                      loading="lazy"
                      decoding="async"
                      width={project.width}
                      height={project.height}
                      className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 ${
                        tall
                          ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[30rem]"
                          : wide
                            ? "aspect-[4/3] lg:aspect-[11/4]"
                            : "aspect-[4/3]"
                      }`}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/10 to-transparent"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase ${stageTone[project.stage]}`}
                      >
                        {project.stage}
                      </span>
                      {isPlaceholder(project.src) ? (
                        <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-brand-ink uppercase">
                          Placeholder
                        </span>
                      ) : null}
                    </div>
                    <span className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                    <p
                      className={`absolute inset-x-5 bottom-5 font-semibold text-white ${featured ? "text-xl lg:text-2xl" : "text-base"}`}
                    >
                      {project.caption}
                    </p>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal>
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-brand-gradient px-8 py-10 text-center shadow-lift md:flex-row md:text-left lg:px-12">
            <div>
              <p className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Ready to start building back home?
              </p>
              <p className="mt-2 text-white/70">
                Tell us about your stand and your plans, and we'll guide you through the next steps.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                hash="enquiry"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start My Build
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={contact.whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-white hover:text-brand-ink"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <Lightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </section>
  );
}
