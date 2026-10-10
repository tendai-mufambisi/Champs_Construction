import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <Reveal>
        <span className={cn("eyebrow", tone === "dark" ? "text-accent-gold" : "text-brand")}>
          {/* Yellow on white is unreadable, so on light sections only the bar is yellow. */}
          <span className="h-[3px] w-8 rounded-full bg-accent-gold" aria-hidden />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={80}>
        <h2
          className={cn(
            "mt-4 text-3xl leading-[1.1] font-semibold sm:text-4xl lg:text-5xl",
            tone === "dark" ? "text-white" : "text-brand-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={160}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
