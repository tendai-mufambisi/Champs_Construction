import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useSiteData } from "@/components/site/use-site-data";
import type { TeamMember } from "@/data/site-data";

/**
 * Meet the team.
 *
 * The slots ship empty on purpose: the owner fills in names, roles and photos
 * from the dashboard. An unfilled slot shows a silhouette and a quiet "joining
 * soon" rather than a fake name, so the section is presentable from day one and
 * obviously incomplete to the person who has to finish it.
 */
export function Team({ compact = false }: { compact?: boolean }) {
  const { team, toggles } = useSiteData();
  if (!toggles.teamEnabled || team.length === 0) return null;

  const named = team.filter((m) => m.name.trim());

  return (
    <section id="team" className="relative bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Team"
          title="The people who build your house"
          subtitle={
            named.length > 0
              ? "You are not handing your build to a faceless company. These are the people accountable for it, from the first quotation to the day you get the keys."
              : "The people accountable for your build, from the first quotation to the day you get the keys."
          }
        />

        <div
          className={`mx-auto mt-14 grid gap-8 ${
            team.length <= 3 ? "max-w-5xl sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 90}>
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>

        {compact ? (
          <Reveal delay={160} className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-brand-ink shadow-soft transition-transform duration-300 hover:-translate-y-0.5"
            >
              More about Champs
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const hasName = Boolean(member.name.trim());

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.photoAlt || member.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <UserRound className="h-20 w-20 text-muted-foreground/25" aria-hidden />
          </div>
        )}
      </div>

      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-brand-ink">
          {hasName ? member.name : "Joining soon"}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand">
          {member.role.trim() || "Champs Construction"}
        </p>
        {member.bio.trim() ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
        ) : null}
      </div>
    </article>
  );
}
