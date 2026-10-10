-- Owner dashboard schema. Content columns are TEXT NOT NULL DEFAULT '' so a half-filled
-- row never breaks the public site.

-- Portfolio photos (Before / During / After).
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- URL path: /images/… (shipped with the site) or /media/… (R2 upload).
  src TEXT NOT NULL DEFAULT '',
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  alt TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'During' CHECK (stage IN ('Before', 'During', 'After')),
  hidden INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX projects_position ON projects (position, id);

-- Real client testimonials only, added by the owner. Empty = the site shows placeholders.
CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL DEFAULT '',
  hidden INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX testimonials_position ON testimonials (position, id);

-- Build enquiry form submissions.
CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  owns_stand TEXT NOT NULL DEFAULT '',
  stand_location TEXT NOT NULL DEFAULT '',
  build_type TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  start_when TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  -- Only used to rate-limit the form.
  ip TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX enquiries_ip_created ON enquiries (ip, created_at);

-- Contact details, founder, stats, The Burbs details and the admin password hash.
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Failed sign-ins per IP, for rate limiting.
CREATE TABLE login_attempts (
  ip TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL DEFAULT 0
);
