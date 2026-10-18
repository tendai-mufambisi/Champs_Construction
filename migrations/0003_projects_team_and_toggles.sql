-- Real project pages, the team section, and the switches the owner controls.
--
-- Only line comments are used. D1's remote migration endpoint splits on ";" and
-- rejects a chunk that turns out to hold nothing but a block comment.

-- The table called "projects" was never a list of projects: it is the
-- Before/During/After photo strip. Renaming it frees the name for real project
-- pages and keeps the photos already uploaded.
ALTER TABLE projects RENAME TO work_photos;
DROP INDEX IF EXISTS projects_position;
CREATE INDEX IF NOT EXISTS work_photos_position ON work_photos (position, id);

-- One row per project, each with its own page at /projects/<slug>.
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  -- Free text so the owner is never boxed in: "Four-bedroom house", "Boundary wall".
  category TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  -- 'Completed' | 'In Progress' | 'Upcoming'
  status TEXT NOT NULL DEFAULT 'Completed',
  summary TEXT NOT NULL DEFAULT '',
  -- The long write-up on the project's own page. Markdown.
  body TEXT NOT NULL DEFAULT '',
  -- One scope item per line, rendered as a checklist.
  scope TEXT NOT NULL DEFAULT '',
  -- '/media/…' once a photo is uploaded; NULL shows a placeholder instead.
  cover TEXT,
  cover_alt TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS projects_position ON projects (position, id);

-- Gallery for a project page.
CREATE TABLE IF NOT EXISTS project_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  url TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS project_images_project ON project_images (project_id, position);

-- Meet the team. Capped at five in the dashboard, not here, so the owner gets a
-- clear message rather than a database error.
CREATE TABLE IF NOT EXISTS team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  photo TEXT,
  photo_alt TEXT NOT NULL DEFAULT '',
  hidden INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS team_position ON team (position, id);

-- Three empty slots so the section renders from day one and the owner only has
-- to fill names and photos in, rather than work out how to create a row.
INSERT INTO team (name, role, position) VALUES ('', '', 1);
INSERT INTO team (name, role, position) VALUES ('', '', 2);
INSERT INTO team (name, role, position) VALUES ('', '', 3);

-- The founder, confirmed by the client.
INSERT INTO settings (key, value) VALUES ('founder_name', 'Mr. R Gwenyambira')
  ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = datetime('now');

-- The Burbs section is a land offering, not core construction work, so the owner
-- can switch the whole thing off without losing the details already captured.
INSERT INTO settings (key, value) VALUES ('burbs_enabled', '1')
  ON CONFLICT (key) DO NOTHING;

-- Company profile PDF. Empty means no upload yet, and the download button stays
-- hidden rather than linking nowhere.
INSERT INTO settings (key, value) VALUES ('company_profile_pdf', '')
  ON CONFLICT (key) DO NOTHING;

-- Team section heading and intro, editable like everything else.
INSERT INTO settings (key, value) VALUES ('team_enabled', '1')
  ON CONFLICT (key) DO NOTHING;
