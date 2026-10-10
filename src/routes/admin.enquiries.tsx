import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import { adminListEnquiries, deleteEnquiry, setEnquiryStatus } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { enquiryStatuses, type EnquiryRecord, type EnquiryStatus } from "@/data/enquiry";
import { waNumber, whatsappUrl } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/enquiries")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { enquiries: await adminListEnquiries() };
  },
  head: () => adminSeo("Enquiries"),
  component: EnquiriesAdmin,
});

/** D1 stores UTC as "YYYY-MM-DD HH:MM:SS"; show it in the viewer's local time. */
const when = (utc: string) =>
  new Date(`${utc.replace(" ", "T")}Z`).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

function EnquiryCard({
  e,
  busy,
  onStatus,
  onDelete,
}: {
  e: EnquiryRecord;
  busy: boolean;
  onStatus: (s: EnquiryStatus) => void;
  onDelete: () => void;
}) {
  const reply = whatsappUrl(
    waNumber(e.whatsapp),
    `Hi ${e.name.split(" ")[0]}, thank you for your enquiry with Champs Construction.`,
  );
  const rows: [string, string][] = [
    ["Country", e.country],
    ["WhatsApp", e.whatsapp],
    ["Owns a stand", e.ownsStand],
    ["Stand location", e.standLocation || "-"],
    ["Type of build", e.buildType],
    ["Budget", e.budget],
    ["Start", e.startWhen],
  ];

  return (
    <AdminCard
      title={e.name}
      description={when(e.createdAt)}
      actions={
        <span className="admin-pill" data-status={e.status}>
          {e.status}
        </span>
      }
    >
      <dl className="admin-enquiry-meta">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {e.message && <p className="admin-enquiry-message">{e.message}</p>}
      <div className="admin-actions" style={{ marginTop: 16 }}>
        <a href={reply} target="_blank" rel="noreferrer" className="admin-btn admin-btn-primary">
          <MessageCircle size={17} aria-hidden="true" /> Reply on WhatsApp
        </a>
        <label className="admin-field" style={{ minWidth: 160 }}>
          <span className="sr-only">Status</span>
          <select
            value={e.status}
            disabled={busy}
            onChange={(ev) => onStatus(ev.target.value as EnquiryStatus)}
          >
            {enquiryStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="admin-icon-btn admin-icon-danger"
          aria-label={`Delete the enquiry from ${e.name}`}
          disabled={busy}
          onClick={onDelete}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </AdminCard>
  );
}

function EnquiriesAdmin() {
  const { enquiries } = Route.useLoaderData();
  const router = useRouter();
  const [filter, setFilter] = useState<string>("All");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const shown = enquiries.filter((e) => filter === "All" || e.status === filter);

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

  return (
    <AdminShell
      title="Enquiries"
      description="Every build enquiry sent from the website form. The visitor's WhatsApp also opens with the same answers, so you may already have their message."
    >
      <div className="admin-filters" role="group" aria-label="Filter by status">
        {["All", ...enquiryStatuses].map((s) => (
          <button
            key={s}
            type="button"
            className="admin-chip"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
          >
            {s}
            {s !== "All" && ` (${enquiries.filter((e) => e.status === s).length})`}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {shown.length === 0 ? (
        <p className="admin-muted">No enquiries here yet.</p>
      ) : (
        shown.map((e) => (
          <EnquiryCard
            key={e.id}
            e={e}
            busy={busyId === e.id}
            onStatus={(status) => run(e.id, () => setEnquiryStatus({ data: { id: e.id, status } }))}
            onDelete={() => {
              if (!window.confirm(`Delete the enquiry from ${e.name}? This can't be undone.`))
                return;
              void run(e.id, () => deleteEnquiry({ data: e.id }));
            }}
          />
        ))
      )}
    </AdminShell>
  );
}
