import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";

import { getDb } from "./bindings.server";
import { enquirySchema, type EnquiryInput } from "./enquiry";
import { FALLBACK_SITE_DATA, type ProjectImage, type ProjectRecord, type SiteData } from "./site-data";
import { loadSiteData, PROJECT_COLUMNS, toProject, type ProjectRow } from "./site-data.server";

/**
 * Everything owner-editable that the public pages show, read once by the root loader.
 * If D1 is unreachable (or not configured, as in `vite dev`) the site renders the
 * content it shipped with and never breaks.
 */
export const getSiteData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteData> => {
    try {
      return await loadSiteData();
    } catch (error) {
      console.error("Site data unavailable, using the shipped content:", error);
      return FALLBACK_SITE_DATA;
    }
  },
);

export type ProjectDetail = { project: ProjectRecord; images: ProjectImage[] };

/**
 * One project and its gallery, for /projects/<slug>.
 *
 * Unpublished projects are not reachable here: without the published filter a
 * half-written draft would be live to anyone who guessed the URL.
 */
export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<ProjectDetail | null> => {
    try {
      const db = getDb();
      const row = await db
        .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ? AND published = 1`)
        .bind(slug)
        .first<ProjectRow>();
      if (!row) return null;

      const { results } = await db
        .prepare(`SELECT id, url, alt FROM project_images WHERE project_id = ? ORDER BY position, id`)
        .bind(row.id)
        .all<ProjectImage>();

      return { project: toProject(row), images: results };
    } catch (error) {
      console.error("Could not load the project:", error);
      return null;
    }
  });

// Enough for a family filling the form in for several people; stops scripted floods.
const MAX_ENQUIRIES_PER_HOUR = 6;

/**
 * Save a build enquiry so the owner sees it in the dashboard even if the visitor never
 * presses send in WhatsApp. The form opens WhatsApp itself; this never blocks that.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: EnquiryInput) => input)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
    }
    const e = parsed.data;
    const request = getRequest();
    const ip =
      request.headers.get("cf-connecting-ip") ?? getRequestIP({ xForwardedFor: true }) ?? "unknown";

    try {
      const db = getDb();
      const recent = await db
        .prepare(
          `SELECT COUNT(*) AS n FROM enquiries WHERE ip = ? AND created_at > datetime('now', '-1 hour')`,
        )
        .bind(ip)
        .first<{ n: number }>();
      if ((recent?.n ?? 0) >= MAX_ENQUIRIES_PER_HOUR) {
        return { ok: false, error: "Too many enquiries from this connection. Please try later." };
      }
      await db
        .prepare(
          `INSERT INTO enquiries (name, country, whatsapp, owns_stand, stand_location, build_type, budget, start_when, message, ip)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          e.name,
          e.country,
          e.whatsapp,
          e.ownsStand,
          e.standLocation,
          e.buildType,
          e.budget,
          e.startWhen,
          e.message,
          ip,
        )
        .run();
      return { ok: true };
    } catch (error) {
      console.error("Could not save enquiry:", error);
      return { ok: false, error: "Saved on WhatsApp only." };
    }
  });
