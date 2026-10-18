import {
  CalendarClock,
  FileCheck2,
  MapPin,
  MessageCircle,
  Ruler,
  Users,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useContact, useSiteData } from "@/components/site/use-site-data";
import { burbsEnquiryText } from "@/lib/site-data";

/*
 * Featured development. Pricing and legal status are owner-editable (/admin/settings).
 * The legal status must always be shown in full and in plain sight, never as fine print.
 */
export function Burbs() {
  const { burbs, toggles } = useSiteData();
  const contact = useContact();

  // The Burbs is a land offering rather than core construction work, so the
  // owner can switch the whole section off from the dashboard without losing
  // the details already captured.
  if (!toggles.burbsEnabled) return null;

  const details = [
    { icon: MapPin, label: "Location", value: burbs.location },
    { icon: Ruler, label: "Stand size", value: burbs.standSize },
    { icon: Wallet, label: "Cash plan", value: burbs.cashPlan },
    { icon: CalendarClock, label: "Terms plan", value: burbs.termsPlan },
  ];

  return (
    <section id="the-burbs" className="relative overflow-hidden bg-brand-ink py-24 lg:py-32">
      <div aria-hidden className="diagonal-band absolute inset-0 opacity-15" />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-accent-gold/10 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-5 lg:grid-cols-[0.95fr_1.2fr] lg:px-8">
        <div>
          <Reveal>
            <span className="eyebrow text-accent-gold">
              <span className="h-[3px] w-8 rounded-full bg-current" aria-hidden />
              Featured Development
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-white sm:text-4xl lg:text-5xl">
              New Residential Opportunity —{" "}
              <span className="text-accent-gold">The Burbs, Chivhu</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 leading-relaxed text-white/75">
              A new modern gated residential community {burbs.location.charAt(0).toLowerCase()}
              {burbs.location.slice(1)}, with early-stage entry pricing before major civil works
              begin.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-bold tracking-[0.16em] text-accent-gold uppercase">
                Why buy now
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Pre-development pricing locks in a lower entry price ahead of expected increases
                once pegging, council approvals and roads are complete.
              </p>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={contact.whatsappLink(burbsEnquiryText)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-4 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-1"
              >
                <MessageCircle className="h-4 w-4" />
                Reserve / Enquire on WhatsApp
              </a>
              <a
                href={contact.community}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white transition-colors duration-300 hover:bg-white hover:text-brand-ink"
              >
                <Users className="h-4 w-4" />
                Join the Champs WhatsApp Community
              </a>
            </div>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-lift">
              <div className="flex items-center justify-between bg-accent-gradient px-7 py-5">
                <p className="font-display text-xl font-bold text-brand-ink">The Burbs, Chivhu</p>
                <span className="rounded-full bg-brand-ink px-3 py-1 text-[11px] font-bold tracking-wider text-accent-gold uppercase">
                  Pre-development pricing
                </span>
              </div>
              <dl className="divide-y divide-border">
                {details.map((d) => (
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
                {burbs.noDeposit ? (
                  <div className="px-7 py-5">
                    <p className="font-display text-lg font-bold text-brand-ink">
                      No deposit · No interest
                    </p>
                  </div>
                ) : null}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div
              role="note"
              aria-label="Legal status of The Burbs"
              className="rounded-[2rem] border-2 border-accent-gold bg-brand-ink p-7"
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-6 w-6 shrink-0 text-accent-gold" />
                <p className="font-display text-lg font-bold text-white">Legal status</p>
              </div>
              <p className="mt-3 leading-relaxed text-white/90">{burbs.legalStatus}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
