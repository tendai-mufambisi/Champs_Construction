import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/champs-logo.svg";
import { company, navLinks as links } from "@/lib/site-data";
import { useContact } from "./use-site-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const contact = useContact();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-border/70 bg-white/90 shadow-soft backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            to="/"
            hash="home"
            className="flex items-center gap-3"
            aria-label="Champs Construction home"
          >
            <span
              className={`grid place-items-center overflow-hidden rounded-xl transition-shadow duration-500 ${
                scrolled ? "shadow-none" : "shadow-soft ring-1 ring-white/20"
              }`}
            >
              <img
                src={logo}
                alt={company.name}
                width={734}
                height={206}
                className="h-11 w-auto sm:h-12"
              />
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.hash}
                to="/"
                hash={l.hash}
                className={`relative rounded-full px-3 py-2 text-sm font-semibold transition-colors after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-accent-gradient after:transition-all after:duration-300 hover:after:w-6 ${
                  scrolled ? "text-brand-ink hover:text-brand" : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={contact.phoneHref}
              className={`hidden items-center gap-2 text-sm font-semibold transition-colors 2xl:flex ${
                scrolled ? "text-brand-ink hover:text-brand" : "text-white/85 hover:text-white"
              }`}
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
            <Link
              to="/"
              hash="enquiry"
              className="hidden rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
            >
              Start My Build
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className={`rounded-xl border p-2.5 transition xl:hidden ${
                scrolled ? "border-border text-brand-ink" : "border-white/30 text-white"
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] xl:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-brand-ink/70 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-6 transition-transform duration-500 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt={company.name}
              width={734}
              height={206}
              className="h-11 w-auto rounded-lg"
            />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border p-2.5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.hash}
                to="/"
                hash={l.hash}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 py-4 text-lg font-semibold text-brand-ink transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/"
            hash="enquiry"
            onClick={() => setOpen(false)}
            className="mt-8 block rounded-full bg-accent-gradient px-6 py-3.5 text-center font-bold text-brand-ink shadow-accent"
          >
            Start My Build
          </Link>
          <a
            href={contact.phoneHref}
            className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-ink"
          >
            <Phone className="h-4 w-4" />
            {contact.phone}
          </a>
          <p className="mt-6 text-center text-xs font-bold tracking-[0.28em] text-brand uppercase">
            {company.tagline}
          </p>
        </div>
      </div>
    </>
  );
}
