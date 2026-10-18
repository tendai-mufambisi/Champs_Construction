import { Download } from "lucide-react";

import { useSiteData } from "@/components/site/use-site-data";
import { cn } from "@/lib/utils";

/**
 * Download the company profile PDF.
 *
 * Renders nothing while no PDF has been uploaded, so the button never links to
 * a 404. Upload one from the dashboard and it appears everywhere at once.
 */
export function CompanyProfileButton({
  className,
  tone = "accent",
  label = "Download Company Profile",
}: {
  className?: string;
  tone?: "accent" | "outline" | "outline-dark";
  label?: string;
}) {
  const { toggles } = useSiteData();
  const href = toggles.companyProfilePdf;
  if (!href) return null;

  const tones = {
    accent: "bg-accent-gradient text-brand-ink shadow-accent hover:-translate-y-0.5",
    outline: "border border-border bg-white text-brand-ink shadow-soft hover:-translate-y-0.5",
    "outline-dark": "border border-white/25 text-white hover:border-accent-gold hover:text-accent-gold",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300",
        tones[tone],
        className,
      )}
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
