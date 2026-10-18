import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";

import { company, navLinks, services } from "@/lib/site-data";
import { useContact } from "./use-site-data";

export function Footer() {
  const contact = useContact();

  return (
    <footer className="relative overflow-hidden bg-brand-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-accent-gold/15 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-10 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <img
              src={company.logo}
              alt={company.name}
              width={734}
              height={206}
              loading="lazy"
              className="h-16 w-auto rounded-2xl shadow-soft"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Harare-based residential construction for Zimbabweans at home and in the diaspora.
              From groundwork to handover, built and managed by one accountable team.
            </p>
            <p className="mt-5 font-display text-xl font-semibold text-accent-gold">
              {company.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Champs Construction on Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 transition hover:-translate-y-0.5 hover:border-accent-gold hover:bg-accent-gold hover:text-brand-ink"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={contact.whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Champs Construction on WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 transition hover:-translate-y-0.5 hover:border-accent-gold hover:bg-accent-gold hover:text-brand-ink"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-accent-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {services.map((s) => (
                <li key={s.title}>
                  <Link to="/" hash="services" className="transition-colors hover:text-accent-gold">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/labour-only" className="transition-colors hover:text-accent-gold">
                  Labour-Only Contracting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/65">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />
                <span className="space-y-1">
                  <a href={contact.phoneHref} className="block hover:text-white">
                    {contact.phone}
                  </a>
                  {contact.phone2 ? (
                    <a href={contact.phone2Href} className="block hover:text-white">
                      {contact.phone2}
                    </a>
                  ) : null}
                </span>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />
                <a
                  href={contact.whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />
                <span>{company.address}</span>
              </li>
            </ul>

            <a
              href={contact.community}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-3 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Users className="h-4 w-4" />
              Join our WhatsApp Community
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>
            {/* The © is the owner's way into the dashboard; it reads as plain text. */}
            <Link to="/admin/login" aria-label="Owner sign in" className="text-inherit">
              ©
            </Link>{" "}
            2026 {company.name}. All rights reserved.
          </p>
          <p>{company.website}</p>
        </div>

        <div className="mt-8 text-center text-sm tracking-wide">
          <p className="text-white/55">
            Website by{" "}
            <a
              href="https://wa.me/263776611049"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-500 transition-colors hover:text-orange-400"
            >
              Digits Digital
            </a>
          </p>
          <a
            href="https://www.digitsdigital.co.zw"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-white/45 transition-colors hover:text-white"
          >
            www.digitsdigital.co.zw
          </a>
        </div>
      </div>
    </footer>
  );
}
