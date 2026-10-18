import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText, imageForm, prepareImage } from "@/components/admin/prepare-image";
import {
  adminGetSettings,
  removeFounderPhoto,
  saveSettings,
  uploadFounderPhoto,
  removeCompanyProfile,
  saveToggles,
  uploadCompanyProfile,
} from "@/data/admin";
import { changeAdminPassword, checkAuth } from "@/data/auth";
import {
  FOUNDER_PLACEHOLDER_SRC,
  FOUNDER_QUOTE_PLACEHOLDER,
  type SiteToggles,
} from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";
import { statLabels } from "@/lib/site-data";

export const Route = createFileRoute("/admin/settings")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return adminGetSettings();
  },
  head: () => adminSeo("Settings"),
  component: SettingsAdmin,
});

/** Inline success / error line under a form. */
function Feedback({ error, saved }: { error: string; saved: string }) {
  if (error) {
    return (
      <p role="alert" className="admin-error">
        {error}
      </p>
    );
  }
  return saved ? (
    <p role="status" className="admin-success">
      {saved}
    </p>
  ) : null;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {hint && <small className="admin-muted">{hint}</small>}
    </label>
  );
}

function SettingsAdmin() {
  const settings = Route.useLoaderData();
  const router = useRouter();

  const [contact, setContact] = useState(settings.contact);
  const [founderName, setFounderName] = useState(settings.founder.name);
  // The placeholder text is the "not set" state; show an empty box instead.
  const [founderQuote, setFounderQuote] = useState(
    settings.founder.quote === FOUNDER_QUOTE_PLACEHOLDER ? "" : settings.founder.quote,
  );
  const [stats, setStats] = useState(settings.stats);
  const [burbs, setBurbs] = useState(settings.burbs);
  const [state, setState] = useState({ busy: false, error: "", saved: "" });

  const setC = (key: keyof typeof contact) => (e: { target: { value: string } }) =>
    setContact((c) => ({ ...c, [key]: e.target.value }));
  const setB =
    (key: Exclude<keyof typeof burbs, "noDeposit">) => (e: { target: { value: string } }) =>
      setBurbs((b) => ({ ...b, [key]: e.target.value }));

  async function save(event: FormEvent) {
    event.preventDefault();
    setState({ busy: true, error: "", saved: "" });
    try {
      await saveSettings({ data: { contact, founderName, founderQuote, stats, burbs } });
      await router.invalidate();
      setState({ busy: false, error: "", saved: "Saved. The website is updated." });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: "" });
    }
  }

  return (
    <AdminShell
      title="Settings"
      description="Contact details, founder, stats and The Burbs. Changes show on the website as soon as you save."
    >
      <form onSubmit={save} className="admin-editor">
        <AdminCard
          title="Contact details"
          description="Used in the header, footer, contact section and every WhatsApp button."
        >
          <div className="admin-form">
            <Field label="Main phone (also WhatsApp)" hint="Shown on the site exactly as typed.">
              <input required value={contact.phone} onChange={setC("phone")} inputMode="tel" />
            </Field>
            <Field
              label="WhatsApp number for buttons and the enquiry form"
              hint="With the country code, e.g. 263 71 379 6159."
            >
              <input
                required
                value={contact.whatsapp}
                onChange={setC("whatsapp")}
                inputMode="tel"
              />
            </Field>
            <Field
              label="Second phone (optional)"
              hint="Leave empty to hide it. Write it with +263 so its WhatsApp button works."
            >
              <input value={contact.phone2} onChange={setC("phone2")} inputMode="tel" />
            </Field>
            <Field label="Email">
              <input required type="email" value={contact.email} onChange={setC("email")} />
            </Field>
            <Field label="Facebook page link">
              <input type="url" value={contact.facebook} onChange={setC("facebook")} />
            </Field>
            <Field label="WhatsApp Community invite link">
              <input type="url" value={contact.community} onChange={setC("community")} />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Founder" description="Shown in “Meet Our Founder”.">
          <div className="admin-form">
            <Field label="Founder's name">
              <input
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field
              label="Founder's quote"
              hint={`Until this is filled in, the site shows “${FOUNDER_QUOTE_PLACEHOLDER}”.`}
            >
              <textarea
                value={founderQuote}
                onChange={(e) => setFounderQuote(e.target.value)}
                maxLength={400}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard
          title="Stats"
          description="Only enter confirmed numbers, e.g. 25 or 10+. An empty box shows “[X]” on the site."
        >
          <div className="admin-form">
            {statLabels.map((s) => (
              <Field key={s.key} label={s.label}>
                <input
                  value={stats[s.key]}
                  maxLength={12}
                  onChange={(e) => setStats((st) => ({ ...st, [s.key]: e.target.value }))}
                />
              </Field>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="The Burbs, Chivhu"
          description="The featured development. Keep the legal status accurate and up to date: it is shown in full on the site."
        >
          <div className="admin-form">
            <Field label="Location">
              <input value={burbs.location} onChange={setB("location")} maxLength={160} />
            </Field>
            <Field label="Stand size">
              <input value={burbs.standSize} onChange={setB("standSize")} maxLength={60} />
            </Field>
            <Field label="Cash plan">
              <input value={burbs.cashPlan} onChange={setB("cashPlan")} maxLength={120} />
            </Field>
            <Field label="Terms plan">
              <input value={burbs.termsPlan} onChange={setB("termsPlan")} maxLength={120} />
            </Field>
            <Field label="Legal status">
              <textarea value={burbs.legalStatus} onChange={setB("legalStatus")} maxLength={600} />
            </Field>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={burbs.noDeposit}
                onChange={(e) => setBurbs((b) => ({ ...b, noDeposit: e.target.checked }))}
              />
              Show “No deposit · No interest” (only once confirmed)
            </label>
          </div>
        </AdminCard>

        <Feedback error={state.error} saved={state.saved} />
        <div className="admin-actions">
          <button type="submit" disabled={state.busy} className="admin-btn admin-btn-primary">
            {state.busy ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>

      <FounderPhoto current={settings.founder.photo?.src ?? null} />
      <SectionToggles toggles={settings.toggles} />
      <CompanyProfile current={settings.toggles.companyProfilePdf} />
      <ChangePassword />
    </AdminShell>
  );
}

function FounderPhoto({ current }: { current: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ busy: false, error: "", saved: "" });

  async function upload(file: File | undefined) {
    if (!file) return;
    setState({ busy: true, error: "", saved: "" });
    try {
      await uploadFounderPhoto({ data: imageForm(await prepareImage(file)) });
      await router.invalidate();
      setState({ busy: false, error: "", saved: "Photo updated." });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: "" });
    }
  }

  async function remove() {
    if (!window.confirm("Remove the founder photo and go back to the placeholder?")) return;
    setState({ busy: true, error: "", saved: "" });
    try {
      await removeFounderPhoto();
      await router.invalidate();
      setState({ busy: false, error: "", saved: "Photo removed." });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: "" });
    }
  }

  return (
    <AdminCard
      title="Founder photo"
      description={current ? undefined : "Currently a placeholder picture."}
    >
      <div className="admin-photo admin-photo-small">
        <img src={current ?? FOUNDER_PLACEHOLDER_SRC} alt="" className="admin-photo-preview" />
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={(e) => {
            void upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn"
            disabled={state.busy}
            onClick={() => input.current?.click()}
          >
            {state.busy ? "Working…" : current ? "Replace photo" : "Upload photo"}
          </button>
          {current && (
            <button type="button" className="admin-btn" disabled={state.busy} onClick={remove}>
              Remove
            </button>
          )}
        </div>
        <Feedback error={state.error} saved={state.saved} />
      </div>
    </AdminCard>
  );
}

/**
 * Sections the owner can switch off. The Burbs is a land offering rather than
 * construction work, so it is the one most likely to come and go; switching it
 * off hides the section without losing the details already captured.
 */
function SectionToggles({ toggles }: { toggles: SiteToggles }) {
  const router = useRouter();
  const [value, setValue] = useState({
    burbsEnabled: toggles.burbsEnabled,
    teamEnabled: toggles.teamEnabled,
  });
  const [state, setState] = useState({ busy: false, error: "", saved: "" });

  async function save(event: FormEvent) {
    event.preventDefault();
    setState({ busy: true, error: "", saved: "" });
    try {
      await saveToggles({ data: value });
      await router.invalidate();
      setState({ busy: false, error: "", saved: "Saved." });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: "" });
    }
  }

  return (
    <AdminCard
      title="Website sections"
      description="Turn a whole section of the website on or off. Nothing is deleted."
    >
      <form onSubmit={save} className="admin-form">
        <div className="admin-check-grid">
          <label className="admin-check">
            <input
              type="checkbox"
              checked={value.burbsEnabled}
              onChange={(e) => setValue({ ...value, burbsEnabled: e.target.checked })}
            />
            Show &ldquo;The Burbs, Chivhu&rdquo; stands section
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={value.teamEnabled}
              onChange={(e) => setValue({ ...value, teamEnabled: e.target.checked })}
            />
            Show &ldquo;Meet the team&rdquo; section
          </label>
        </div>
        <Feedback error={state.error} saved={state.saved} />
        <button type="submit" className="admin-btn admin-btn-primary" disabled={state.busy}>
          {state.busy ? "Saving…" : "Save sections"}
        </button>
      </form>
    </AdminCard>
  );
}

/**
 * The downloadable company profile. While none is uploaded the download button
 * stays hidden on the website rather than linking to nothing.
 */
function CompanyProfile({ current }: { current: string }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ busy: false, error: "", saved: "" });

  async function run(action: () => Promise<unknown>, saved: string) {
    setState({ busy: true, error: "", saved: "" });
    try {
      await action();
      await router.invalidate();
      setState({ busy: false, error: "", saved });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: "" });
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    await run(() => uploadCompanyProfile({ data: form }), "Company profile uploaded.");
  }

  return (
    <AdminCard
      title="Company profile"
      description="A PDF visitors can download. The button only appears on the website once a file is uploaded."
    >
      <div className="admin-form">
        {current ? (
          <p>
            <a href={current} target="_blank" rel="noreferrer">
              View the current company profile
            </a>
          </p>
        ) : (
          <p>No company profile uploaded yet, so the download button is hidden.</p>
        )}

        <div className="admin-actions">
          <label className="admin-btn admin-btn-primary">
            {current ? "Replace PDF" : "Upload PDF"}
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf"
              disabled={state.busy}
              onChange={onPick}
              className="sr-only"
            />
          </label>
          {current ? (
            <button
              type="button"
              className="admin-btn admin-btn-small"
              disabled={state.busy}
              onClick={() => run(() => removeCompanyProfile(), "Company profile removed.")}
            >
              Remove
            </button>
          ) : null}
        </div>

        <Feedback error={state.error} saved={state.saved} />
      </div>
    </AdminCard>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [state, setState] = useState({ busy: false, error: "", saved: "" });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setState({ busy: true, error: "", saved: "" });
    try {
      const result = await changeAdminPassword({ data: { current, next } });
      if (result.ok) {
        setCurrent("");
        setNext("");
        setState({ busy: false, error: "", saved: "Password changed." });
      } else {
        setState({
          busy: false,
          error: result.error ?? "Could not change the password.",
          saved: "",
        });
      }
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: "" });
    }
  }

  return (
    <AdminCard title="Change password">
      <form onSubmit={onSubmit} className="admin-form">
        <Field label="Current password">
          <input
            type="password"
            autoComplete="current-password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </Field>
        <Feedback error={state.error} saved={state.saved} />
        <div className="admin-actions">
          <button type="submit" disabled={state.busy} className="admin-btn admin-btn-primary">
            {state.busy ? "Saving…" : "Change password"}
          </button>
        </div>
      </form>
    </AdminCard>
  );
}
