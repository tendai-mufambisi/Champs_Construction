-- The Burbs is 3 km from Chivhu, not 5 km, and gains a deposit option. These only
-- touch rows the dashboard has already saved; a database without them shows the new
-- fallback values from src/lib/site-data.ts. MCM Estates, Marondera needs no rows:
-- its fallback values are the owner's figures, and the section is on by default.

UPDATE settings SET value = '3 km from Chivhu City Centre, along Murambinda Road', updated_at = datetime('now')
  WHERE key = 'burbs_location';
UPDATE settings SET value = '$8,000, paid within 12 months', updated_at = datetime('now')
  WHERE key = 'burbs_cash_plan';
UPDATE settings SET value = '$200/month for 5 years', updated_at = datetime('now')
  WHERE key = 'burbs_terms_plan';
INSERT INTO settings (key, value) VALUES
  ('burbs_deposit_plan', 'At least $2,000 down, balance within 12 months')
  ON CONFLICT(key) DO NOTHING;
