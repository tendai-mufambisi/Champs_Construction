// Site copy for Champs Construction. Contact details, founder, stats, The Burbs details,
// project photos and testimonials are owner-editable from /admin (stored in D1); the
// values here are their fallback when D1 is unreachable. See src/data/site-data.ts.
//
// Rules: never invent testimonials, statistics, project names, awards, registrations or
// credentials. Anything still to be supplied by the client is marked [LIKE THIS].

export const SITE_URL = "https://champsconstruction.co.zw";

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
  ogImage: "/og-image.jpg",
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

// Hero trust strip, worded by the owner.
export const trustBadges = [
  {
    title: "Supply & Fix Options",
    body: "Complete materials sourcing paired with skilled craftsmanship.",
  },
  {
    title: "Labour-Only & Project Management",
    body: "Expert artisans backed by professional site oversight.",
  },
  {
    title: "Contract-Guaranteed Fixed Pricing",
    body: "Legally binding written agreements with zero cost surprises.",
  },
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
    title: "Three Ways To Build",
    body: "A full turnkey build, supervised labour teams for clients with their own materials, or independent management of a build already underway.",
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
      "Your build managed on the ground",
      "Transparent progress",
      "Legally binding contractual agreement",
      "Keys on handover",
    ],
  },
};

export const services = [
  {
    icon: "ClipboardCheck",
    title: "Project Management",
    body: "Independent, on-site oversight of your build: quality checks against the drawings, materials reconciled and verified progress reports before each stage payment.",
  },
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
    icon: "PanelTop",
    title: "Ceilings",
    body: "Ceiling boards, brandering and cornices, neatly fitted and finished in every room.",
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
    icon: "Fence",
    title: "Boundary Walls",
    body: "Durable boundary and security walls, built on proper footings to secure your property.",
  },
  {
    icon: "Truck",
    title: "Materials Supply",
    body: "We source and supply the materials on turnkey builds, or our labour teams build with the materials you supply.",
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
    body: "Plans, approvals guidance and a comprehensive Bill of Quantities.",
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

// Residential stands Champs sells. The figures are editable in the dashboard; these are
// the fallback values. "No deposit, no interest" stays hidden until the client confirms
// it and switches it on. An empty plan is left off the site.
export type DevelopmentKey = "burbs" | "mcm";

export const developmentKeys: DevelopmentKey[] = ["burbs", "mcm"];

export const developmentDefaults: Record<
  DevelopmentKey,
  {
    location: string;
    standSize: string;
    cashPlan: string;
    depositPlan: string;
    termsPlan: string;
    noDeposit: boolean;
    legalStatus: string;
  }
> = {
  burbs: {
    location: "3 km from Chivhu City Centre, along Murambinda Road",
    standSize: "300 sqm",
    cashPlan: "$8,000, paid within 12 months",
    depositPlan: "At least $2,000 down, balance within 12 months",
    termsPlan: "$200/month for 5 years",
    noDeposit: false,
    legalStatus:
      "Parent deed verified on file. Subdivision permit currently processing with the local council. Stands are not yet pegged.",
  },
  mcm: {
    location: "5 minutes from Marondera CBD",
    standSize: "300 sqm (252 sqm on the monthly plan)",
    cashPlan: "$18,000, and you start building straight away",
    depositPlan: "$6,000 down, balance within 12 months. Start building once 50% is paid",
    termsPlan: "$250/month for 12 years (252 sqm stand)",
    noDeposit: false,
    legalStatus:
      "Privately owned land with a parent deed and a subdivision permit. Stands are pegged.",
  },
};

/** Fixed copy for each development; only the figures above are editable. */
export const developmentInfo: Record<
  DevelopmentKey,
  { name: string; town: string; badge: string; noteTitle: string; note: string }
> = {
  burbs: {
    name: "The Burbs",
    town: "Chivhu",
    badge: "Pre-development pricing",
    noteTitle: "Why buy now",
    note: "Pre-development pricing locks in a lower entry price ahead of expected increases once pegging, council approvals and roads are complete.",
  },
  mcm: {
    name: "MCM Estates",
    town: "Marondera",
    badge: "Pegged stands",
    noteTitle: "Once you pay",
    note: "You receive your agreement of sale and your stand is allocated straight away.",
  },
};

export const developmentEnquiryText = (key: DevelopmentKey) =>
  `Hi Champs Construction, I'm interested in a stand at ${developmentInfo[key].name}, ${developmentInfo[key].town}. Please send me more details.`;

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
    a: "Yes. We manage the build on the ground here in Zimbabwe, from materials and construction to handover, and send you structured progress reports so you can follow it from wherever you live.",
  },
  {
    q: "Do you supply the building materials?",
    a: "Yes, on a full turnkey build we source and supply everything and take the build all the way to handover. If you have already bought your materials, our labour-only teams build with them under a site foreman, on fixed milestone pricing.",
  },
  {
    q: "Do you charge for quotations and Bills of Quantities (BOQs)?",
    a: "Initial consultations and ballpark estimates are free. A Comprehensive Bill of Quantities starts from $50 USD, depending on the size and scope of your architectural plans. It is an item-by-item technical audit of exact material volumes, structural schedules and labour requirements, prepared by our estimators and delivered within 3 working days. Best of all: if you choose to build with Champs Construction, 100% of the fee is deducted from your first deposit, so it costs you nothing when you build with us.",
  },
  {
    q: "I already have a builder. Can you still help?",
    a: "Yes. Our independent project management puts Champs on site for you: we check the work against the engineering drawings, reconcile the materials delivered, track the schedule and send verified progress reports before you release each stage payment.",
  },
  {
    q: "What services do you offer?",
    a: "Three service models: full turnkey (fix and supply), labour-only contracting and independent project management. Within those: planning and design, site preparation and clearance, foundations and framing, roofing, ceilings, plumbing, electrical installations, tiling, painting and finishes, boundary walls, materials supply and handover to the owner.",
  },
  {
    q: "I don't have a stand yet. Can you help?",
    a: "Yes. We sell residential stands at The Burbs, Chivhu and MCM Estates, Marondera, both featured on this page with cash, deposit and monthly plans. Please read each development's legal status, shown in full in that section, before you reserve.",
  },
  {
    q: "How do I get started?",
    a: "Fill in the build enquiry form on this page or message us on WhatsApp. Tell us where your stand is, what you want to build and your budget, and we will arrange a consultation.",
  },
];

// The three ways to engage Champs, as set out by the owner. Shown on the home
// page and /services; labour-only has its own page.
export const serviceModels = [
  {
    icon: "KeyRound",
    title: "Fix & Supply",
    tag: "Full Turnkey",
    body: "A complete, hands-off solution. Champs manages the entire build from start to finish, including council approvals, material sourcing, site construction and dedicated milestone reporting until key handover.",
    idealFor: "Diaspora clients and busy professionals seeking a single accountable builder.",
    link: null,
  },
  {
    icon: "HardHat",
    title: "Labour-Only Contracting",
    tag: "Your materials",
    body: "Vetted, foreman-led artisan teams (bricklayers, carpenters, plasterers and more) for clients who supply their own materials. Minimal material waste, structural accuracy and fixed milestone pricing instead of unpredictable daily rates.",
    idealFor: "Clients who prefer to buy and supply their own building materials.",
    link: "/labour-only",
  },
  {
    icon: "ClipboardCheck",
    title: "Independent Project Management",
    tag: "Your contractor",
    body: "Impartial on-site representation. Champs audits construction quality against the engineering drawings, reconciles delivered materials, tracks the schedule and provides verified progress reports before stage payments are released to third parties.",
    idealFor: "Clients who already have contractors or family handling the build.",
    link: null,
  },
] as const;

export const labourWhatsappText =
  "Hi Champs Construction, I have my materials and I'd like a quote for a labour-only team.";

// /labour-only, as supplied by the owner.
export const labourOnly = {
  eyebrow: "Labour-Only Contracting & Skilled Trades",
  title: "Your Materials. Our Skilled Craftsmanship. Supervised to Perfection.",
  intro:
    "If you prefer to purchase and supply your own building materials, you still deserve reliable, high-calibre construction. Champs Construction provides experienced, vetted and fully supervised trade teams to execute your residential build from the ground up, with zero compromise on structural integrity.",
  pitfalls:
    "We eliminate the common pitfalls of hiring casual builders: no absentee artisans, no unmeasured material waste and no cutting corners. Every team we deploy works under the direct leadership of an on-site supervisor, ensuring your architectural plans are executed accurately, safely and on schedule.",
  provide: [
    {
      icon: "Users",
      title: "Foreman-Led Artisan Teams",
      body: "Every project is assigned qualified bricklayers, steel-fixers, carpenters, plasterers and plumbers, led by a dedicated site foreman who manages daily output and quality control.",
    },
    {
      icon: "Milestone",
      title: "Milestone-Based Contracts",
      body: "No unpredictable daily charges or open-ended timelines. We agree fixed milestone pricing tied to measurable completion stages: footing, slab, brickwork to wall plate, roof structure and plastering.",
    },
    {
      icon: "Recycle",
      title: "Material Stewardship & Efficiency",
      body: "We treat your supplies with extreme care. Our artisans work to minimise off-cuts, reduce breakage and prevent site wastage, protecting your investment in materials.",
    },
    {
      icon: "FileCheck",
      title: "Plan & Engineering Compliance",
      body: "Work is completed strictly to your approved architectural and structural engineering specifications, so council inspections pass without costly rectifications.",
    },
  ],
  stages: [
    {
      title: "Substructure & Groundwork",
      body: "Setting out, trench excavation, footings, foundation brickwork, backfilling and slab pouring.",
    },
    {
      title: "Superstructure",
      body: "Load-bearing brickwork, reinforcement beams, lintels and gable walls up to wall plate level.",
    },
    {
      title: "Roofing & Trusses",
      body: "Fabrication and installation of timber or light-gauge steel trusses, battens, and sheeting or tiles.",
    },
    {
      title: "Plastering, Screeding & Finishes",
      body: "Rough casting, interior and exterior plastering, floor screeds, tiling and ceiling installation.",
    },
    {
      title: "Plumbing & Electrical Rough-Ins",
      body: "Conduit laying, pipe runs and pre-plaster services installation.",
    },
  ],
  steps: [
    {
      title: "Plan & Bill Review",
      body: "Share your approved drawings and project details so we can assess the scope of labour required.",
    },
    {
      title: "Fixed Milestone Quotation",
      body: "A clear quotation broken down by build stage, with defined timeframes.",
    },
    {
      title: "Mobilisation & Execution",
      body: "Once materials are ready on site, our team deploys with tools and supervisory oversight.",
    },
    {
      title: "Stage Handover",
      body: "Work is inspected and approved at each milestone before moving to the next phase.",
    },
  ],
};
