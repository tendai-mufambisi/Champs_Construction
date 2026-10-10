import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Images, Inbox, MessageSquareQuote, Plus, Settings } from "lucide-react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { adminListEnquiries, adminListProjects, adminListTestimonials } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { isPlaceholder } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    const [enquiries, projects, testimonials] = await Promise.all([
      adminListEnquiries(),
      adminListProjects(),
      adminListTestimonials(),
    ]);
    return { enquiries, projects, testimonials };
  },
  head: () => adminSeo("Dashboard"),
  component: Dashboard,
});

function Dashboard() {
  const { enquiries, projects, testimonials } = Route.useLoaderData();
  const fresh = enquiries.filter((e) => e.status === "New");
  const placeholders = projects.filter((p) => isPlaceholder(p.src) && !p.hidden).length;
  const liveTestimonials = testimonials.filter((t) => !t.hidden).length;

  return (
    <AdminShell
      title="Dashboard"
      description="Everything here shows on the website the moment you save. No redeploy needed."
    >
      <div className="admin-stats">
        <Link to="/admin/enquiries" className="admin-stat">
          <Inbox aria-hidden="true" />
          <strong>{fresh.length}</strong>
          <span>New build enquiries ({enquiries.length} in total)</span>
        </Link>
        <Link to="/admin/projects" className="admin-stat">
          <Images aria-hidden="true" />
          <strong>{projects.filter((p) => !p.hidden).length}</strong>
          <span>
            Project photos on the website
            {placeholders > 0 && ` (${placeholders} still placeholders)`}
          </span>
        </Link>
        <Link to="/admin/testimonials" className="admin-stat">
          <MessageSquareQuote aria-hidden="true" />
          <strong>{liveTestimonials}</strong>
          <span>
            Testimonials on the website
            {liveTestimonials === 0 && " (placeholders showing)"}
          </span>
        </Link>
      </div>

      <div className="admin-two-col">
        <AdminCard
          title="Latest enquiries"
          actions={
            <Link to="/admin/enquiries" className="admin-btn">
              All enquiries
            </Link>
          }
        >
          {enquiries.length === 0 ? (
            <p className="admin-muted">
              No enquiries yet. They appear here when someone sends the form.
            </p>
          ) : (
            <ul className="admin-list">
              {enquiries.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <div className="admin-list-text">
                    <strong>{e.name}</strong>
                    <small>
                      {e.country} · {e.buildType} · {e.budget}
                    </small>
                  </div>
                  <span className="admin-pill" data-status={e.status}>
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Quick actions">
          <div className="admin-quick">
            <Link
              to="/admin/projects/$id"
              params={{ id: "new" }}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={17} aria-hidden="true" /> Add a project photo
            </Link>
            <Link to="/admin/testimonials" className="admin-btn">
              Add a client testimonial
            </Link>
            <Link to="/admin/settings" className="admin-btn">
              <Settings size={17} aria-hidden="true" /> Contacts, founder, stats & The Burbs
            </Link>
            <a href="/#projects" target="_blank" rel="noreferrer" className="admin-btn">
              View the Projects section
            </a>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
