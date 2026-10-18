import { createFileRoute, Link } from "@tanstack/react-router";
import { HardHat } from "lucide-react";

import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Projects as WorkGallery } from "@/components/sections/Projects";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { useSiteData } from "@/components/site/use-site-data";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/seo";

const title = "Our Projects | Champs Construction Zimbabwe";
const description =
  "Houses, boundary walls and structures built by Champs Construction across Zimbabwe. See the work, the scope and the finish on each project.";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: pageMeta({
      title,
      description,
      path: "/projects",
      keywords:
        "construction projects Zimbabwe, houses built in Harare, Champs Construction projects, building contractor portfolio Zimbabwe",
    }),
    links: canonical("/projects"),
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]),
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = useSiteData();

  return (
    <SiteShell>
      <section className="relative bg-brand-gradient pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              Our Projects
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
              Every project here is one we would show you in person
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Houses, walls and structures across Zimbabwe. Open any one to see the scope, the
              stage it reached and how it was finished.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {projects.length === 0 ? (
            // Honest empty state: better than inventing projects to fill a grid.
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-surface px-8 py-16 text-center">
              <HardHat className="mx-auto h-12 w-12 text-muted-foreground/30" aria-hidden />
              <h2 className="mt-5 text-xl font-semibold text-brand-ink">
                Our project pages are on the way
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                In the meantime, the photo gallery below shows work in progress on our sites, and
                we are happy to walk you through any build in detail.
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex rounded-full bg-accent-gradient px-6 py-3 text-sm font-bold text-brand-ink shadow-accent"
              >
                Talk to us about your build
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={(i % 3) * 90}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The Before/During/After photo strip, which is separate from project pages. */}
      <WorkGallery />
      <CtaBand />
    </SiteShell>
  );
}
