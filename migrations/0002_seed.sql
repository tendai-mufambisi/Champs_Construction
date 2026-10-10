-- Starting portfolio: two real Champs photos and three clearly marked placeholder slots
-- for the owner to replace from the dashboard. Mirrors FALLBACK_PROJECTS in
-- src/data/site-data.ts. Settings are not seeded: an empty setting uses the fallback.

INSERT INTO projects (id, src, width, height, alt, caption, stage, hidden, position) VALUES
  (1, '/images/projects/champs-team-on-site.jpg', 637, 318, 'The Champs Construction team in hard hats and safety overalls on a cleared stand', 'Our team on site, ready to start', 'Before', 0, 1),
  (2, '/images/projects/champs-house-during-construction.jpg', 637, 278, 'A single-storey house under construction with the roof on and builders at work', 'Single-storey home under construction', 'During', 0, 2),
  (3, '/images/placeholders/double-storey-under-scaffolding.svg', 1200, 900, 'Placeholder for a photo of a double-storey house under scaffolding', '[REPLACE WITH CHAMPS PROJECT PHOTO] Double-storey under scaffolding', 'During', 0, 3),
  (4, '/images/placeholders/completed-single-storey-brick-home.svg', 1200, 900, 'Placeholder for a photo of a completed single-storey brick home', '[REPLACE WITH CHAMPS PROJECT PHOTO] Completed single-storey brick home', 'After', 0, 4),
  (5, '/images/placeholders/cottage-rondavel-tiled-roof.svg', 1200, 900, 'Placeholder for a photo of a cottage or rondavel with a tiled roof', '[REPLACE WITH CHAMPS PROJECT PHOTO] Cottage / rondavel with tiled roof', 'After', 0, 5);
