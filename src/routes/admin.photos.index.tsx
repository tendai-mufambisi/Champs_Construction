import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AdminShell, ProjectThumb } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import { adminListWorkPhotos, deleteWorkPhoto, moveWorkPhoto, setWorkPhotoHidden } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { isPlaceholder, stages, type WorkPhotoRecord } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/photos/")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { projects: await adminListWorkPhotos() };
  },
  head: () => adminSeo("Projects"),
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const { projects } = Route.useLoaderData();
  const router = useRouter();
  const [filter, setFilter] = useState<string>("All");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const shown = projects.filter((p) => filter === "All" || p.stage === filter);
  // Reordering only makes sense on the full list, where neighbours are real neighbours.
  const canReorder = filter === "All";

  async function run(id: number, action: () => Promise<unknown>) {
    setBusyId(id);
    setError("");
    try {
      await action();
      await router.invalidate();
    } catch (e) {
      setError(errorText(e));
    }
    setBusyId(null);
  }

  const remove = (p: WorkPhotoRecord) => {
    if (!window.confirm(`Delete "${p.caption}"? This can't be undone.`)) return;
    void run(p.id, () => deleteWorkPhoto({ data: p.id }));
  };

  return (
    <AdminShell
      title="Projects"
      description="The Before / During / After photos in the Our Work section, in this order. Replace the placeholders with real Champs photos as soon as you have them."
      actions={
        <Link
          to="/admin/photos/$id"
          params={{ id: "new" }}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={17} aria-hidden="true" /> Add photo
        </Link>
      }
    >
      <div className="admin-filters" role="group" aria-label="Filter by stage">
        {["All", ...stages].map((c) => (
          <button
            key={c}
            type="button"
            className="admin-chip"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {!canReorder && <p className="admin-muted">Show “All” to change the order.</p>}
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}

      {shown.length === 0 ? (
        <p className="admin-muted">No photos for this stage yet.</p>
      ) : (
        <ul className="admin-list admin-list-rows">
          {shown.map((p, i) => (
            <li
              key={p.id}
              className={p.hidden ? "is-hidden" : undefined}
              aria-busy={busyId === p.id}
            >
              <ProjectThumb project={p} />
              <div className="admin-list-text">
                <strong>{p.caption}</strong>
                <small>
                  {p.stage}
                  {isPlaceholder(p.src) && " · Placeholder, replace with a real photo"}
                  {p.hidden && " · Hidden from the website"}
                </small>
              </div>
              <div className="admin-row-actions">
                {canReorder && (
                  <>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label={`Move "${p.caption}" up`}
                      disabled={i === 0 || busyId !== null}
                      onClick={() =>
                        run(p.id, () => moveWorkPhoto({ data: { id: p.id, direction: "up" } }))
                      }
                    >
                      <ArrowUp size={17} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label={`Move "${p.caption}" down`}
                      disabled={i === shown.length - 1 || busyId !== null}
                      onClick={() =>
                        run(p.id, () => moveWorkPhoto({ data: { id: p.id, direction: "down" } }))
                      }
                    >
                      <ArrowDown size={17} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={
                    p.hidden ? `Show "${p.caption}" on the website` : `Hide "${p.caption}"`
                  }
                  title={p.hidden ? "Show on the website" : "Hide from the website"}
                  disabled={busyId !== null}
                  onClick={() =>
                    run(p.id, () => setWorkPhotoHidden({ data: { id: p.id, hidden: !p.hidden } }))
                  }
                >
                  {p.hidden ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <Link
                  to="/admin/photos/$id"
                  params={{ id: String(p.id) }}
                  className="admin-btn admin-btn-small"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-danger"
                  aria-label={`Delete "${p.caption}"`}
                  disabled={busyId !== null}
                  onClick={() => remove(p)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
