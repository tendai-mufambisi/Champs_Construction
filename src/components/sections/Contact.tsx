import type { ReactNode } from "react";
import { Facebook, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useContact } from "@/components/site/use-site-data";
import { company } from "@/lib/site-data";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold tracking-[0.16em] text-white/50 uppercase">
          {label}
        </span>
        <span className="mt-1 block font-semibold">{children}</span>
      </span>
    </li>
  );
}

const chip =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition hover:-translate-y-0.5";

export function Contact() {
  const contact = useContact();
  const lines = [
    { display: contact.phone, tel: contact.phoneHref, wa: contact.whatsappLink() },
    ...(contact.phone2
      ? [{ display: contact.phone2, tel: contact.phone2Href, wa: contact.whatsapp2Link() }]
      : []),
  ];

  return (
    <section id="contact" className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Contact Us"
          title="Let's talk about your build"
          subtitle="Call or WhatsApp us from anywhere in the world, or visit our Harare office."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[2rem] bg-brand-gradient p-8 text-white shadow-lift sm:p-9 lg:p-11">
              <h3 className="font-display text-2xl font-semibold">{company.name}</h3>
              <p className="mt-2 text-sm text-white/65">{company.tagline}</p>

              <ul className="mt-9 space-y-6 text-sm">
                {lines.map((line, i) => (
                  <Row
                    key={line.display}
                    icon={<Phone className="h-5 w-5 text-accent-gold" />}
                    label={i === 0 ? "Phone / WhatsApp" : "Phone / WhatsApp (2)"}
                  >
                    <a href={line.tel} className="hover:text-accent-gold">
                      {line.display}
                    </a>
                    <span className="mt-2 flex flex-wrap gap-2">
                      <a href={line.tel} className={`${chip} bg-white/10 text-white`}>
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                      <a
                        href={line.wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${chip} bg-[#25D366] text-white`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </span>
                  </Row>
                ))}
                <Row icon={<Mail className="h-5 w-5 text-accent-gold" />} label="Email">
                  <a href={`mailto:${contact.email}`} className="break-all hover:text-accent-gold">
                    {contact.email}
                  </a>
                </Row>
                <Row icon={<MapPin className="h-5 w-5 text-accent-gold" />} label="Office">
                  {company.address}
                </Row>
                <Row icon={<Globe className="h-5 w-5 text-accent-gold" />} label="Website">
                  {company.website}
                </Row>
              </ul>

              <div className="mt-9 flex flex-wrap gap-3 border-t border-white/10 pt-7">
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-accent-gold hover:text-brand-ink"
                >
                  <Facebook className="h-4 w-4" />
                  Champs Construction
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full min-h-[24rem] overflow-hidden rounded-[2rem] border border-border shadow-soft">
              <iframe
                title="Champs Construction office: Construction House, Harare"
                src={`https://www.google.com/maps?q=${company.mapQuery}&output=embed`}
                loading="lazy"
                className="h-full min-h-[24rem] w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
