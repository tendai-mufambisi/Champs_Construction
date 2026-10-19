import { developmentKeys } from "@/lib/site-data";
import { getDb, getMedia } from "./bindings.server";
import {
  FALLBACK_SITE_DATA,
  stages,
  type ContactSettings,
  type DevelopmentsSettings,
  type FounderSettings,
  type PhotoData,
  type ProjectRecord,
  type ProjectImage,
  type SiteToggles,
  type TeamMember,
  type WorkPhotoRecord,
  type SiteData,
  type Stage,
  type StatsSettings,
  type TestimonialRecord,
} from "./site-data";

/* ---------- rows ---------- */

export type WorkPhotoRow = {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  stage: string;
  hidden: number;
};

export const WORK_PHOTO_COLUMNS = `id, src, width, height, alt, caption, stage, hidden`;

export function toWorkPhoto(row: WorkPhotoRow): WorkPhotoRecord {
  return {
    id: row.id,
    src: row.src,
    width: row.width,
    height: row.height,
    alt: row.alt,
    caption: row.caption,
    stage: (stages as readonly string[]).includes(row.stage) ? (row.stage as Stage) : "During",
    hidden: row.hidden === 1,
  };
}

export type TestimonialRow = {
  id: number;
  name: string;
  role: string;
  quote: string;
  hidden: number;
};

export const TESTIMONIAL_COLUMNS = `id, name, role, quote, hidden`;

export function toTestimonial(row: TestimonialRow): TestimonialRecord {
  return { ...row, hidden: row.hidden === 1 };
}

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  status: string;
  summary: string;
  body: string;
  scope: string;
  cover: string | null;
  cover_alt: string;
  featured: number;
  published: number;
};

export const PROJECT_COLUMNS = `id, slug, title, category, location, year, status, summary,
  body, scope, cover, cover_alt, featured, published`;

/** The scope textarea stores one item per line; the site wants an array. */
export const toLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export function toProject(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location,
    year: row.year,
    status: row.status,
    summary: row.summary,
    body: row.body,
    scope: toLines(row.scope),
    cover: row.cover,
    coverAlt: row.cover_alt || row.title,
    featured: row.featured === 1,
    published: row.published === 1,
  };
}

export type TeamRow = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  photo_alt: string;
  hidden: number;
};

export const TEAM_COLUMNS = `id, name, role, bio, photo, photo_alt, hidden`;

export function toTeamMember(row: TeamRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photo: row.photo,
    photoAlt: row.photo_alt || row.name,
    hidden: row.hidden === 1,
  };
}

export type { ProjectImage };

/* ---------- settings ---------- */

export async function readSettings(): Promise<Map<string, string>> {
  const { results } = await getDb()
    .prepare(`SELECT key, value FROM settings WHERE key <> 'admin_password_hash'`)
    .all<{ key: string; value: string }>();
  return new Map(results.map((row) => [row.key, row.value]));
}

export async function writeSettings(entries: [string, string][]): Promise<void> {
  const db = getDb();
  await db.batch(
    entries.map(([key, value]) =>
      db
        .prepare(
          `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        )
        .bind(key, value),
    ),
  );
}

/** Empty settings mean "not configured": keep the fallback for that field. */
export function contactFrom(settings: Map<string, string>): ContactSettings {
  const fallback = FALLBACK_SITE_DATA.contact;
  return {
    phone: settings.get("phone") || fallback.phone,
    phone2: settings.get("phone2") ?? fallback.phone2,
    whatsapp: settings.get("whatsapp") || fallback.whatsapp,
    email: settings.get("email") || fallback.email,
    facebook: settings.get("facebook") || fallback.facebook,
    community: settings.get("community") || fallback.community,
  };
}

export function founderFrom(settings: Map<string, string>): FounderSettings {
  let photo: PhotoData | null = null;
  try {
    const parsed = JSON.parse(settings.get("founder_photo") || "null") as PhotoData | null;
    if (parsed?.src) photo = parsed;
  } catch {
    // A malformed value falls back to the placeholder shipped with the site.
  }
  const fallback = FALLBACK_SITE_DATA.founder;
  return {
    name: settings.get("founder_name") || fallback.name,
    quote: settings.get("founder_quote") || fallback.quote,
    photo,
  };
}

export function statsFrom(settings: Map<string, string>): StatsSettings {
  return {
    homes: settings.get("stat_homes") ?? "",
    diaspora: settings.get("stat_diaspora") ?? "",
    years: settings.get("stat_years") ?? "",
  };
}

/** Settings keys are prefixed with the development, e.g. burbs_cash_plan, mcm_cash_plan. */
export function developmentsFrom(settings: Map<string, string>): DevelopmentsSettings {
  const result = {} as DevelopmentsSettings;
  for (const key of developmentKeys) {
    const fallback = FALLBACK_SITE_DATA.developments[key];
    const get = (name: string) => settings.get(`${key}_${name}`);
    result[key] = {
      location: get("location") || fallback.location,
      standSize: get("stand_size") || fallback.standSize,
      cashPlan: get("cash_plan") ?? fallback.cashPlan,
      // The plans may be cleared on purpose to take one off the site.
      depositPlan: get("deposit_plan") ?? fallback.depositPlan,
      termsPlan: get("terms_plan") ?? fallback.termsPlan,
      noDeposit: get("no_deposit") === "1",
      legalStatus: get("legal_status") || fallback.legalStatus,
    };
  }
  return result;
}

/** A missing toggle defaults to on, so a fresh database shows the full site. */
export function togglesFrom(settings: Map<string, string>): SiteToggles {
  return {
    burbsEnabled: (settings.get("burbs_enabled") ?? "1") === "1",
    mcmEnabled: (settings.get("mcm_enabled") ?? "1") === "1",
    teamEnabled: (settings.get("team_enabled") ?? "1") === "1",
    // The exception: testimonials stay hidden until the owner switches them on.
    testimonialsEnabled: settings.get("testimonials_enabled") === "1",
    companyProfilePdf: settings.get("company_profile_pdf") ?? "",
  };
}

/* ---------- public read ---------- */

export async function loadSiteData(): Promise<SiteData> {
  const db = getDb();
  const [workPhotos, projects, team, testimonials, settings] = await Promise.all([
    db
      .prepare(`SELECT ${WORK_PHOTO_COLUMNS} FROM work_photos WHERE hidden = 0 ORDER BY position, id`)
      .all<WorkPhotoRow>(),
    db
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE published = 1 ORDER BY position, id`)
      .all<ProjectRow>(),
    db
      .prepare(`SELECT ${TEAM_COLUMNS} FROM team WHERE hidden = 0 ORDER BY position, id`)
      .all<TeamRow>(),
    db
      .prepare(
        `SELECT ${TESTIMONIAL_COLUMNS} FROM testimonials WHERE hidden = 0 ORDER BY position, id`,
      )
      .all<TestimonialRow>(),
    readSettings(),
  ]);
  return {
    contact: contactFrom(settings),
    founder: founderFrom(settings),
    stats: statsFrom(settings),
    developments: developmentsFrom(settings),
    workPhotos: workPhotos.results.map(toWorkPhoto),
    projects: projects.results.map(toProject),
    team: team.results.map(toTeamMember),
    toggles: togglesFrom(settings),
    testimonials: testimonials.results.map(toTestimonial),
    live: true,
  };
}

/** Only R2-hosted uploads are deletable; `/images/*` files ship with the build. */
export async function deleteMediaObjects(urls: string[]): Promise<void> {
  const keys = urls
    .filter((url) => url.startsWith("/media/"))
    .map((url) => decodeURIComponent(url.slice("/media/".length)));
  if (keys.length === 0) return;

  const media = getMedia();
  await Promise.all(
    keys.map((key) =>
      media.delete(key).catch(() => {
        // A missing object is the desired end state anyway.
      }),
    ),
  );
}
