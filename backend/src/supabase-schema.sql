-- ============================================================
-- Ekika Backend – Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ── Site Settings ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,
  short_name    TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone_display TEXT NOT NULL,
  phone_href    TEXT NOT NULL,
  whatsapp_url  TEXT NOT NULL,
  address_json  TEXT NOT NULL DEFAULT '[]',
  location_label TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- ── Experiences ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
  currency      TEXT NOT NULL DEFAULT 'USD',
  duration      TEXT NOT NULL,
  image_url     TEXT NOT NULL DEFAULT '',
  tag           TEXT NOT NULL DEFAULT '',
  included_json TEXT NOT NULL DEFAULT '[]',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;

-- ── Customers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                 TEXT PRIMARY KEY,
  portal_token_hash  TEXT NOT NULL UNIQUE,
  customer_id        TEXT REFERENCES customers(id) ON DELETE SET NULL,
  experience_id      TEXT REFERENCES experiences(id) ON DELETE SET NULL,
  experience_title   TEXT NOT NULL,
  unit_price_cents   INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  experience_image   TEXT NOT NULL DEFAULT '',
  guest_name         TEXT NOT NULL,
  email              TEXT NOT NULL,
  phone              TEXT NOT NULL,
  guest_count        INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 100),
  preferred_date     TEXT NOT NULL,
  special_requests   TEXT NOT NULL DEFAULT '',
  payment_choice     TEXT NOT NULL CHECK (payment_choice IN ('deposit', 'full')),
  booking_status     TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status     TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  total_cents        INTEGER NOT NULL CHECK (total_cents >= 0),
  amount_due_cents   INTEGER NOT NULL CHECK (amount_due_cents >= 0),
  currency           TEXT NOT NULL DEFAULT 'USD',
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bookings_created_at   ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_email        ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_date         ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id  ON bookings(customer_id);

-- ── Payments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                 TEXT PRIMARY KEY,
  booking_id         TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider           TEXT NOT NULL,
  method             TEXT NOT NULL CHECK (method IN ('mobile-money', 'card', 'bank')),
  amount_cents       INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency           TEXT NOT NULL,
  status             TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  provider_reference TEXT UNIQUE,
  idempotency_key    TEXT UNIQUE,
  metadata_json      TEXT NOT NULL DEFAULT '{}',
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

-- ── Gallery Items ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  tag        TEXT,
  image_url  TEXT NOT NULL,
  alt_text   TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
ALTER TABLE gallery_items DISABLE ROW LEVEL SECURITY;

-- ── Inquiries ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- ── Admins ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- ── Audit Log ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          TEXT PRIMARY KEY,
  admin_id    TEXT REFERENCES admins(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at  TEXT NOT NULL
);
ALTER TABLE audit_log DISABLE ROW LEVEL SECURITY;

-- ── Customer Sessions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_sessions (
  id          TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TEXT NOT NULL,
  revoked_at  TEXT,
  created_at  TEXT NOT NULL,
  last_used_at TEXT NOT NULL
);
ALTER TABLE customer_sessions DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_customer_sessions_customer ON customer_sessions(customer_id);

-- ── Portal Sessions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portal_sessions (
  id          TEXT PRIMARY KEY,
  booking_id  TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TEXT NOT NULL,
  revoked_at  TEXT,
  created_at  TEXT NOT NULL,
  last_used_at TEXT NOT NULL
);
ALTER TABLE portal_sessions DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_portal_sessions_booking ON portal_sessions(booking_id);

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id               TEXT PRIMARY KEY,
  reviewer_name    TEXT NOT NULL,
  reviewer_photo   TEXT NOT NULL DEFAULT '',
  experience_title TEXT NOT NULL DEFAULT '',
  rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT NOT NULL,
  is_active        INTEGER NOT NULL DEFAULT 1,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_reviews_sort ON reviews(sort_order ASC, created_at DESC);
