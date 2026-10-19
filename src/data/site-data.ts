// The owner-editable part of the site: project photos, testimonials, contact details,
// founder, stats and the stands developments. D1 holds the live copy; everything here is the
// FALLBACK used when D1 is unreachable (and mirrors the seed in migrations/0002_seed.sql).
// Pure module: no server imports, safe in the browser.

import {
  company,
  developmentDefaults,
  type DevelopmentKey,
  statLabels,
  testimonialPlaceholders,
  whatsappText,
} from "@/lib/site-data";

export const stages = ["Before", "During", "After"] as const;
export type Stage = (typeof stages)[number];

export type WorkPhotoRecord = {
  id: number;
  /** URL path: /images/… (shipped with the site) or /media/… (R2 upload). */
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  stage: Stage;
  hidden: boolean;
};

export type TestimonialRecord = {
  id: number;
  name: string;
  role: string;
  quote: string;
  hidden: boolean;
};

export type PhotoData = { src: string; width: number; height: number; alt: string };

export type ContactSettings = {
  phone: string;
  phone2: string;
  /** Digits only, international format without "+", e.g. 263713796159. */
  whatsapp: string;
  email: string;
  facebook: string;
  community: string;
};

export type FounderSettings = {
  name: string;
  quote: string;
  /** null = show the placeholder that ships with the site. */
  photo: PhotoData | null;
};

export type StatKey = (typeof statLabels)[number]["key"];
/** Empty string = not confirmed yet, shown as "[X]". */
export type StatsSettings = Record<StatKey, string>;

export type DevelopmentSettings = (typeof developmentDefaults)[DevelopmentKey];
export type DevelopmentsSettings = Record<DevelopmentKey, DevelopmentSettings>;

/** A project with its own page at /projects/<slug>. */
export type ProjectRecord = {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  status: string;
  summary: string;
  body: string;
  scope: string[];
  /** '/media/…' once a photo is uploaded, otherwise null. */
  cover: string | null;
  coverAlt: string;
  featured: boolean;
  published: boolean;
};

export type ProjectImage = { id: number; url: string; alt: string };

export const projectStatuses = ["Completed", "In Progress", "Upcoming"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

/** A member of the team. Blank name and photo are normal: the slots ship empty. */
export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  photoAlt: string;
  hidden: boolean;
};

/** Sections the owner can switch off, and the uploaded company profile. */
export type SiteToggles = {
  burbsEnabled: boolean;
  mcmEnabled: boolean;
  teamEnabled: boolean;
  /** '/media/…' to the PDF, or '' while none is uploaded. */
  companyProfilePdf: string;
};

export type SiteData = {
  contact: ContactSettings;
  founder: FounderSettings;
  stats: StatsSettings;
  developments: DevelopmentsSettings;
  /** Visible Before/During/After photos only, in display order. */
  workPhotos: WorkPhotoRecord[];
  /** Published projects, in display order. Each has its own page. */
  projects: ProjectRecord[];
  /** Visible team members, in display order. Blank slots are kept: they render as placeholders. */
  team: TeamMember[];
  toggles: SiteToggles;
  /** Visible testimonials only, in display order. Empty = show the placeholders. */
  testimonials: TestimonialRecord[];
  /** False when this is the fallback (D1 unreachable or not configured). */
  live: boolean;
};

/* ---------- fallback (mirrors migrations 0002–0004) ---------- */

export const FOUNDER_QUOTE_PLACEHOLDER = "[FOUNDER QUOTE — TO CONFIRM]";

export const FALLBACK_CONTACT: ContactSettings = {
  phone: company.phoneDisplay,
  phone2: company.phone2Display,
  whatsapp: company.whatsapp,
  email: company.email,
  facebook: company.facebook,
  community: company.community,
};

// Mirrors work_photos after migration 0004, in display order.
export const FALLBACK_PROJECTS: WorkPhotoRecord[] = [
  {
    id: 6,
    src: "/images/work/setting-out.jpg",
    width: 1000,
    height: 750,
    alt: "The Champs team setting out foundation trenches on a cleared stand",
    caption: "Setting out the foundations",
    stage: "Before",
    hidden: false,
  },
  {
    id: 1,
    src: "/images/projects/champs-team-on-site.jpg",
    width: 637,
    height: 318,
    alt: "The Champs Construction team in hard hats and safety overalls on a cleared stand",
    caption: "Our team on site, ready to start",
    stage: "Before",
    hidden: false,
  },
  {
    id: 3,
    src: "/images/work/foundation-steel.jpg",
    width: 1000,
    height: 750,
    alt: "Steel reinforcement laid in the foundation trenches",
    caption: "Steel reinforcement in the foundations",
    stage: "During",
    hidden: false,
  },
  {
    id: 7,
    src: "/images/work/brickwork.jpg",
    width: 1000,
    height: 750,
    alt: "Builders on a brick wall rising from the foundations",
    caption: "Brickwork rising",
    stage: "During",
    hidden: false,
  },
  {
    id: 8,
    src: "/images/work/plastering.jpg",
    width: 1000,
    height: 750,
    alt: "Builders on scaffolding plastering a house with a tiled roof",
    caption: "Plastering under a tiled roof",
    stage: "During",
    hidden: false,
  },
  {
    id: 2,
    src: "/images/projects/champs-house-during-construction.jpg",
    width: 637,
    height: 278,
    alt: "A single-storey house under construction with the roof on and builders at work",
    caption: "Single-storey home under construction",
    stage: "During",
    hidden: false,
  },
  {
    id: 4,
    src: "/images/projects/mvurwi/finished-front.jpg",
    width: 1080,
    height: 810,
    alt: "A finished four-bedroom house with a face-brick front and chimney",
    caption: "Four-bedroom turnkey home, Mvurwi",
    stage: "After",
    hidden: false,
  },
  {
    id: 9,
    src: "/images/projects/mvurwi/kitchen.jpg",
    width: 1000,
    height: 750,
    alt: "A fitted kitchen with white cupboards and a black worktop",
    caption: "Fitted kitchen, ready for handover",
    stage: "After",
    hidden: false,
  },
  {
    id: 5,
    src: "/images/projects/family-home/front.jpg",
    width: 1000,
    height: 563,
    alt: "A completed cream house with a black plinth and dark windows",
    caption: "Completed family home",
    stage: "After",
    hidden: false,
  },
];

// Mirrors the team after migration 0004.
export const FALLBACK_TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Mr R. Gwenyambira",
    role: "Operations Manager",
    bio: "",
    photo: "/images/team/r-gwenyambira.jpg",
    photoAlt: "Mr R. Gwenyambira in a Champs hard hat",
    hidden: false,
  },
  {
    id: 2,
    name: "Mr D. Chaleka",
    role: "Projects Manager",
    bio: "",
    photo: "/images/team/d-chaleka.jpg",
    photoAlt: "Mr D. Chaleka in a Champs hard hat",
    hidden: false,
  },
  {
    id: 3,
    name: "Mr R. Masiya",
    role: "Quantity Surveyor",
    bio: "",
    photo: "/images/team/r-masiya.jpg",
    photoAlt: "Mr R. Masiya in a Champs hard hat and safety jacket",
    hidden: false,
  },
  {
    id: 4,
    name: "Mr M. Marume",
    role: "Admin",
    bio: "",
    photo: "/images/team/m-marume.jpg",
    photoAlt: "Mr M. Marume in a Champs hard hat and overalls",
    hidden: false,
  },
];

export const FALLBACK_SITE_DATA: SiteData = {
  contact: FALLBACK_CONTACT,
  founder: {
    name: "Mr. R Gwenyambira",
    quote: FOUNDER_QUOTE_PLACEHOLDER,
    photo: {
      src: "/images/team/r-gwenyambira.jpg",
      width: 503,
      height: 629,
      alt: "Mr R. Gwenyambira, founder of Champs Construction",
    },
  },
  stats: { homes: "", diaspora: "", years: "" },
  developments: developmentDefaults,
  workPhotos: FALLBACK_PROJECTS,
  projects: [],
  team: FALLBACK_TEAM,
  toggles: { burbsEnabled: true, mcmEnabled: true, teamEnabled: true, companyProfilePdf: "" },
  testimonials: [],
  live: false,
};

/* ---------- helpers shared by the site and the dashboard ---------- */

export const FOUNDER_PLACEHOLDER_SRC = "/images/founder/founder-placeholder.svg";

/** Shipped placeholder slots that the owner should replace with real photos. */
export const isPlaceholder = (src: string) => src.startsWith("/images/placeholders/");

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Any phone number written with a country code, as a wa.me number (digits only). */
export const waNumber = (phone: string) => phone.replace(/\D/g, "");

export const whatsappUrl = (number: string, text: string = whatsappText) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export { testimonialPlaceholders };
