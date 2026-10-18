import { createFileRoute, Link, notFound, redirect, useRouter } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { AdminCard, AdminShell, ProjectThumb } from "@/components/admin/AdminShell";
import {
  errorText,
  imageForm,
  prepareImage,
  type PreparedImage,
} from "@/components/admin/prepare-image";
import { adminGetWorkPhoto, createWorkPhoto, replaceWorkPhotoImage, saveWorkPhoto } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { isPlaceholder, stages } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/photos/$id")({
  loader: async ({ params }) => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    if (params.id === "new") return { project: null };
    const project = await adminGetWorkPhoto({ data: Number(params.id) });
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params }) => adminSeo(params.id === "new" ? "Add a project photo" : "Edit project"),
  component: ProjectEditor,
});

const stageHints: Record<string, string> = {
  Before: "The stand, site clearance, setting out or the team ready to start.",
  During: "Foundations, walls, roofing and work in progress.",
  After: "Finished homes and handovers.",
};

function ProjectEditor() {
  const { project } = Route.useLoaderData();
  const router = useRouter();
  const isNew = project === null;
  const placeholder = project ? isPlaceholder(project.src) : false;

  // A placeholder's caption starts with the "[REPLACE…]" note; drop it when editing.
  const initialCaption = (project?.caption ?? "").replace(
    /^\[REPLACE WITH CHAMPS PROJECT PHOTO\]\s*/,
    "",
  );
  const [caption, setCaption] = useState(initialCaption);
  const [stage, setStage] = useState<string>(project?.stage ?? "");
  const [alt, setAlt] = useState(
    project && project.alt !== project.caption && !placeholder ? project.alt : "",
  );
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function choose(file: File | undefined) {
    if (!file) return;
    setError("");
    setPreparing(true);
    try {
      setImage(await prepareImage(file));
    } catch (e) {
      setError(errorText(e));
    }
    setPreparing(false);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved("");
    if (isNew && !image) {
      setError("Please choose a photo first.");
      return;
    }
    if (placeholder && !image) {
      setError("This is still a placeholder. Choose a real photo to replace it.");
      return;
    }
    setBusy(true);
    try {
      const fields = { caption, stage, alt };
      if (isNew) {
        const { id } = await createWorkPhoto({ data: imageForm(image!, fields) });
        await router.invalidate();
        await router.navigate({ to: "/admin/photos/$id", params: { id: String(id) } });
        return;
      }
      await saveWorkPhoto({ data: { id: project.id, ...fields } });
      if (image) {
        await replaceWorkPhotoImage({ data: imageForm(image, { id: String(project.id) }) });
        setImage(null);
      }
      await router.invalidate();
      setSaved("Saved. The website is updated.");
    } catch (e) {
      setError(errorText(e));
    }
    setBusy(false);
  }

  return (
    <AdminShell
      title={isNew ? "Add a project photo" : placeholder ? "Replace placeholder" : "Edit project"}
      description={
        isNew || placeholder
          ? "Take or choose a photo from a real Champs site, then pick its stage."
          : undefined
      }
      actions={
        <Link to="/admin/photos" className="admin-btn">
          Back to projects
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="admin-editor">
        <AdminCard title="Photo">
          <div className="admin-photo">
            {image ? (
              <img src={image.previewUrl} alt="" className="admin-photo-preview" />
            ) : project ? (
              <ProjectThumb project={project} className="admin-photo-preview" />
            ) : (
              <button
                type="button"
                className="admin-dropzone"
                onClick={() => fileInput.current?.click()}
              >
                <ImagePlus size={30} aria-hidden="true" />
                {preparing ? "Preparing photo…" : "Tap to choose a photo"}
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              hidden
              onChange={(e) => {
                void choose(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {(image || project) && (
              <button
                type="button"
                className={placeholder && !image ? "admin-btn admin-btn-primary" : "admin-btn"}
                disabled={preparing}
                onClick={() => fileInput.current?.click()}
              >
                {preparing
                  ? "Preparing photo…"
                  : image
                    ? "Choose a different photo"
                    : placeholder
                      ? "Choose the real photo"
                      : "Replace photo"}
              </button>
            )}
            <p className="admin-muted">
              Photos are resized automatically. Use photos of real Champs sites only — never stock
              or AI images.
            </p>
          </div>
        </AdminCard>

        <AdminCard title="Details">
          <div className="admin-form">
            <label className="admin-field">
              <span>Caption</span>
              <input
                required
                maxLength={140}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Three-bedroom house, roof going on"
              />
            </label>
            <label className="admin-field">
              <span>Stage</span>
              <select required value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="" disabled>
                  Choose a stage
                </option>
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {stage && <small className="admin-muted">{stageHints[stage]}</small>}
            </label>
            <label className="admin-field">
              <span>Description for Google and screen readers (optional)</span>
              <input
                maxLength={300}
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Leave empty to use the caption"
              />
            </label>
          </div>
        </AdminCard>

        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="admin-success">
            {saved}
          </p>
        )}
        <div className="admin-actions">
          <button
            type="submit"
            disabled={busy || preparing}
            className="admin-btn admin-btn-primary"
          >
            {busy ? "Saving…" : isNew ? "Add to website" : "Save changes"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
