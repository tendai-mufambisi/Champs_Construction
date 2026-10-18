import { createFileRoute, Link, notFound, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText, imageForm, prepareImage } from "@/components/admin/prepare-image";
import {
  adminGetProjectPage,
  deleteProjectImage,
  saveProjectPage,
  setProjectCover,
  uploadProjectImage,
} from "@/data/admin-projects";
import { checkAuth } from "@/data/auth";
import { projectStatuses } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/projects/$id")({
  loader: async ({ params }) => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    const detail = await adminGetProjectPage({ data: Number(params.id) });
    if (!detail) throw notFound();
    return detail;
  },
  head: () => adminSeo("Edit project"),
  component: ProjectEditor,
});

function ProjectEditor() {
  const { project, images } = Route.useLoaderData();
  const router = useRouter();

  const [form, setForm] = useState({
    title: project.title,
    category: project.category,
    location: project.location,
    year: project.year,
    status: project.status,
    summary: project.summary,
    body: project.body,
    scope: project.scope.join("\n"),
    featured: project.featured,
    published: project.published,
  });
  const [state, setState] = useState({ busy: false, error: "", saved: false });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setState({ busy: true, error: "", saved: false });
    try {
      await saveProjectPage({ data: { ...form, id: project.id } });
      await router.invalidate();
      setState({ busy: false, error: "", saved: true });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: false });
    }
  }

  return (
    <AdminShell
      title={project.title}
      description="This page appears at /projects/ on the website."
      actions={
        <Link to="/admin/projects" className="admin-btn admin-btn-small">
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>
      }
    >
      <div className="admin-two-col">
        <AdminCard title="Details">
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="title">Project title</label>
              <input
                id="title"
                required
                value={form.title}
                maxLength={120}
                placeholder="e.g. Four-bedroom house, Chivhu"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="category">Type of work</label>
              <input
                id="category"
                value={form.category}
                maxLength={60}
                placeholder="e.g. Residential build, Boundary wall"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={form.location}
                maxLength={120}
                placeholder="e.g. Chivhu"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                value={form.year}
                maxLength={12}
                placeholder="e.g. 2026"
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {projectStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="summary">Short summary</label>
              <textarea
                id="summary"
                rows={3}
                value={form.summary}
                maxLength={400}
                placeholder="One or two sentences. This shows on the project card."
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="body">Full description</label>
              <textarea
                id="body"
                rows={10}
                value={form.body}
                placeholder={"## The brief\n\nWhat the client wanted.\n\n## What we did\n\n- Point one\n- Point two"}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
              <small>
                Use ## for a heading, - for a bullet and **bold** for emphasis. Leave it empty and
                the summary is shown instead.
              </small>
            </div>

            <div className="admin-field">
              <label htmlFor="scope">Scope of work — one per line</label>
              <textarea
                id="scope"
                rows={6}
                value={form.scope}
                placeholder={"Foundations\nBrickwork\nRoofing\nPlumbing and electrical"}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
              />
            </div>

            <div className="admin-check-grid">
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Show on the website
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Feature on the home page
              </label>
            </div>

            {state.error ? <p className="admin-error">{state.error}</p> : null}
            {state.saved ? <p className="admin-success">Saved.</p> : null}

            <button type="submit" className="admin-btn admin-btn-primary" disabled={state.busy}>
              {state.busy ? "Saving…" : "Save changes"}
            </button>
          </form>
        </AdminCard>

        <GalleryCard projectId={project.id} cover={project.cover} images={images} />
      </div>
    </AdminShell>
  );
}

function GalleryCard({
  projectId,
  cover,
  images,
}: {
  projectId: number;
  cover: string | null;
  images: { id: number; url: string; alt: string }[];
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [state, setState] = useState({ busy: false, error: "", progress: "" });

  async function run(action: () => Promise<unknown>) {
    setState({ busy: true, error: "", progress: "" });
    try {
      await action();
      await router.invalidate();
      setState({ busy: false, error: "", progress: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e), progress: "" });
    }
  }

  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    if (files.length === 0) return;

    setState({ busy: true, error: "", progress: "" });
    try {
      // Sequential rather than parallel: each upload also writes a row, and
      // ordering keeps the gallery positions predictable.
      for (const [index, file] of files.entries()) {
        setState({ busy: true, error: "", progress: `Uploading ${index + 1} of ${files.length}…` });
        const prepared = await prepareImage(file);
        await uploadProjectImage({
          data: imageForm(prepared, { projectId: String(projectId), alt }),
        });
      }
      setAlt("");
      await router.invalidate();
      setState({ busy: false, error: "", progress: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e), progress: "" });
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <AdminCard
      title="Photos"
      description="The cover is what shows on the project card. The rest appear in the gallery on the project page."
    >
      <div className="admin-field">
        <label htmlFor="photo-alt">Describe these photos (for accessibility)</label>
        <input
          id="photo-alt"
          value={alt}
          maxLength={300}
          placeholder="e.g. Completed four-bedroom house in Chivhu"
          onChange={(e) => setAlt(e.target.value)}
        />
      </div>

      <label className="admin-btn admin-btn-block">
        {state.progress || "Choose photos"}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={state.busy}
          onChange={onUpload}
          className="sr-only"
        />
      </label>

      {state.error ? <p className="admin-error">{state.error}</p> : null}

      {images.length === 0 ? (
        <p>No photos yet. The project shows a placeholder until you add one.</p>
      ) : (
        <ul className="admin-photo-grid">
          {images.map((image) => {
            const isCover = image.url === cover;
            return (
              <li key={image.id} className="admin-photo">
                <img src={image.url} alt={image.alt} loading="lazy" />
                {isCover ? <span className="admin-pill">Cover</span> : null}
                <div className="admin-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    disabled={state.busy || isCover}
                    onClick={() =>
                      run(() =>
                        setProjectCover({ data: { projectId, url: image.url, alt: image.alt } }),
                      )
                    }
                  >
                    <Star className="h-4 w-4" />
                    Cover
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    disabled={state.busy}
                    onClick={() => run(() => deleteProjectImage({ data: { projectId, imageId: image.id } }))}
                    aria-label="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}
