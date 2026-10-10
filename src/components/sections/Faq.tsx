import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { faqs } from "@/lib/site-data";

export function Faq() {
  return (
    <section id="faq" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions clients ask us first"
          subtitle="What diaspora and local clients want to know before they start building."
        />

        <Reveal delay={100}>
          <div className="mx-auto mt-14 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  className="overflow-hidden rounded-2xl border border-border bg-surface px-5 transition-colors data-[state=open]:border-accent-gold data-[state=open]:bg-white"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-brand-ink hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
