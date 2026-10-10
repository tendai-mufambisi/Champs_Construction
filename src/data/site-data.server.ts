import { getDb, getMedia } from "./bindings.server";
import {
  FALLBACK_SITE_DATA,
  stages,
  type BurbsSettings,
  type ContactSettings,
  type FounderSettings,
  type PhotoData,
  type ProjectRecord,
  type SiteData,
  type Stage,
  type StatsSettings,
  type TestimonialRecord,
} from "./site-data";

/* ---------- rows ---------- */

export type ProjectRow = {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  stage: string;
  hidden: number;
};

export const PROJECT_COLUMNS = `id, src, width, height, alt, caption, stage, hidden`;

export function toProject(row: ProjectRow): ProjectRecord {
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

export function burbsFrom(settings: Map<string, string>): BurbsSettings {
  const fallback = FALLBACK_SITE_DATA.burbs;
  return {
    location: settings.get("burbs_location") || fallback.location,
    standSize: settings.get("burbs_stand_size") || fallback.standSize,
    cashPlan: settings.get("burbs_cash_plan") || fallback.cashPlan,
    termsPlan: settings.get("burbs_terms_plan") || fallback.termsPlan,
    noDeposit: settings.get("burbs_no_deposit") === "1",
    legalStatus: settings.get("burbs_legal_status") || fallback.legalStatus,
  };
}

/* ---------- public read ---------- */

export async function loadSiteData(): Promise<SiteData> {
  const db = getDb();
  const [projects, testimonials, settings] = await Promise.all([
    db
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE hidden = 0 ORDER BY position, id`)
      .all<ProjectRow>(),
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
    burbs: burbsFrom(settings),
    projects: projects.results.map(toProject),
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
