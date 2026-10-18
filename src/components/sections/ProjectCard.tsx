import { Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, MapPin } from "lucide-react";

import type { ProjectRecord } from "@/data/site-data";

const DEFAULT_STATUS_STYLE = "bg-brand-ink/90 text-white";

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-brand-ink/90 text-white",
  "In Progress": "bg-accent-gold text-brand-ink",
  Upcoming: "bg-white/90 text-brand-ink",
};

/**
 * One project in a grid. Shared by the home page teaser and /projects so a
 * project looks the same wherever it is shown.
 */
export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-shadow duration-300 hover:shadow-lg">
      <Link to="/projects/$slug" params={{ slug: project.slug }} className="block">
        <div className="relative aspect-4/3 overflow-hidden bg-secondary">
          {project.cover ? (
            <img
              src={project.cover}
              alt={project.coverAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            // No photo uploaded yet: a branded placeholder beats a broken image.
            <div className="grid h-full w-full place-items-center bg-brand-ink/5">
              <HardHat className="h-16 w-16 text-muted-foreground/25" aria-hidden />
            </div>
          )}

          {project.status ? (
            <span
              className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${
                STATUS_STYLES[project.status] ?? DEFAULT_STATUS_STYLE
              }`}
            >
              {project.status}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-col px-6 py-5">
        {project.category ? (
          <span className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
            {project.category}
          </span>
        ) : null}

        <h3 className="mt-2 text-lg leading-snug font-semibold text-brand-ink">
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="transition-colors hover:text-brand"
          >
            {project.title}
          </Link>
        </h3>

        {project.summary ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {project.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {project.location}
            </span>
          ) : null}
          {project.year ? <span>{project.year}</span> : null}
        </div>

        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-ink"
        >
          View project
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
