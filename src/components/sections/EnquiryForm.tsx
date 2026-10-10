import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useContact } from "@/components/site/use-site-data";
import {
  budgets,
  buildTypes,
  countries,
  enquiryMessage,
  enquirySchema,
  standOptions,
  startOptions,
} from "@/data/enquiry";
import { submitEnquiry } from "@/data/public-data";

const field =
  "w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-brand-ink transition-colors placeholder:text-muted-foreground/70 focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-accent-gold/60";
const labelCls = "text-xs font-bold tracking-[0.14em] text-brand-ink uppercase";

function Select({
  id,
  label,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={id}>
        {label} *
      </label>
      <select id={id} name={id} required defaultValue="" className={`mt-2 ${field}`}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/*
 * On submit: open WhatsApp to Champs with every answer pre-filled, and save the
 * enquiry to the dashboard in parallel. WhatsApp opens first, inside the click, so
 * phones and pop-up blockers allow it; saving never delays or blocks it.
 */
export function EnquiryForm() {
  const contact = useContact();
  const [sentLink, setSentLink] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = enquirySchema.safeParse(Object.fromEntries(new FormData(form).entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
      return;
    }

    const link = contact.whatsappLink(enquiryMessage(parsed.data));
    window.open(link, "_blank", "noopener");
    void submitEnquiry({ data: parsed.data }).catch(() => {
      // The visitor's WhatsApp message is the primary channel; nothing to show here.
    });

    form.reset();
    setSentLink(link);
  };

  return (
    <section id="enquiry" className="relative overflow-hidden bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Build Enquiry"
          title="Start your build today"
          subtitle="Answer a few quick questions. When you press send, WhatsApp opens with your answers ready, so the Champs team can come back to you with the right information."
        />

        <Reveal delay={100}>
          {sentLink ? (
            <div
              role="status"
              className="mx-auto mt-14 max-w-2xl rounded-[2rem] border border-border bg-white p-10 text-center shadow-lift"
            >
              <CheckCircle2 className="mx-auto h-14 w-14 text-[#25D366]" />
              <p className="mt-5 font-display text-2xl font-semibold text-brand-ink">
                Thank you — the Champs team will contact you on WhatsApp shortly.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                If WhatsApp didn't open, tap the button below and press send.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href={sentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Open WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setSentLink(null)}
                  className="rounded-full border border-border px-6 py-3.5 text-sm font-bold text-brand-ink transition hover:border-brand-ink"
                >
                  Send another enquiry
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="mx-auto mt-14 max-w-4xl rounded-[2rem] border border-border bg-white p-7 shadow-lift sm:p-10"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Your full name"
                    className={`mt-2 ${field}`}
                  />
                </div>
                <Select
                  id="country"
                  label="Country You Live In"
                  options={countries}
                  placeholder="Select your country"
                />
                <div>
                  <label className={labelCls} htmlFor="whatsapp">
                    WhatsApp Number *
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    required
                    maxLength={25}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="With country code, e.g. +44 7700 900123"
                    className={`mt-2 ${field}`}
                  />
                </div>
                <Select
                  id="ownsStand"
                  label="Do You Already Own A Stand?"
                  options={standOptions}
                  placeholder="Select an answer"
                />
                <div>
                  <label className={labelCls} htmlFor="standLocation">
                    Stand Location
                  </label>
                  <input
                    id="standLocation"
                    name="standLocation"
                    maxLength={120}
                    placeholder="Town / suburb"
                    className={`mt-2 ${field}`}
                  />
                </div>
                <Select
                  id="buildType"
                  label="Type Of Build"
                  options={buildTypes}
                  placeholder="Select a type of build"
                />
                <Select
                  id="budget"
                  label="Estimated Budget"
                  options={budgets}
                  placeholder="Select a budget range"
                />
                <Select
                  id="startWhen"
                  label="When Do You Want To Start?"
                  options={startOptions}
                  placeholder="Select a timeframe"
                />
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={1500}
                    placeholder="Tell us about your plans: number of rooms, house plans, anything we should know…"
                    className={`mt-2 ${field} resize-none`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent-gradient px-8 py-4.5 text-sm font-bold text-brand-ink shadow-accent transition-transform duration-300 hover:-translate-y-1 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Send My Enquiry on WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Your details are only used to reply to your enquiry and are never shared.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
