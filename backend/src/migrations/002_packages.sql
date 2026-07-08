-- Move the booking catalog from individual experiences to package rows.
-- Run this in Supabase SQL Editor after 001_customer_accounts.sql.

CREATE TABLE IF NOT EXISTS packages (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
  currency      TEXT NOT NULL DEFAULT 'USD',
  duration      TEXT NOT NULL,
  image_url     TEXT NOT NULL DEFAULT '',
  slideshow_images_json TEXT NOT NULL DEFAULT '[]',
  tag           TEXT NOT NULL DEFAULT '',
  included_json TEXT NOT NULL DEFAULT '[]',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF to_regclass('public.experiences') IS NOT NULL THEN
    INSERT INTO packages (
      id,
      title,
      description,
      price_cents,
      currency,
      duration,
      image_url,
      slideshow_images_json,
      tag,
      included_json,
      sort_order,
      is_active,
      created_at,
      updated_at
    )
    SELECT
      id,
      title,
      description,
      price_cents,
      currency,
      duration,
      image_url,
      '[]',
      tag,
      included_json,
      sort_order,
      FALSE,
      created_at,
      updated_at
    FROM experiences
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

INSERT INTO packages (
  id,
  title,
  description,
  price_cents,
  currency,
  duration,
  image_url,
  slideshow_images_json,
  tag,
  included_json,
  sort_order,
  is_active,
  created_at,
  updated_at
)
VALUES
  (
    'half-day-package',
    'Half Day Package',
    'A five-hour cultural visit built around village walks, food, craft, dance, and shared stories.',
    0,
    'USD',
    '5 Hours',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY',
    '[]',
    'Half Day',
    '["Village walks","Traditional cooking","Ekizino","Traditional lunch","Local porridge Bushera preparation","Craft making","Story telling"]',
    0,
    TRUE,
    NOW()::TEXT,
    NOW()::TEXT
  ),
  (
    'full-day-package',
    'Full Day Package',
    'A nine-hour cultural immersion with hands-on making, local food and drink, dance, community walks, and campfire storytelling.',
    0,
    'USD',
    '9 Hours',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY',
    '[]',
    'Full Day',
    '["Craft making","Traditional lunch","Local porridge Bushera","Local beer Omuramba","Dance Ekizino","Cultural activities","Campfire story telling","Community walks"]',
    1,
    TRUE,
    NOW()::TEXT,
    NOW()::TEXT
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  currency = EXCLUDED.currency,
  duration = EXCLUDED.duration,
  image_url = EXCLUDED.image_url,
  slideshow_images_json = EXCLUDED.slideshow_images_json,
  tag = EXCLUDED.tag,
  included_json = EXCLUDED.included_json,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW()::TEXT;

UPDATE packages
SET is_active = FALSE,
    updated_at = NOW()::TEXT
WHERE id IN ('food-cooking', 'storytelling', 'traditional-games', 'attire', 'full-day');

UPDATE bookings
SET experience_id = NULL
WHERE experience_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM packages
    WHERE packages.id = bookings.experience_id
  );

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_experience_id_fkey;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_experience_id_fkey
  FOREIGN KEY (experience_id) REFERENCES packages(id) ON DELETE SET NULL;
