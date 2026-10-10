import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import {
  adminListTestimonials,
  deleteTestimonial,
  moveTestimonial,
  saveTestimonial,
  setTestimonialHidden,
} from "@/data/admin";
import { checkAuth } from "@/data/auth";
import type { TestimonialRecord } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/testimonials")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { testimonials: await adminListTestimonials() };
  },
  head: () => adminSeo("Testimonials"),
  component: TestimonialsAdmin,
});

const empty = { name: "", role: "", quote: "" };

function TestimonialsAdmin() {
  const { testimonials } = Route.useLoaderData();
  const router = useRouter();
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(empty);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [state, setState] = useState({ busy: false, error: "" });

  function edit(t: TestimonialRecord | null) {
    setEditing(t ? t.id : "new");
    setForm(t ? { name: t.name, role: t.role, quote: t.quote } : empty);
    setState({ busy: false, error: "" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setState({ busy: true, error: "" });
    try {
      await saveTestimonial({ data: { ...form, id: editing === "new" ? null : editing } });
      await router.invalidate();
      setEditing(null);
      setState({ busy: false, error: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e) });
    }
  }

  async function run(id: number, action: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await action();
      await router.invalidate();
    } catch (e) {
      setState({ busy: false, error: errorText(e) });
    }
    setBusyId(null);
  }

  return (
    <AdminShell
      title="Testimonials"
      description="Real reviews from your clients, shown in the testimonials section. While there are none, the website shows clearly marked placeholders."
      actions={
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => edit(null)}>
          <Plus size={17} aria-hidden="true" /> Add testimonial
        </button>
      }
    >
      {editing !== null && (
        <AdminCard
          title={editing === "new" ? "New testimonial" : "Edit testimonial"}
          description="Only add words a client actually said, with their permission."
        >
          <form onSubmit={onSubmit} className="admin-form">
            <label className="admin-field">
              <span>Client's name</span>
              <input
                required
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tendai M."
              />
            </label>
            <label className="admin-field">
              <span>Where they live / what you built (optional)</span>
              <input
                maxLength={80}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Client in the UK, 3-bedroom house in Harare"
              />
            </label>
            <label className="admin-field">
              <span>What they said</span>
              <textarea
                required
                maxLength={800}
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
              />
            </label>
            {state.error && (
              <p role="alert" className="admin-error">
                {state.error}
              </p>
            )}
            <div className="admin-actions">
              <button type="submit" disabled={state.busy} className="admin-btn admin-btn-primary">
                {state.busy ? "Saving…" : "Save testimonial"}
              </button>
              <button type="button" className="admin-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      {editing === null && state.error && (
        <p role="alert" className="admin-error">
          {state.error}
        </p>
      )}

      {testimonials.length === 0 ? (
        <p className="admin-muted">No testimonials yet. The website is showing placeholders.</p>
      ) : (
        <ul className="admin-list admin-list-rows">
          {testimonials.map((t, i) => (
            <li
              key={t.id}
              className={t.hidden ? "is-hidden" : undefined}
              aria-busy={busyId === t.id}
            >
              <div className="admin-list-text">
                <strong>
                  {t.name}
                  {t.role && ` · ${t.role}`}
                </strong>
                <p className="admin-quote">“{t.quote}”</p>
                {t.hidden && <small>Hidden from the website</small>}
              </div>
              <div className="admin-row-actions">
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={`Move testimonial from ${t.name} up`}
                  disabled={i === 0 || busyId !== null}
                  onClick={() =>
                    run(t.id, () => moveTestimonial({ data: { id: t.id, direction: "up" } }))
                  }
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={`Move testimonial from ${t.name} down`}
                  disabled={i === testimonials.length - 1 || busyId !== null}
                  onClick={() =>
                    run(t.id, () => moveTestimonial({ data: { id: t.id, direction: "down" } }))
                  }
                >
                  <ArrowDown size={17} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={
                    t.hidden ? `Show testimonial from ${t.name}` : `Hide testimonial from ${t.name}`
                  }
                  disabled={busyId !== null}
                  onClick={() =>
                    run(t.id, () => setTestimonialHidden({ data: { id: t.id, hidden: !t.hidden } }))
                  }
                >
                  {t.hidden ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label={`Edit testimonial from ${t.name}`}
                  onClick={() => edit(t)}
                >
                  <Pencil size={17} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-danger"
                  aria-label={`Delete testimonial from ${t.name}`}
                  disabled={busyId !== null}
                  onClick={() => {
                    if (!window.confirm(`Delete the testimonial from ${t.name}?`)) return;
                    void run(t.id, () => deleteTestimonial({ data: t.id }));
                  }}
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
