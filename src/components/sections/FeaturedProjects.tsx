import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/sections/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useSiteData } from "@/components/site/use-site-data";

/**
 * The home page's taste of the portfolio.
 *
 * Featured projects first, then whatever else is published, capped at three so
 * the page stays a shop window. The full list lives at /projects.
 *
 * Renders nothing while no project has been published — an empty grid under a
 * confident heading looks worse than no section at all.
 */
export function FeaturedProjects() {
  const { projects } = useSiteData();
  if (projects.length === 0) return null;

  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length > 0 ? featured : projects).slice(0, 3);

  return (
    <section id="projects" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Projects"
          title="Work we have put our name to"
          subtitle="Houses, walls and structures we have built across Zimbabwe. Open any project to see what it involved."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <Reveal key={project.id} delay={i * 90}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-3.5 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-0.5"
          >
            See all projects
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
