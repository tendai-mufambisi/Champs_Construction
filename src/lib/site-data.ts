// Site copy for Champs Construction. Contact details, founder, stats, The Burbs details,
// project photos and testimonials are owner-editable from /admin (stored in D1); the
// values here are their fallback when D1 is unreachable. See src/data/site-data.ts.
//
// Rules: never invent testimonials, statistics, project names, awards, registrations or
// credentials. Anything still to be supplied by the client is marked [LIKE THIS].

export const SITE_URL = "https://champs.digitsdigital.co.zw";

export const company = {
  name: "Champs Construction",
  // Supplied artwork, in public/. The site shipped with a drawn-in-code
  // placeholder in yellow-green which was never the real mark.
  //   logo        mark + wordmark, tagline cropped off (headers, footers)
  //   logoDark    full lockup, tagline in WHITE, for dark backgrounds
  //   logoLight   full lockup, tagline in BLACK, for light backgrounds
  logo: "/logo-wordmark.png",
  logoDark: "/champs-logo-dark.png",
  logoLight: "/champs-logo-light.png",
  ogImage: "/og-image.png",
  shortName: "Champs",
  tagline: "Building Partners You Can Trust",
  // Primary line (also WhatsApp), as on the client's flyer.
  phoneDisplay: "+263 71 379 6159",
  phone2Display: "+263 77 397 5415",
  whatsapp: "263713796159",
  // TODO(Champs): confirm the email. Facebook shows "infor@champsconstruction.co.zw".
  email: "info@champsconstruction.co.zw",
  website: "champsconstruction.com",
  // TODO(Champs): replace with the page's own URL (editable in the dashboard).
  facebook: "https://www.facebook.com/search/top?q=Champs%20Construction",
  community: "https://chat.whatsapp.com/DxMYYMZP4s899FP3hTI1xA",
  address: "110 L. Takawira Street, 5th Floor, Construction House, Harare, Zimbabwe",
  mapQuery: "Construction+House,+Leopold+Takawira+Street,+Harare,+Zimbabwe",
};

export const whatsappText = "Hi Champs Construction, I'd like to build a house in Zimbabwe.";

// Real pages rather than hash jumps: each one can rank on its own terms, which
// a single scrolling page cannot do.
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export type NavLink = (typeof navLinks)[number];

// Hero trust strip.
export const trustBadges = [
  "Materials Supplied",
  "Turnkey Handover",
  "Fixed, Written Quotations",
];

// Stats bar labels. The numbers are set in the dashboard; until then they show "[X]".
export const statLabels = [
  { key: "homes", label: "Homes Built" },
  { key: "diaspora", label: "Diaspora Clients" },
  { key: "years", label: "Years Experience" },
] as const;

// Trust pillars: the moving strip under the hero and the "Why Champs" cards.
export const trustPillars = [
  {
    icon: "BadgeCheck",
    title: "Professional",
    body: "One accountable team runs your build from the first site visit to the day you get the keys. No middlemen, no guesswork.",
  },
  {
    icon: "Eye",
    title: "Transparent",
    body: "You see what has been done and what comes next. Clear quotations, agreed stages and honest answers to every question.",
  },
  {
    icon: "CalendarCheck",
    title: "Clear Communication",
    body: "One point of contact from quotation to handover, and a straight answer whenever you ask where the build has reached.",
  },
  {
    icon: "ShieldCheck",
    title: "Quality Control At Every Stage",
    body: "Foundations, walls, roof and finishes are checked before the next stage starts, so problems are caught early, not after you move in.",
  },
  {
    icon: "MessagesSquare",
    title: "Client Engagement Throughout",
    body: "You stay part of every decision. Video calls, WhatsApp and photos keep you involved, from plans and materials to the final finishes.",
  },
  {
    icon: "KeyRound",
    title: "Full Turnkey Service",
    body: "We supply the materials, do all the construction work and hand over a finished home: from materials supply to keys in your hands.",
  },
];

// "Why Champs" comparison block.
export const comparison = {
  usual: {
    title: "Building from abroad usually means",
    points: ["Money sent", "No updates", "Relatives “managing”", "Work stalls"],
  },
  champs: {
    title: "With Champs",
    points: [
      "One accountable team",
      "Materials handled",
      "Transparent progress",
      "Fixed written quotations",
      "Keys on handover",
    ],
  },
};

export const services = [
  {
    icon: "DraftingCompass",
    title: "Planning & Design",
    body: "House plans, approvals guidance and a clear quotation before any work starts.",
  },
  {
    icon: "Shovel",
    title: "Site Preparation & Clearance",
    body: "Clearing, levelling and setting out your stand so the build starts on a sound footing.",
  },
  {
    icon: "BrickWall",
    title: "Foundations & Framing",
    body: "Strong foundations and solid brickwork, built and checked stage by stage.",
  },
  {
    icon: "House",
    title: "Roofing",
    body: "Expert roofing solutions for protection and aesthetic appeal.",
  },
  {
    icon: "Droplets",
    title: "Plumbing",
    body: "Plumbing services for reliable and efficient systems.",
  },
  {
    icon: "Zap",
    title: "Electrical Installations",
    body: "Safe and efficient electrical installations to power your home or business.",
  },
  {
    icon: "Grid3x3",
    title: "Tiling",
    body: "Neat, durable floor and wall tiling for kitchens, bathrooms and living areas.",
  },
  {
    icon: "PaintRoller",
    title: "Painting & Finishes",
    body: "Interior and exterior painting and finishes that make the house feel like home.",
  },
  {
    icon: "Truck",
    title: "Materials Supply",
    body: "We supply the building materials, so you don't have to manage suppliers from abroad.",
  },
  {
    icon: "KeyRound",
    title: "Handover To Owner",
    body: "A final inspection together, then the keys in your hands.",
  },
];

// "Your Build, Step by Step".
export const process = [
  {
    step: "01",
    title: "Consultation",
    body: "Tell us about your stand, plan and budget, on WhatsApp or a video call.",
  },
  {
    step: "02",
    title: "Planning & Quotation",
    body: "Plans, approvals guidance and a clear quote.",
  },
  {
    step: "03",
    title: "Site Preparation",
    body: "Clearing and setting out your stand.",
  },
  {
    step: "04",
    title: "Construction",
    body: "Foundation to roof, with every stage checked before the next begins.",
  },
  {
    step: "05",
    title: "Finishes",
    body: "Plumbing, electrical, tiling and painting.",
  },
  {
    step: "06",
    title: "Handover",
    body: "Inspection, and the keys in your hands.",
  },
];

// The Burbs, Chivhu. Editable in the dashboard; these are the fallback values.
// "No deposit, no interest" stays hidden until the client confirms it and switches it on.
export const burbsDefaults = {
  location: "5 km from Chivhu City Centre, along Murambinda Road",
  standSize: "300 sqm",
  cashPlan: "$8,000 spread over 12 months",
  termsPlan: "$200/month for 5 years",
  noDeposit: false,
  legalStatus:
    "Parent deed verified on file. Subdivision permit currently processing with the local council. Stands are not yet pegged.",
};

export const burbsEnquiryText =
  "Hi Champs Construction, I'm interested in a stand at The Burbs, Chivhu. Please send me more details.";

// Shown until real testimonials are added in the dashboard. Never replace these with
// made-up reviews.
export const testimonialPlaceholders = [1, 2, 3].map(() => ({
  name: "[CLIENT NAME]",
  role: "[LOCATION — TO COLLECT]",
  quote: "[CLIENT TESTIMONIAL — TO COLLECT]",
}));

export const faqs = [
  {
    q: "How will I know what is happening on site?",
    a: "You deal with one point of contact for the whole build. Ask at any time and you get a straight answer on what has been done and what comes next, and you are welcome on site whenever you want to see it for yourself.",
  },
  {
    q: "I live outside Zimbabwe. Can you build my house for me?",
    a: "Yes. We handle the materials, the construction and the handover here in Zimbabwe, and keep you updated so you can follow the build from wherever you live.",
  },
  {
    q: "Do you supply the building materials?",
    a: "Yes. We do everything from supplying materials and all construction work until you have the keys in your hands.",
  },
  {
    q: "What services do you offer?",
    a: "Planning and design, site preparation and clearance, foundations and framing, roofing, plumbing, electrical installations, tiling, painting and finishes, materials supply and handover to the owner.",
  },
  {
    q: "I don't have a stand yet. Can you help?",
    a: "You can enquire about The Burbs, Chivhu, the new residential development featured on this page. Please read its legal status, shown in full in that section, before you reserve.",
  },
  {
    q: "How do I get started?",
    a: "Fill in the build enquiry form on this page or message us on WhatsApp. Tell us where your stand is, what you want to build and your budget, and we will arrange a consultation.",
  },
];
