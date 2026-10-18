/**
 * Dashboard CRUD for project pages.
 *
 * Kept apart from admin.ts, which already covers the Before/During/After photo
 * strip, testimonials, enquiries and settings. "Projects" here means a page at
 * /projects/<slug>; the photo strip is `work_photos`.
 */
import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "./auth.server";
import { getDb, getMedia } from "./bindings.server";
import { type ProjectImage, type ProjectRecord } from "./site-data";
import {
  deleteMediaObjects,
  PROJECT_COLUMNS,
  toProject,
  type ProjectRow,
} from "./site-data.server";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const positiveId = (value: unknown) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("A valid project is required.");
  return id;
};

const text = (value: string, max: number) => value.trim().slice(0, max);

/** The dashboard resizes photos in the browser before sending them. */
function readImage(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Please choose a photo.");

  const extension = IMAGE_TYPES.get(file.type);
  if (!extension) throw new Error("That file type is not supported. Use JPG, PNG, WebP or AVIF.");
  if (file.size === 0) throw new Error("That file appears to be empty.");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("That image is larger than 10 MB. Please resize it and try again.");
  }
  return { file, extension };
}

async function putImage(folder: string, image: { file: File; extension: string }) {
  const key = `${folder}/${crypto.randomUUID()}.${image.extension}`;
  await getMedia().put(key, await image.file.arrayBuffer(), {
    httpMetadata: { contentType: image.file.type },
  });
  // The key embeds a UUID, so the URL is immutable and safe to cache forever.
  return `/media/${key}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Appends -2, -3 … until the slug is free, ignoring the row being edited. */
async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  const db = getDb();
  const root = base || "project";
  let candidate = root;
  let n = 1;
  for (;;) {
    const clash = await db
      .prepare(`SELECT id FROM projects WHERE slug = ? AND id IS NOT ?`)
      .bind(candidate, ignoreId ?? null)
      .first<{ id: number }>();
    if (!clash) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

/** New projects go to the top of the list, where the owner will look for them. */
async function topPosition(): Promise<number> {
  const top = await getDb()
    .prepare(`SELECT COALESCE(MIN(position), 1) - 1 AS pos FROM projects`)
    .first<{ pos: number }>();
  return top?.pos ?? 0;
}

/* ---------- read ---------- */

/** Admin lists are unfiltered — the owner must see drafts as well as live pages. */
export const adminListProjectPages = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProjectRecord[]> => {
    await requireAdmin();
    const { results } = await getDb()
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY position, id`)
      .all<ProjectRow>();
    return results.map(toProject);
  },
);

export type ProjectPageDetail = { project: ProjectRecord; images: ProjectImage[] };

export const adminGetProjectPage = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }): Promise<ProjectPageDetail | null> => {
    await requireAdmin();
    const db = getDb();
    const row = await db
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ?`)
      .bind(positiveId(id))
      .first<ProjectRow>();
    if (!row) return null;

    const { results } = await db
      .prepare(`SELECT id, url, alt FROM project_images WHERE project_id = ? ORDER BY position, id`)
      .bind(row.id)
      .all<ProjectImage>();
    return { project: toProject(row), images: results };
  });

/* ---------- write ---------- */

export type ProjectInput = {
  id?: number;
  title: string;
  category: string;
  location: string;
  year: string;
  status: string;
  summary: string;
  body: string;
  scope: string;
  featured: boolean;
  published: boolean;
};

export const saveProjectPage = createServerFn({ method: "POST" })
  .inputValidator((input: ProjectInput) => input)
  .handler(async ({ data }): Promise<{ id: number; slug: string }> => {
    await requireAdmin();
    const db = getDb();

    const title = text(data.title, 120);
    if (!title) throw new Error("Please give the project a title.");

    const values = [
      title,
      text(data.category, 60),
      text(data.location, 120),
      text(data.year, 12),
      data.status,
      text(data.summary, 400),
      data.body.slice(0, 20_000),
      text(data.scope, 2000),
      data.featured ? 1 : 0,
      data.published ? 1 : 0,
    ];

    if (data.id) {
      const slug = await uniqueSlug(slugify(title), data.id);
      await db
        .prepare(
          `UPDATE projects
              SET title = ?, category = ?, location = ?, year = ?, status = ?, summary = ?,
                  body = ?, scope = ?, featured = ?, published = ?, slug = ?
            WHERE id = ?`,
        )
        .bind(...values, slug, data.id)
        .run();
      return { id: data.id, slug };
    }

    const slug = await uniqueSlug(slugify(title));
    const result = await db
      .prepare(
        `INSERT INTO projects
           (title, category, location, year, status, summary, body, scope, featured, published, slug, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(...values, slug, await topPosition())
      .run();
    return { id: Number(result.meta.last_row_id), slug };
  });

export const deleteProjectPage = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }): Promise<void> => {
    await requireAdmin();
    const db = getDb();
    const projectId = positiveId(id);

    // Remove the R2 objects before the rows that point at them, or the bucket
    // keeps paying for files nothing can reach.
    const { results } = await db
      .prepare(`SELECT url FROM project_images WHERE project_id = ?`)
      .bind(projectId)
      .all<{ url: string }>();
    await deleteMediaObjects(results.map((r) => r.url));

    // ON DELETE CASCADE needs foreign keys enabled per connection in D1, so the
    // children are removed explicitly.
    await db.prepare(`DELETE FROM project_images WHERE project_id = ?`).bind(projectId).run();
    await db.prepare(`DELETE FROM projects WHERE id = ?`).bind(projectId).run();
  });

export const moveProjectPage = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; direction: "up" | "down" }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const db = getDb();
    const { results } = await db
      .prepare(`SELECT id FROM projects ORDER BY position, id`)
      .all<{ id: number }>();

    const index = results.findIndex((row) => row.id === positiveId(data.id));
    const target = data.direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= results.length) return;

    const order = [...results];
    [order[index], order[target]] = [order[target]!, order[index]!];
    await db.batch(
      order.map((row, i) =>
        db.prepare(`UPDATE projects SET position = ? WHERE id = ?`).bind(i + 1, row.id),
      ),
    );
  });

/* ---------- gallery ---------- */

export const uploadProjectImage = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<{ url: string }> => {
    await requireAdmin();
    const projectId = positiveId(data.get("projectId"));
    const alt = text(String(data.get("alt") ?? ""), 300);
    const image = readImage(data);

    const db = getDb();
    const project = await db
      .prepare(`SELECT id, cover FROM projects WHERE id = ?`)
      .bind(projectId)
      .first<{ id: number; cover: string | null }>();
    if (!project) throw new Error("That project no longer exists.");

    const url = await putImage(`project-photos/${projectId}`, image);
    const next = await db
      .prepare(
        `SELECT COALESCE(MAX(position), 0) + 1 AS pos FROM project_images WHERE project_id = ?`,
      )
      .bind(projectId)
      .first<{ pos: number }>();

    await db
      .prepare(`INSERT INTO project_images (project_id, url, alt, position) VALUES (?, ?, ?, ?)`)
      .bind(projectId, url, alt, next?.pos ?? 1)
      .run();

    // The first photo becomes the cover, which is what the grid shows.
    if (!project.cover) {
      await db
        .prepare(`UPDATE projects SET cover = ?, cover_alt = ? WHERE id = ?`)
        .bind(url, alt, projectId)
        .run();
    }
    return { url };
  });

export const setProjectCover = createServerFn({ method: "POST" })
  .inputValidator((input: { projectId: number; url: string; alt: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb()
      .prepare(`UPDATE projects SET cover = ?, cover_alt = ? WHERE id = ?`)
      .bind(data.url, text(data.alt, 300), positiveId(data.projectId))
      .run();
  });

export const deleteProjectImage = createServerFn({ method: "POST" })
  .inputValidator((input: { projectId: number; imageId: number }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const db = getDb();
    const projectId = positiveId(data.projectId);
    const imageId = positiveId(data.imageId);

    const image = await db
      .prepare(`SELECT url FROM project_images WHERE id = ? AND project_id = ?`)
      .bind(imageId, projectId)
      .first<{ url: string }>();
    if (!image) return;

    await db.prepare(`DELETE FROM project_images WHERE id = ?`).bind(imageId).run();
    await deleteMediaObjects([image.url]);

    // If that was the cover, promote whatever photo is now first rather than
    // leaving the project pointing at a deleted file.
    const project = await db
      .prepare(`SELECT cover FROM projects WHERE id = ?`)
      .bind(projectId)
      .first<{ cover: string | null }>();

    if (project?.cover === image.url) {
      const replacement = await db
        .prepare(
          `SELECT url, alt FROM project_images WHERE project_id = ? ORDER BY position, id LIMIT 1`,
        )
        .bind(projectId)
        .first<{ url: string; alt: string }>();
      await db
        .prepare(`UPDATE projects SET cover = ?, cover_alt = ? WHERE id = ?`)
        .bind(replacement?.url ?? null, replacement?.alt ?? "", projectId)
        .run();
    }
  });
