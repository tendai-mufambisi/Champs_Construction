import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2, UserRound } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText, imageForm, prepareImage } from "@/components/admin/prepare-image";
import {
  addTeamMember,
  adminListTeam,
  deleteTeamMember,
  MAX_TEAM_MEMBERS,
  moveTeamMember,
  removeTeamPhoto,
  saveTeamMember,
  setTeamHidden,
  uploadTeamPhoto,
} from "@/data/admin";
import { checkAuth } from "@/data/auth";
import type { TeamMember } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/team")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { team: await adminListTeam() };
  },
  head: () => adminSeo("Team"),
  component: TeamAdmin,
});

function TeamAdmin() {
  const { team } = Route.useLoaderData();
  const router = useRouter();
  const [state, setState] = useState({ busy: false, error: "" });

  async function onAdd() {
    setState({ busy: true, error: "" });
    try {
      await addTeamMember();
      await router.invalidate();
      setState({ busy: false, error: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e) });
    }
  }

  const full = team.length >= MAX_TEAM_MEMBERS;

  return (
    <AdminShell
      title="Team"
      description={`The people shown in "Meet the team" on the home and about pages. Up to ${MAX_TEAM_MEMBERS}.`}
      actions={
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={onAdd}
          disabled={state.busy || full}
          title={full ? `You can show up to ${MAX_TEAM_MEMBERS} people.` : undefined}
        >
          <Plus className="h-4 w-4" />
          Add member
        </button>
      }
    >
      {state.error ? <p className="admin-error">{state.error}</p> : null}

      {full ? (
        <p className="admin-success">
          You have the maximum of {MAX_TEAM_MEMBERS} team members. Delete one to add another.
        </p>
      ) : null}

      {team.length === 0 ? (
        <AdminCard>
          <p>No team members yet. Add one to start.</p>
        </AdminCard>
      ) : (
        <div className="admin-two-col">
          {team.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              isFirst={index === 0}
              isLast={index === team.length - 1}
            />
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function MemberCard({
  member,
  isFirst,
  isLast,
}: {
  member: TeamMember;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: member.name,
    role: member.role,
    bio: member.bio,
  });
  const [state, setState] = useState({ busy: false, error: "", saved: false });

  async function run(action: () => Promise<unknown>) {
    setState({ busy: true, error: "", saved: false });
    try {
      await action();
      await router.invalidate();
      setState({ busy: false, error: "", saved: true });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: false });
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await run(() => saveTeamMember({ data: { ...form, id: member.id } }));
  }

  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await run(async () => {
      const prepared = await prepareImage(file);
      await uploadTeamPhoto({ data: imageForm(prepared, { id: String(member.id) }) });
    });
    if (fileInput.current) fileInput.current.value = "";
  }

  const label = member.name.trim() || "Unnamed slot";

  return (
    <AdminCard
      title={label}
      description={member.hidden ? "Hidden from the website" : undefined}
      actions={
        <>
          <button
            type="button"
            className="admin-btn admin-btn-small"
            disabled={state.busy || isFirst}
            onClick={() => run(() => moveTeamMember({ data: { id: member.id, direction: "up" } }))}
            aria-label="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-small"
            disabled={state.busy || isLast}
            onClick={() => run(() => moveTeamMember({ data: { id: member.id, direction: "down" } }))}
            aria-label="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-small"
            disabled={state.busy}
            onClick={() => run(() => setTeamHidden({ data: { id: member.id, hidden: !member.hidden } }))}
            aria-label={member.hidden ? "Show on the website" : "Hide from the website"}
          >
            {member.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-small"
            disabled={state.busy}
            onClick={() => {
              if (confirm(`Delete ${label}? This cannot be undone.`)) {
                void run(() => deleteTeamMember({ data: member.id }));
              }
            }}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      }
    >
      <div className="admin-picker">
        <div className="admin-photo-preview">
          {member.photo ? (
            <img src={member.photo} alt={member.photoAlt || label} />
          ) : (
            <span className="grid h-full w-full place-items-center">
              <UserRound className="h-10 w-10 opacity-25" aria-hidden />
            </span>
          )}
        </div>

        <div className="admin-actions">
          <label className="admin-btn admin-btn-small">
            {member.photo ? "Replace photo" : "Upload photo"}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onPhoto}
              disabled={state.busy}
              className="sr-only"
            />
          </label>
          {member.photo ? (
            <button
              type="button"
              className="admin-btn admin-btn-small"
              disabled={state.busy}
              onClick={() => run(() => removeTeamPhoto({ data: member.id }))}
            >
              Remove photo
            </button>
          ) : null}
        </div>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor={`name-${member.id}`}>Name</label>
          <input
            id={`name-${member.id}`}
            value={form.name}
            maxLength={80}
            placeholder="e.g. R Gwenyambira"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="admin-field">
          <label htmlFor={`role-${member.id}`}>Title</label>
          <input
            id={`role-${member.id}`}
            value={form.role}
            maxLength={80}
            placeholder="e.g. Founder &amp; Managing Director"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>

        <div className="admin-field">
          <label htmlFor={`bio-${member.id}`}>Short description (optional)</label>
          <textarea
            id={`bio-${member.id}`}
            rows={3}
            value={form.bio}
            maxLength={400}
            placeholder="One or two sentences about what they do."
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {state.error ? <p className="admin-error">{state.error}</p> : null}
        {state.saved ? <p className="admin-success">Saved.</p> : null}

        <button type="submit" className="admin-btn admin-btn-primary" disabled={state.busy}>
          {state.busy ? "Saving…" : "Save"}
        </button>
      </form>
    </AdminCard>
  );
}
