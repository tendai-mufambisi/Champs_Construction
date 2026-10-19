import {
  CalendarClock,
  FileCheck2,
  HandCoins,
  MapPin,
  MessageCircle,
  Ruler,
  Users,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useContact, useSiteData } from "@/components/site/use-site-data";
import type { DevelopmentSettings } from "@/data/site-data";
import {
  developmentEnquiryText,
  developmentInfo,
  developmentKeys,
  type DevelopmentKey,
} from "@/lib/site-data";

/*
 * Residential stands for sale. Pricing and legal status are owner-editable (/admin/settings).
 * The legal status must always be shown in full and in plain sight, never as fine print.
 */
export function Stands() {
  const { developments, toggles } = useSiteData();
  const contact = useContact();

  // Stands are a land offering rather than core construction work, so the owner can
  // switch each development off from the dashboard without losing its details.
  const enabled: Record<DevelopmentKey, boolean> = {
    burbs: toggles.burbsEnabled,
    mcm: toggles.mcmEnabled,
  };
  const shown = developmentKeys.filter((key) => enabled[key]);
  if (shown.length === 0) return null;

  return (
    <section id="stands" className="relative overflow-hidden bg-brand-ink py-24 lg:py-32">
      <div aria-hidden className="diagonal-band absolute inset-0 opacity-15" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-accent-gold/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              Residential Stands
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-white sm:text-4xl lg:text-5xl">
              Own your stand, <span className="text-accent-gold">then build with Champs</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 leading-relaxed text-white/75">
              Stands in gated residential communities, with cash, deposit and monthly payment plans
              to suit your budget.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <a
              href={contact.community}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-white hover:text-brand-ink"
            >
              <Users className="h-4 w-4" />
              Join the Champs WhatsApp Community
            </a>
          </Reveal>
        </div>

        <div
          className={`mt-14 grid items-start gap-8 ${shown.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"}`}
        >
          {shown.map((key, i) => (
            <Reveal key={key} delay={120 + i * 80}>
              <DevelopmentCard
                id={key}
                details={developments[key]}
                enquireLink={contact.whatsappLink(developmentEnquiryText(key))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DevelopmentCard({
  id,
  details,
  enquireLink,
}: {
  id: DevelopmentKey;
  details: DevelopmentSettings;
  enquireLink: string;
}) {
  const info = developmentInfo[id];
  const rows = [
    { icon: MapPin, label: "Location", value: details.location },
    { icon: Ruler, label: "Stand size", value: details.standSize },
    { icon: Wallet, label: "Cash plan", value: details.cashPlan },
    { icon: HandCoins, label: "Deposit plan", value: details.depositPlan },
    { icon: CalendarClock, label: "Monthly plan", value: details.termsPlan },
  ].filter((row) => row.value);

  return (
    <article id={`stands-${id}`} className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-accent-gradient px-7 py-5">
          <h3 className="font-display text-xl font-bold text-brand-ink">
            {info.name}, {info.town}
          </h3>
          <span className="rounded-full bg-brand-ink px-3 py-1 text-[11px] font-bold tracking-wider text-accent-gold uppercase">
            {info.badge}
          </span>
        </div>
        <dl className="divide-y divide-border">
          {rows.map((d) => (
            <div key={d.label} className="flex items-start gap-4 px-7 py-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-brand-ink">
                <d.icon className="h-5 w-5" />
              </span>
              <div>
                <dt className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                  {d.label}
                </dt>
                <dd className="mt-1 font-semibold text-brand-ink">{d.value}</dd>
              </div>
            </div>
          ))}
          {details.noDeposit ? (
            <div className="px-7 py-5">
              <p className="font-display text-lg font-bold text-brand-ink">
                No deposit · No interest
              </p>
            </div>
          ) : null}
        </dl>
        <div className="border-t border-border bg-surface px-7 py-5">
          <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
            {info.noteTitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-brand-ink">{info.note}</p>
          <a
            href={enquireLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-1"
          >
            <MessageCircle className="h-4 w-4" />
            Reserve / Enquire on WhatsApp
          </a>
        </div>
      </div>

      <div
        role="note"
        aria-label={`Legal status of ${info.name}`}
        className="rounded-[2rem] border-2 border-accent-gold bg-brand-ink p-7"
      >
        <div className="flex items-center gap-3">
          <FileCheck2 className="h-6 w-6 shrink-0 text-accent-gold" />
          <p className="font-display text-lg font-bold text-white">Legal status</p>
        </div>
        <p className="mt-3 leading-relaxed text-white/90">{details.legalStatus}</p>
      </div>
    </article>
  );
}
