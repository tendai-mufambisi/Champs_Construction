-- Real Champs content from the company profile: four projects with their photo
-- galleries, the team, the founder's photo, and real photos in place of the
-- Before/During/After placeholders. Photos ship with the site under /images/,
-- so the owner can still replace or reorder everything from the dashboard.
--
-- Mirrored in src/data/site-data.ts (fallback team, founder photo, work photos).

-- ---------- projects ----------

INSERT INTO projects (slug, title, category, location, year, status, summary, body, scope, cover, cover_alt, featured, published, position) VALUES
  ('mvurwi-four-bedroom-home',
   'Four-Bedroom Turnkey Home, Mvurwi',
   'Four-bedroom house',
   'Mvurwi',
   '',
   'Completed',
   'A four-bedroom family home built turnkey, from the slab to fitted kitchen, tiled bathrooms and painted walls, ready for the family to move in.',
   'A turnkey build: Champs handled every stage, from the slab and brickwork to the roof, plaster, plumbing, electrics, tiling and paint, and handed over a house ready to live in.

The face-brick front with its chimney and columned veranda gives the house its character. Inside are four bedrooms with a main en-suite, a separate toilet and bathroom, and an open lounge, dining room and fitted kitchen.

The client followed the build through weekly photo progress reports, from the first course of bricks to the final coat of paint.',
   'Four bedrooms, main en-suite
Separate toilet and bathroom
Lounge, dining room and fitted kitchen
Face-brick front with chimney and veranda columns
Roofing, plaster and paint
Plumbing, electrical and tiling
Turnkey handover',
   '/images/projects/mvurwi/finished-front.jpg',
   'The finished four-bedroom house in Mvurwi with a face-brick front, chimney and black veranda columns',
   1, 1, 1),

  ('bulawayo-three-bedroom-home',
   'Three-Bedroom Home with Garage, Bulawayo',
   'Diaspora home build',
   'Bulawayo',
   '',
   'In Progress',
   'A three-bedroom home with a main en-suite, an open-plan living area and a garage, built for a client abroad who follows every stage through weekly photo reports.',
   'Built for a client living abroad, who sees the house rise through weekly photo progress reports rather than relying on relatives to manage the site.

The house has three bedrooms with a main en-suite, an open-plan lounge, dining room and kitchen, and a garage. The roof is on, the walls are plastered and the windows are in, with the finishes to follow.',
   'Three bedrooms, main en-suite
Open-plan lounge, dining room and kitchen
Garage
Brickwork, roofing and plaster
Windows and doors
Weekly photo progress reports',
   '/images/projects/bulawayo/plastered-roofed.jpg',
   'The plastered three-bedroom house in Bulawayo with its roof on and a water tank beside it',
   1, 1, 2),

  ('completed-family-home',
   'Completed Family Home',
   'Family home',
   '',
   '',
   'Completed',
   'A finished family home with a face-brick entrance, polished floor tiles throughout, a fireplace in the lounge and a fitted kitchen.',
   'A completed home, finished inside and out. Polished porcelain tiles run through the lounge and passages, the lounge has a stone-clad fireplace, and the kitchen is fitted with built-in cupboards and a double sink.

Outside, cream plaster sits on a black plinth, with a face-brick feature at the entrance and dark aluminium windows.',
   'Brickwork, roofing and plaster
Face-brick entrance feature
Aluminium windows
Polished floor tiles throughout
Lounge fireplace
Fitted kitchen',
   '/images/projects/family-home/front.jpg',
   'A completed cream house with a black plinth, dark windows and a face-brick entrance',
   1, 1, 3),

  ('executive-residential-development',
   'Executive Residential Development',
   'Executive home',
   '',
   '',
   'In Progress',
   'A large executive home now under its roof: brick walls up, roof sheets on and the openings ready for windows and doors.',
   'An executive residential build, shown here at superstructure stage. The brickwork is complete, the roof is on, and the Champs team is moving on to windows, doors, plaster and the finishes.

The Champs site board stays up for the whole build, with our numbers on it, so the neighbourhood always knows who is accountable for the work.',
   'Foundations and slab
Brickwork to roof level
Roof trusses and roof sheeting
Windows, doors and plaster to follow',
   '/images/projects/executive/roofing.jpg',
   'Roofers fixing red roof sheets on a large brick executive house',
   0, 1, 4);

-- Each gallery row finds its project by slug, so ids never need to be known here.
INSERT INTO project_images (project_id, url, alt, position) VALUES
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/finished-front.jpg', 'The finished house from the front', 1),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/finished-sunset.jpg', 'The finished house at sunset, showing the veranda columns', 2),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/finished-side.jpg', 'The painted side of the house with the next foundation in front', 3),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/kitchen.jpg', 'Fitted kitchen with white cupboards and a black worktop', 4),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/bathroom.jpg', 'Tiled bathroom and separate toilet', 5),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/bedroom.jpg', 'A bedroom with built-in wardrobes and tiled floor', 6),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/passage.jpg', 'The tiled passage to the bedrooms', 7),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/painting.jpg', 'Painting the exterior before handover', 8),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/plastering.jpg', 'The house plastered, before painting', 9),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/roofing.jpg', 'Roofers fixing the roof sheets', 10),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/roofed-shell.jpg', 'The brick shell under its roof', 11),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/roof-trusses.jpg', 'Roof trusses going up on the brickwork', 12),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/brickwork.jpg', 'Brickwork complete with the roof on', 13),
  ((SELECT id FROM projects WHERE slug = 'mvurwi-four-bedroom-home'), '/images/projects/mvurwi/wall-plate.jpg', 'Checking the walls at wall-plate height', 14),
  ((SELECT id FROM projects WHERE slug = 'bulawayo-three-bedroom-home'), '/images/projects/bulawayo/plastered-roofed.jpg', 'The house plastered and roofed', 1),
  ((SELECT id FROM projects WHERE slug = 'bulawayo-three-bedroom-home'), '/images/projects/bulawayo/inspection.jpg', 'Inspecting the windows on the plastered house', 2),
  ((SELECT id FROM projects WHERE slug = 'bulawayo-three-bedroom-home'), '/images/projects/bulawayo/brickwork.jpg', 'Brickwork and door frames going up', 3),
  ((SELECT id FROM projects WHERE slug = 'bulawayo-three-bedroom-home'), '/images/projects/bulawayo/team.jpg', 'The Champs team on site', 4),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/front.jpg', 'The finished house from the front', 1),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/side.jpg', 'The side of the house with dark aluminium windows', 2),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/rear.jpg', 'The cream plaster and black plinth', 3),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/entrance.jpg', 'The rear entrance and paving', 4),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/lounge.jpg', 'The lounge with a stone-clad fireplace and polished tiles', 5),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/kitchen.jpg', 'The fitted kitchen', 6),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/passage.jpg', 'The tiled passage', 7),
  ((SELECT id FROM projects WHERE slug = 'completed-family-home'), '/images/projects/family-home/hallway.jpg', 'The hallway to the bedrooms', 8),
  ((SELECT id FROM projects WHERE slug = 'executive-residential-development'), '/images/projects/executive/roofing.jpg', 'Roofers fixing the red roof sheets', 1),
  ((SELECT id FROM projects WHERE slug = 'executive-residential-development'), '/images/projects/executive/roofed.jpg', 'The house under its roof', 2),
  ((SELECT id FROM projects WHERE slug = 'executive-residential-development'), '/images/projects/executive/site-board.jpg', 'The Champs site board at the entrance', 3),
  ((SELECT id FROM projects WHERE slug = 'executive-residential-development'), '/images/projects/executive/structure.jpg', 'The brick superstructure before roofing', 4),
  ((SELECT id FROM projects WHERE slug = 'executive-residential-development'), '/images/projects/executive/brickwork.jpg', 'Brickwork going up', 5),
  ((SELECT id FROM projects WHERE slug = 'executive-residential-development'), '/images/projects/executive/team.jpg', 'The Champs team on site', 6);

-- ---------- team ----------

-- Fills the three empty slots from migration 0003, only where the owner has not
-- already named them, then adds the fourth member.
UPDATE team SET name = 'Mr R. Gwenyambira', role = 'Operations Manager',
  photo = '/images/team/r-gwenyambira.jpg', photo_alt = 'Mr R. Gwenyambira in a Champs hard hat'
  WHERE id = 1 AND name = '';
UPDATE team SET name = 'Mr D. Chaleka', role = 'Projects Manager',
  photo = '/images/team/d-chaleka.jpg', photo_alt = 'Mr D. Chaleka in a Champs hard hat'
  WHERE id = 2 AND name = '';
UPDATE team SET name = 'Mr R. Masiya', role = 'Quantity Surveyor',
  photo = '/images/team/r-masiya.jpg', photo_alt = 'Mr R. Masiya in a Champs hard hat and safety jacket'
  WHERE id = 3 AND name = '';
INSERT INTO team (name, role, photo, photo_alt, position)
  SELECT 'Mr M. Marume', 'Admin', '/images/team/m-marume.jpg', 'Mr M. Marume in a Champs hard hat and overalls', 4
  WHERE NOT EXISTS (SELECT 1 FROM team WHERE name = 'Mr M. Marume');

-- ---------- founder photo ----------

INSERT INTO settings (key, value) VALUES ('founder_photo',
  '{"src":"/images/team/r-gwenyambira.jpg","width":503,"height":629,"alt":"Mr R. Gwenyambira, founder of Champs Construction"}')
  ON CONFLICT (key) DO NOTHING;

-- ---------- Before / During / After ----------

-- Swap the three placeholder slots for real photos, leaving any slot the owner has
-- already replaced alone, then add the rest.
UPDATE work_photos SET src = '/images/work/foundation-steel.jpg', width = 1000, height = 750,
  alt = 'Steel reinforcement laid in the foundation trenches', caption = 'Steel reinforcement in the foundations'
  WHERE id = 3 AND src LIKE '/images/placeholders/%';
UPDATE work_photos SET src = '/images/projects/mvurwi/finished-front.jpg', width = 1080, height = 810,
  alt = 'A finished four-bedroom house with a face-brick front and chimney',
  caption = 'Four-bedroom turnkey home, Mvurwi'
  WHERE id = 4 AND src LIKE '/images/placeholders/%';
UPDATE work_photos SET src = '/images/projects/family-home/front.jpg', width = 1000, height = 563,
  alt = 'A completed cream house with a black plinth and dark windows', caption = 'Completed family home'
  WHERE id = 5 AND src LIKE '/images/placeholders/%';

INSERT INTO work_photos (src, width, height, alt, caption, stage, hidden, position) VALUES
  ('/images/work/setting-out.jpg', 1000, 750, 'The Champs team setting out foundation trenches on a cleared stand', 'Setting out the foundations', 'Before', 0, 1),
  ('/images/work/brickwork.jpg', 1000, 750, 'Builders on a brick wall rising from the foundations', 'Brickwork rising', 'During', 0, 4),
  ('/images/work/plastering.jpg', 1000, 750, 'Builders on scaffolding plastering a house with a tiled roof', 'Plastering under a tiled roof', 'During', 0, 5),
  ('/images/projects/mvurwi/kitchen.jpg', 1000, 750, 'A fitted kitchen with white cupboards and a black worktop', 'Fitted kitchen, ready for handover', 'After', 0, 8);

-- Keep the stages in order: Before, During, After.
UPDATE work_photos SET position = 2 WHERE id = 1;
UPDATE work_photos SET position = 6 WHERE id = 2;
UPDATE work_photos SET position = 3 WHERE id = 3;
UPDATE work_photos SET position = 7 WHERE id = 4;
UPDATE work_photos SET position = 9 WHERE id = 5;
