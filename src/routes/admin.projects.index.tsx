import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, HardHat, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import {
  adminListProjectPages,
  deleteProjectPage,
  moveProjectPage,
  saveProjectPage,
} from "@/data/admin-projects";
import { checkAuth } from "@/data/auth";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/projects/")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { projects: await adminListProjectPages() };
  },
  head: () => adminSeo("Projects"),
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const { projects } = Route.useLoaderData();
  const router = useRouter();
  const [state, setState] = useState({ busy: false, error: "" });

  async function onAdd() {
    setState({ busy: true, error: "" });
    try {
      // Created as a draft so a half-written page is never live.
      const { id } = await saveProjectPage({
        data: {
          title: "New project",
          category: "",
          location: "",
          year: String(new Date().getFullYear()),
          status: "Completed",
          summary: "",
          body: "",
          scope: "",
          featured: false,
          published: false,
        },
      });
      await router.navigate({ to: "/admin/projects/$id", params: { id: String(id) } });
    } catch (e) {
      setState({ busy: false, error: errorText(e) });
    }
  }

  async function run(action: () => Promise<unknown>) {
    setState({ busy: true, error: "" });
    try {
      await action();
      await router.invalidate();
      setState({ busy: false, error: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e) });
    }
  }

  return (
    <AdminShell
      title="Projects"
      description="Each project gets its own page on the website. Add photos, a description and the scope of work."
      actions={
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={onAdd}
          disabled={state.busy}
        >
          <Plus className="h-4 w-4" />
          Add project
        </button>
      }
    >
      {state.error ? <p className="admin-error">{state.error}</p> : null}

      {projects.length === 0 ? (
        <AdminCard>
          <p>
            No projects yet. Add your first one — it will appear on the website once you tick
            &ldquo;Show on the website&rdquo;.
          </p>
        </AdminCard>
      ) : (
        <AdminCard>
          <ul className="admin-list">
            {projects.map((project, index) => (
              <li key={project.id} className="admin-row">
                <div className="admin-thumb">
                  {project.cover ? (
                    <img src={project.cover} alt="" loading="lazy" />
                  ) : (
                    <span className="grid h-full w-full place-items-center">
                      <HardHat className="h-6 w-6 opacity-25" aria-hidden />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <strong>{project.title}</strong>
                  <p>
                    {[project.category, project.location, project.year].filter(Boolean).join(" · ") ||
                      "No details yet"}
                  </p>
                  <div className="admin-row-actions">
                    {project.published ? (
                      <span className="admin-pill">Live</span>
                    ) : (
                      <span className="admin-pill">Draft</span>
                    )}
                    {project.featured ? <span className="admin-pill">Featured</span> : null}
                  </div>
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    disabled={state.busy || index === 0}
                    onClick={() => run(() => moveProjectPage({ data: { id: project.id, direction: "up" } }))}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    disabled={state.busy || index === projects.length - 1}
                    onClick={() => run(() => moveProjectPage({ data: { id: project.id, direction: "down" } }))}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <Link
                    to="/admin/projects/$id"
                    params={{ id: String(project.id) }}
                    className="admin-btn admin-btn-small"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    disabled={state.busy}
                    onClick={() => {
                      if (confirm(`Delete "${project.title}" and its photos? This cannot be undone.`)) {
                        void run(() => deleteProjectPage({ data: project.id }));
                      }
                    }}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </AdminShell>
  );
}
