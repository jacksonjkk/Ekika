-- Customer accounts and authenticated booking ownership.
-- Safe to run more than once in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.customers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS customer_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_customer_id_fkey'
      AND conrelid = 'public.bookings'::regclass
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_customer_id_fkey
      FOREIGN KEY (customer_id)
      REFERENCES public.customers(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id
  ON public.bookings(customer_id);

CREATE TABLE IF NOT EXISTS public.customer_sessions (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT NOT NULL,
  token_hash   TEXT NOT NULL UNIQUE,
  expires_at   TEXT NOT NULL,
  revoked_at   TEXT,
  created_at   TEXT NOT NULL,
  last_used_at TEXT NOT NULL,
  CONSTRAINT customer_sessions_customer_id_fkey
    FOREIGN KEY (customer_id)
    REFERENCES public.customers(id)
    ON DELETE CASCADE
);

ALTER TABLE public.customer_sessions DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_customer_sessions_customer
  ON public.customer_sessions(customer_id);

