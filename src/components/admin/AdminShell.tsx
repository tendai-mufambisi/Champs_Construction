import { Link, useRouter } from "@tanstack/react-router";
import {
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

import logo from "@/assets/champs-logo.svg";
import { logout } from "@/data/auth";
import type { ProjectRecord } from "@/data/site-data";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, exact: false },
  { to: "/admin/projects", label: "Projects", icon: Images, exact: false },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function AdminLogo() {
  return (
    <span className="admin-logo">
      <img
        src={logo}
        alt="Champs Construction"
        width={734}
        height={206}
        style={{ width: 150, height: "auto" }}
      />
    </span>
  );
}

export function ProjectThumb({
  project,
  className = "admin-thumb",
}: {
  project: ProjectRecord;
  className?: string;
}) {
  return <img className={className} src={project.src} alt="" loading="lazy" decoding="async" />;
}

export function AdminCard({
  title,
  description,
  actions,
  children,
}: {
  title?: string;
  description?: string | undefined;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-card">
      {(title || actions) && (
        <header className="admin-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="admin-actions">{actions}</div>}
        </header>
      )}
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();

  async function signOut() {
    await logout();
    await router.navigate({ to: "/admin/login" });
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-side-head">
          <Link to="/admin">
            <AdminLogo />
          </Link>
          <p className="admin-label">Owner dashboard</p>
        </div>
        <nav className="admin-nav" aria-label="Dashboard">
          {nav.map(({ to, label, icon: Icon, exact }) => (
            <Link key={to} to={to} activeOptions={{ exact }} className="admin-nav-link">
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link">
            <ExternalLink size={17} aria-hidden="true" />
            View website
          </a>
          <button type="button" onClick={signOut} className="admin-nav-link">
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-page-head">
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="admin-actions">{actions}</div>}
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
