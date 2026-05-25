-- ============================================================
-- NeighborShare Hub — Migration 00002: Create Tables
-- ============================================================
-- 11 core tables. RLS is ENABLED on every table immediately.
-- Foreign keys reference auth.users(id) for user-owned tables.
-- ============================================================

-- ─── 1. Profiles (extends auth.users) ──────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'borrower',
  display_name  TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  email         TEXT,
  phone         TEXT,
  bio           TEXT DEFAULT '',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  trust_score   NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  stripe_account_id TEXT,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ─── 2. Verification Documents ─────────────────────────────
CREATE TABLE verification_docs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  id_doc_url      TEXT,
  address_doc_url TEXT,
  sponsor_code    TEXT,
  status          verification_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE verification_docs ENABLE ROW LEVEL SECURITY;

-- ─── 3. Listings ───────────────────────────────────────────
CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  condition       listing_condition NOT NULL DEFAULT 'good',
  rules           TEXT[] DEFAULT '{}',
  pricing_type    pricing_type NOT NULL DEFAULT 'free',
  daily_fee       NUMERIC(10, 2) DEFAULT 0.00,
  deposit_amount  NUMERIC(10, 2) DEFAULT 0.00,
  skill_share     BOOLEAN NOT NULL DEFAULT false,
  skill_share_description TEXT,
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  location_radius NUMERIC(5, 2) DEFAULT 1.00, -- miles
  address_hint    TEXT, -- e.g. "Downtown Portland" (never exact until booking confirmed)
  status          listing_status NOT NULL DEFAULT 'draft',
  views_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT positive_daily_fee CHECK (daily_fee >= 0),
  CONSTRAINT positive_deposit CHECK (deposit_amount >= 0),
  CONSTRAINT valid_location_radius CHECK (location_radius > 0 AND location_radius <= 50)
);
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- ─── 4. Listing Photos ────────────────────────────────────
CREATE TABLE listing_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;

-- ─── 5. Availability Blocks ───────────────────────────────
CREATE TABLE availability_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_blocked  BOOLEAN NOT NULL DEFAULT true, -- true = unavailable, false = explicitly available
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- ─── 6. Bookings ──────────────────────────────────────────
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  borrower_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  lender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  status          booking_status NOT NULL DEFAULT 'requested',
  total_amount    NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  deposit_held    NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  insurance_fee   NUMERIC(10, 2) DEFAULT 0.00,
  purpose         TEXT,
  experience_level TEXT,
  message         TEXT,
  decline_reason  TEXT,
  checkin_confirmed_at  TIMESTAMPTZ,
  checkout_confirmed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_booking_dates CHECK (end_date >= start_date),
  CONSTRAINT borrower_not_lender CHECK (borrower_id != lender_id),
  CONSTRAINT positive_amounts CHECK (total_amount >= 0 AND deposit_held >= 0)
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ─── 7. Booking Photos (Check-in / Check-out) ────────────
CREATE TABLE booking_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  type        photo_type NOT NULL,
  url         TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  notes       TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE booking_photos ENABLE ROW LEVEL SECURITY;

-- ─── 8. Payments ──────────────────────────────────────────
CREATE TABLE payments (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id              UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id      TEXT,
  amount                  NUMERIC(10, 2) NOT NULL,
  currency                TEXT NOT NULL DEFAULT 'usd',
  status                  payment_status NOT NULL DEFAULT 'pending',
  type                    payment_type NOT NULL,
  metadata                JSONB DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT positive_payment_amount CHECK (amount > 0)
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ─── 9. Reviews ───────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  comment     TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Each user can only review once per booking
  CONSTRAINT unique_review_per_booking UNIQUE (booking_id, reviewer_id),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT reviewer_not_target CHECK (reviewer_id != target_id)
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ─── 10. Disputes ─────────────────────────────────────────
CREATE TABLE disputes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  opened_by         UUID NOT NULL REFERENCES profiles(id),
  reason            TEXT NOT NULL,
  description       TEXT,
  evidence_urls     TEXT[] DEFAULT '{}',
  status            dispute_status NOT NULL DEFAULT 'open',
  resolution_type   TEXT, -- 'full_refund', 'partial_refund', 'no_refund', 'insurance_claim'
  resolution_notes  TEXT,
  resolution_amount NUMERIC(10, 2),
  resolved_by       UUID REFERENCES profiles(id),
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One active dispute per booking
  CONSTRAINT one_dispute_per_booking UNIQUE (booking_id)
);
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- ─── 11. Messages (Booking-scoped chat) ───────────────────
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ─── Updated_at Trigger Function ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_verification_docs_updated_at
  BEFORE UPDATE ON verification_docs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
