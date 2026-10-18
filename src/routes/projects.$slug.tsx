import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, HardHat, MapPin } from "lucide-react";

import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { useSiteData } from "@/components/site/use-site-data";
import { getProjectBySlug } from "@/data/public-data";
import { renderMarkdown } from "@/lib/markdown";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/seo";
import { company } from "@/lib/site-data";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const detail = await getProjectBySlug({ data: params.slug });
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found | Champs Construction" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    const title = `${project.title} | Champs Construction`;
    const description =
      project.summary ||
      `${project.title} by Champs Construction${project.location ? ` in ${project.location}` : ""}.`;

    return {
      meta: pageMeta({
        title,
        description,
        path: `/projects/${params.slug}`,
        // The project's own cover, falling back to the branded share card.
        image: project.cover,
        imageAlt: project.coverAlt,
        type: "article",
      }),
      links: canonical(`/projects/${params.slug}`),
      scripts: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${params.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectPage,
});

function ProjectNotFound() {
  return (
    <SiteShell>
      <section className="grid min-h-[60vh] place-items-center bg-surface px-5 pt-32 pb-20">
        <div className="text-center">
          <HardHat className="mx-auto h-14 w-14 text-muted-foreground/30" aria-hidden />
          <h1 className="mt-6 text-2xl font-semibold text-brand-ink">Project not found</h1>
          <p className="mt-3 text-muted-foreground">
            That project does not exist, or it is not published yet.
          </p>
          <Link
            to="/projects"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-bold text-brand-ink shadow-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All projects
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

function ProjectPage() {
  const { project, images } = Route.useLoaderData();
  const { projects } = useSiteData();

  // The cover already leads the page, so the gallery shows everything else.
  const gallery = images.filter((image) => image.url !== project.cover);
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <SiteShell>
      <article>
        <section className="relative bg-brand-gradient pt-36 pb-16 lg:pt-44 lg:pb-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-accent-gold"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                All projects
              </Link>
            </Reveal>

            <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div>
                {project.category ? (
                  <Reveal>
                    <span className="eyebrow text-accent-gold">
                      <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
                      {project.category}
                    </span>
                  </Reveal>
                ) : null}
                <Reveal delay={80}>
                  <h1 className="mt-4 text-4xl leading-[1.08] font-semibold text-white sm:text-5xl">
                    {project.title}
                  </h1>
                </Reveal>
                {project.summary ? (
                  <Reveal delay={160}>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                      {project.summary}
                    </p>
                  </Reveal>
                ) : null}

                <Reveal delay={220}>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
                    {project.location ? (
                      <div>
                        <dt className="text-white/50">Location</dt>
                        <dd className="mt-1 inline-flex items-center gap-1.5 font-semibold text-white">
                          <MapPin className="h-4 w-4 text-accent-gold" aria-hidden />
                          {project.location}
                        </dd>
                      </div>
                    ) : null}
                    {project.year ? (
                      <div>
                        <dt className="text-white/50">Year</dt>
                        <dd className="mt-1 font-semibold text-white">{project.year}</dd>
                      </div>
                    ) : null}
                    {project.status ? (
                      <div>
                        <dt className="text-white/50">Status</dt>
                        <dd className="mt-1 font-semibold text-accent-gold">{project.status}</dd>
                      </div>
                    ) : null}
                  </dl>
                </Reveal>
              </div>

              <Reveal delay={120}>
                <div className="overflow-hidden rounded-2xl bg-white/5 shadow-lg ring-1 ring-white/10">
                  {project.cover ? (
                    <img
                      src={project.cover}
                      alt={project.coverAlt}
                      className="aspect-4/3 w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-4/3 w-full place-items-center">
                      <HardHat className="h-20 w-20 text-white/15" aria-hidden />
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:px-8">
            <div>
              {project.body.trim() ? (
                // Safe: renderMarkdown escapes the source before emitting any tags.
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(project.body) }} />
              ) : (
                <p className="leading-relaxed text-muted-foreground">
                  {project.summary || "Details for this project are being written up."}
                </p>
              )}
            </div>

            {project.scope.length > 0 ? (
              <aside>
                <div className="sticky top-28 rounded-2xl border border-border bg-surface p-7">
                  <h2 className="text-sm font-bold tracking-[0.18em] text-brand uppercase">
                    Scope of work
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {project.scope.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-brand-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent-gradient px-6 py-3 text-sm font-bold text-brand-ink shadow-accent"
                  >
                    Build something like this
                  </Link>
                </div>
              </aside>
            ) : null}
          </div>
        </section>

        {gallery.length > 0 ? (
          <section className="bg-surface py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <h2 className="text-2xl font-semibold text-brand-ink sm:text-3xl">
                More from this project
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((image, i) => (
                  <Reveal key={image.id} delay={(i % 3) * 80}>
                    <img
                      src={image.url}
                      alt={image.alt || `${project.title} — ${company.name}`}
                      loading="lazy"
                      className="aspect-4/3 w-full rounded-2xl border border-border object-cover shadow-soft"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="bg-white py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <h2 className="text-2xl font-semibold text-brand-ink sm:text-3xl">Other projects</h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p, i) => (
                  <Reveal key={p.id} delay={i * 90}>
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <CtaBand />
    </SiteShell>
  );
}
