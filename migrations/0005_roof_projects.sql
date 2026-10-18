-- Two roof-only contracts: Kwekwe and Fidelity, Harare. Photos ship with the
-- site under /images/projects/. Added after whatever projects already exist, and
-- skipped if the owner has already created a project with the same slug.

INSERT INTO projects (slug, title, category, location, year, status, summary, body, scope, cover, cover_alt, featured, published, position)
SELECT 'kwekwe-roof-installation',
  'Roof Installation, Kwekwe',
  'Roofing',
  'Kwekwe',
  '2026',
  'Completed',
  'A roof-only contract: trusses and charcoal tile-profile sheeting on the client''s brick shell, taking the house from wall plate to weather-tight.',
  'The client built the walls and brought Champs in for the roof. Our team took the house from wall plate to a finished hipped roof: trusses set out and fixed, then charcoal tile-profile sheeting with fascia boards all round.

A roof-only contract like this is a good fit for owners who are building in stages. You finish the walls, we close the house in, and the build is protected from the rains while you plan the next stage.',
  'Timber roof trusses
Battens
Charcoal tile-profile roof sheeting
Hipped roof with fascia boards',
  '/images/projects/kwekwe-roof/front.jpg',
  'A brick house in Kwekwe with its new charcoal hipped roof',
  0, 1, COALESCE((SELECT MAX(position) FROM projects), 0) + 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'kwekwe-roof-installation');

INSERT INTO projects (slug, title, category, location, year, status, summary, body, scope, cover, cover_alt, featured, published, position)
SELECT 'fidelity-roof-installation',
  'Roof Installation, Fidelity, Harare',
  'Roofing',
  'Fidelity, Harare',
  '2026',
  'Completed',
  'A roof-only contract on a face-brick house in Fidelity: timber trusses and red tile-profile sheeting, from bare wall plate to a finished roof.',
  'The walls were up and the client needed a roof. Champs fabricated and fixed the timber trusses on the wall plate, then laid red tile-profile sheeting over the full hipped roof.

The finished roof closes the house in and lets the owner move on to windows, plaster and finishes at their own pace.',
  'Timber roof trusses fabricated and fixed
Battens
Red tile-profile roof sheeting
Hipped roof with fascia boards',
  '/images/projects/fidelity-roof/finished.jpg',
  'A face-brick house in Fidelity, Harare, with its new red tile-profile roof',
  0, 1, COALESCE((SELECT MAX(position) FROM projects), 0) + 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'fidelity-roof-installation');

-- Each gallery row finds its project by slug, and a re-run adds nothing twice.
INSERT INTO project_images (project_id, url, alt, position)
SELECT p.id, v.url, v.alt, v.position FROM projects p JOIN (
  SELECT 'kwekwe-roof-installation' AS slug, '/images/projects/kwekwe-roof/front.jpg' AS url, 'The finished charcoal roof from the front' AS alt, 1 AS position
  UNION ALL SELECT 'kwekwe-roof-installation', '/images/projects/kwekwe-roof/side.jpg', 'The roof from the side', 2
  UNION ALL SELECT 'kwekwe-roof-installation', '/images/projects/kwekwe-roof/before.jpg', 'Before: the brick walls at wall plate, ready for the roof', 3
) AS v ON v.slug = p.slug
WHERE NOT EXISTS (SELECT 1 FROM project_images i WHERE i.project_id = p.id);

INSERT INTO project_images (project_id, url, alt, position)
SELECT p.id, v.url, v.alt, v.position FROM projects p JOIN (
  SELECT 'fidelity-roof-installation' AS slug, '/images/projects/fidelity-roof/finished.jpg' AS url, 'The finished red roof, with a roofer completing the ridge' AS alt, 1 AS position
  UNION ALL SELECT 'fidelity-roof-installation', '/images/projects/fidelity-roof/close-up.jpg', 'Close-up of the red tile-profile sheeting', 2
  UNION ALL SELECT 'fidelity-roof-installation', '/images/projects/fidelity-roof/trusses.jpg', 'The timber trusses going up on the wall plate', 3
  UNION ALL SELECT 'fidelity-roof-installation', '/images/projects/fidelity-roof/before.jpg', 'Before: the face-brick walls at wall plate', 4
) AS v ON v.slug = p.slug
WHERE NOT EXISTS (SELECT 1 FROM project_images i WHERE i.project_id = p.id);
