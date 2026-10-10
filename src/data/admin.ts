import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "./auth.server";
import { getDb, getMedia } from "./bindings.server";
import { enquiryStatuses, type EnquiryRecord, type EnquiryStatus } from "./enquiry";
import {
  stages,
  type BurbsSettings,
  type ContactSettings,
  type FounderSettings,
  type ProjectRecord,
  type StatsSettings,
  type TestimonialRecord,
} from "./site-data";
import {
  burbsFrom,
  contactFrom,
  deleteMediaObjects,
  founderFrom,
  PROJECT_COLUMNS,
  readSettings,
  statsFrom,
  TESTIMONIAL_COLUMNS,
  toProject,
  toTestimonial,
  writeSettings,
  type ProjectRow,
  type TestimonialRow,
} from "./site-data.server";

/* ---------- uploads ---------- */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

type UploadedImage = { file: File; extension: string; width: number; height: number };

/** The dashboard resizes photos in the browser and sends their pixel size alongside. */
function readImage(formData: FormData): UploadedImage {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Please choose a photo.");

  const extension = IMAGE_TYPES.get(file.type);
  if (!extension) {
    throw new Error("That file type is not supported. Use JPG, PNG, WebP or AVIF.");
  }
  if (file.size === 0) throw new Error("That file appears to be empty.");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("That image is larger than 10 MB. Please resize it and try again.");
  }

  const width = Number(formData.get("width"));
  const height = Number(formData.get("height"));
  const valid = (n: number) => Number.isInteger(n) && n > 0 && n <= 10_000;
  if (!valid(width) || !valid(height)) throw new Error("Could not read the photo's size.");

  return { file, extension, width, height };
}

async function putImage(folder: string, image: UploadedImage): Promise<string> {
  const key = `${folder}/${crypto.randomUUID()}.${image.extension}`;
  await getMedia().put(key, await image.file.arrayBuffer(), {
    httpMetadata: { contentType: image.file.type },
  });
  // The key embeds a UUID, so the URL is immutable and safe to cache forever.
  return `/media/${key}`;
}

/* ---------- shared helpers ---------- */

const positiveId = (value: unknown) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("A valid item is required.");
  return id;
};

/** Swap with the neighbour. Positions are renumbered so duplicates never block a move. */
async function move(table: "projects" | "testimonials", id: number, direction: "up" | "down") {
  const db = getDb();
  const { results } = await db
    .prepare(`SELECT id FROM ${table} ORDER BY position, id`)
    .all<{ id: number }>();

  const index = results.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= results.length) return;

  const order = [...results];
  [order[index], order[target]] = [order[target]!, order[index]!];
  await db.batch(
    order.map((row, i) =>
      db.prepare(`UPDATE ${table} SET position = ? WHERE id = ?`).bind(i + 1, row.id),
    ),
  );
}

/** New items go to the top of their list. */
async function topPosition(table: "projects" | "testimonials"): Promise<number> {
  const top = await getDb()
    .prepare(`SELECT COALESCE(MIN(position), 1) - 1 AS pos FROM ${table}`)
    .first<{ pos: number }>();
  return top?.pos ?? 0;
}

/* ---------- projects ---------- */

export type ProjectFields = { caption: string; stage: string; alt: string };

function cleanProjectFields(input: ProjectFields) {
  const caption = input.caption.trim().slice(0, 140);
  if (!caption) throw new Error("Please add a caption.");
  if (!(stages as readonly string[]).includes(input.stage)) {
    throw new Error("Please choose a stage.");
  }
  return {
    caption,
    stage: input.stage,
    // The description for screen readers and Google defaults to the caption.
    alt: (input.alt.trim() || caption).slice(0, 300),
  };
}

/** Admin lists are unfiltered and never fall back — the owner must see the truth. */
export const adminListProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProjectRecord[]> => {
    await requireAdmin();
    const { results } = await getDb()
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY position, id`)
      .all<ProjectRow>();
    return results.map(toProject);
  },
);

export const adminGetProject = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }): Promise<ProjectRecord | null> => {
    await requireAdmin();
    const row = await getDb()
      .prepare(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ?`)
      .bind(id)
      .first<ProjectRow>();
    return row ? toProject(row) : null;
  });

export const createProject = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<{ id: number }> => {
    await requireAdmin();
    const fields = cleanProjectFields({
      caption: String(data.get("caption") ?? ""),
      stage: String(data.get("stage") ?? ""),
      alt: String(data.get("alt") ?? ""),
    });
    const image = readImage(data);
    const src = await putImage("projects", image);
    const result = await getDb()
      .prepare(
        `INSERT INTO projects (src, width, height, alt, caption, stage, hidden, position)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      )
      .bind(
        src,
        image.width,
        image.height,
        fields.alt,
        fields.caption,
        fields.stage,
        await topPosition("projects"),
      )
      .run();
    return { id: Number(result.meta.last_row_id) };
  });

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((input: ProjectFields & { id: number }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const fields = cleanProjectFields(data);
    await getDb()
      .prepare(`UPDATE projects SET caption = ?, stage = ?, alt = ? WHERE id = ?`)
      .bind(fields.caption, fields.stage, fields.alt, positiveId(data.id))
      .run();
  });

export const replaceProjectPhoto = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const id = positiveId(data.get("id"));
    const image = readImage(data);

    const db = getDb();
    const project = await db
      .prepare(`SELECT src FROM projects WHERE id = ?`)
      .bind(id)
      .first<{ src: string }>();
    if (!project) throw new Error("That project no longer exists.");

    const src = await putImage("projects", image);
    await db
      .prepare(`UPDATE projects SET src = ?, width = ?, height = ? WHERE id = ?`)
      .bind(src, image.width, image.height, id)
      .run();
    await deleteMediaObjects([project.src]);
  });

export const setProjectHidden = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; hidden: boolean }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb()
      .prepare(`UPDATE projects SET hidden = ? WHERE id = ?`)
      .bind(data.hidden ? 1 : 0, positiveId(data.id))
      .run();
  });

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const id = positiveId(data);
    const db = getDb();
    const project = await db
      .prepare(`SELECT src FROM projects WHERE id = ?`)
      .bind(id)
      .first<{ src: string }>();
    if (!project) return;

    await db.prepare(`DELETE FROM projects WHERE id = ?`).bind(id).run();
    // Remove the R2 object too, or the bucket keeps paying for an orphan.
    await deleteMediaObjects([project.src]);
  });

export const moveProject = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; direction: "up" | "down" }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await move("projects", positiveId(data.id), data.direction);
  });

/* ---------- testimonials ---------- */

export type TestimonialFields = { name: string; role: string; quote: string };

function cleanTestimonial(input: TestimonialFields) {
  const name = input.name.trim().slice(0, 80);
  const quote = input.quote.trim().slice(0, 800);
  if (!name) throw new Error("Please add the client's name.");
  if (quote.length < 10) throw new Error("Please add what the client said.");
  return { name, quote, role: input.role.trim().slice(0, 80) };
}

export const adminListTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<TestimonialRecord[]> => {
    await requireAdmin();
    const { results } = await getDb()
      .prepare(`SELECT ${TESTIMONIAL_COLUMNS} FROM testimonials ORDER BY position, id`)
      .all<TestimonialRow>();
    return results.map(toTestimonial);
  },
);

export const saveTestimonial = createServerFn({ method: "POST" })
  .inputValidator((input: TestimonialFields & { id: number | null }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const t = cleanTestimonial(data);
    const db = getDb();
    if (data.id === null) {
      await db
        .prepare(
          `INSERT INTO testimonials (name, role, quote, hidden, position) VALUES (?, ?, ?, 0, ?)`,
        )
        .bind(t.name, t.role, t.quote, await topPosition("testimonials"))
        .run();
      return;
    }
    await db
      .prepare(`UPDATE testimonials SET name = ?, role = ?, quote = ? WHERE id = ?`)
      .bind(t.name, t.role, t.quote, positiveId(data.id))
      .run();
  });

export const setTestimonialHidden = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; hidden: boolean }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb()
      .prepare(`UPDATE testimonials SET hidden = ? WHERE id = ?`)
      .bind(data.hidden ? 1 : 0, positiveId(data.id))
      .run();
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb().prepare(`DELETE FROM testimonials WHERE id = ?`).bind(positiveId(data)).run();
  });

export const moveTestimonial = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; direction: "up" | "down" }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await move("testimonials", positiveId(data.id), data.direction);
  });

/* ---------- enquiries ---------- */

type EnquiryRow = {
  id: number;
  name: string;
  country: string;
  whatsapp: string;
  owns_stand: string;
  stand_location: string;
  build_type: string;
  budget: string;
  start_when: string;
  message: string;
  status: string;
  created_at: string;
};

export const adminListEnquiries = createServerFn({ method: "GET" }).handler(
  async (): Promise<EnquiryRecord[]> => {
    await requireAdmin();
    const { results } = await getDb()
      .prepare(
        `SELECT id, name, country, whatsapp, owns_stand, stand_location, build_type, budget,
                start_when, message, status, created_at
         FROM enquiries ORDER BY id DESC LIMIT 500`,
      )
      .all<EnquiryRow>();
    // Values were validated on the way in; the casts only restore the literal types.
    return results.map((r) => ({
      id: r.id,
      name: r.name,
      country: r.country as EnquiryRecord["country"],
      whatsapp: r.whatsapp,
      ownsStand: r.owns_stand as EnquiryRecord["ownsStand"],
      standLocation: r.stand_location,
      buildType: r.build_type as EnquiryRecord["buildType"],
      budget: r.budget as EnquiryRecord["budget"],
      startWhen: r.start_when as EnquiryRecord["startWhen"],
      message: r.message,
      status: (enquiryStatuses as readonly string[]).includes(r.status)
        ? (r.status as EnquiryStatus)
        : "New",
      createdAt: r.created_at,
    }));
  },
);

export const setEnquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; status: EnquiryStatus }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    if (!(enquiryStatuses as readonly string[]).includes(data.status)) {
      throw new Error("Unknown status.");
    }
    await getDb()
      .prepare(`UPDATE enquiries SET status = ? WHERE id = ?`)
      .bind(data.status, positiveId(data.id))
      .run();
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb().prepare(`DELETE FROM enquiries WHERE id = ?`).bind(positiveId(data)).run();
  });

/* ---------- settings ---------- */

export type AdminSettings = {
  contact: ContactSettings;
  founder: FounderSettings;
  stats: StatsSettings;
  burbs: BurbsSettings;
};

export const adminGetSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSettings> => {
    await requireAdmin();
    const settings = await readSettings();
    return {
      contact: contactFrom(settings),
      founder: founderFrom(settings),
      stats: statsFrom(settings),
      burbs: burbsFrom(settings),
    };
  },
);

export type SettingsInput = {
  contact: ContactSettings;
  founderName: string;
  founderQuote: string;
  stats: StatsSettings;
  burbs: BurbsSettings;
};

const digits = (v: string) => v.replace(/\D/g, "");

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator((input: SettingsInput) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const c = data.contact;

    const phone = c.phone.trim();
    if (digits(phone).length < 9) throw new Error("Please enter a full main phone number.");
    const phone2 = c.phone2.trim();
    if (phone2 && digits(phone2).length < 9) {
      throw new Error("Please enter the full second phone number, or leave it empty.");
    }

    // wa.me links need digits only, in international format.
    const whatsapp = digits(c.whatsapp);
    if (whatsapp.length < 9 || whatsapp.startsWith("0")) {
      throw new Error("Enter the WhatsApp number with its country code, e.g. 263 71 379 6159.");
    }

    const email = c.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email.");

    const facebook = c.facebook.trim();
    if (facebook && !/^https:\/\/(www\.|m\.)?facebook\.com\//.test(facebook)) {
      throw new Error("The Facebook link should start with https://www.facebook.com/");
    }
    const community = c.community.trim();
    if (community && !/^https:\/\/chat\.whatsapp\.com\//.test(community)) {
      throw new Error("The WhatsApp Community link should start with https://chat.whatsapp.com/");
    }

    // Stats stay empty until confirmed; the site shows "[X]" for an empty one.
    const stat = (v: string) => v.trim().slice(0, 12);
    const text = (v: string, max: number) => v.trim().slice(0, max);
    const b = data.burbs;

    await writeSettings([
      ["phone", phone],
      ["phone2", phone2],
      ["whatsapp", whatsapp],
      ["email", email],
      ["facebook", facebook],
      ["community", community],
      ["founder_name", text(data.founderName, 80)],
      ["founder_quote", text(data.founderQuote, 400)],
      ["stat_homes", stat(data.stats.homes)],
      ["stat_diaspora", stat(data.stats.diaspora)],
      ["stat_years", stat(data.stats.years)],
      ["burbs_location", text(b.location, 160)],
      ["burbs_stand_size", text(b.standSize, 60)],
      ["burbs_cash_plan", text(b.cashPlan, 120)],
      ["burbs_terms_plan", text(b.termsPlan, 120)],
      ["burbs_no_deposit", b.noDeposit ? "1" : "0"],
      ["burbs_legal_status", text(b.legalStatus, 600)],
    ]);
  });

export const uploadFounderPhoto = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const image = readImage(data);
    const settings = await readSettings();
    const founder = founderFrom(settings);

    const src = await putImage("founder", image);
    await writeSettings([
      [
        "founder_photo",
        JSON.stringify({
          src,
          width: image.width,
          height: image.height,
          alt: `${founder.name}, founder of Champs Construction`,
        }),
      ],
    ]);
    if (founder.photo) await deleteMediaObjects([founder.photo.src]);
  });

export const removeFounderPhoto = createServerFn({ method: "POST" }).handler(
  async (): Promise<void> => {
    await requireAdmin();
    const previous = founderFrom(await readSettings()).photo;
    await writeSettings([["founder_photo", ""]]);
    if (previous) await deleteMediaObjects([previous.src]);
  },
);
