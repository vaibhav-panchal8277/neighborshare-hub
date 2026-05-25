-- ============================================================
-- NeighborShare Hub — Migration 00003: Create Indexes
-- ============================================================
-- Performance-critical indexes for RLS policies, search queries,
-- dashboard lookups, and pagination patterns.
-- ============================================================

-- ─── Profiles ──────────────────────────────────────────────
CREATE INDEX idx_profiles_verification_status ON profiles (verification_status);
CREATE INDEX idx_profiles_role ON profiles (role);
CREATE INDEX idx_profiles_trust_score ON profiles (trust_score DESC);

-- ─── Verification Docs ─────────────────────────────────────
CREATE INDEX idx_verification_docs_user_id ON verification_docs (user_id);
CREATE INDEX idx_verification_docs_status ON verification_docs (status);
CREATE INDEX idx_verification_docs_pending ON verification_docs (status) WHERE status = 'pending';

-- ─── Listings ──────────────────────────────────────────────
CREATE INDEX idx_listings_lender_id ON listings (lender_id);
CREATE INDEX idx_listings_category ON listings (category);
CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_listings_pricing_type ON listings (pricing_type);
CREATE INDEX idx_listings_active ON listings (status, category) WHERE status = 'active';
CREATE INDEX idx_listings_location ON listings (lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
CREATE INDEX idx_listings_skill_share ON listings (skill_share) WHERE skill_share = true;
CREATE INDEX idx_listings_created_at ON listings (created_at DESC);

-- ─── Listing Photos ────────────────────────────────────────
CREATE INDEX idx_listing_photos_listing_id ON listing_photos (listing_id);
CREATE INDEX idx_listing_photos_sort ON listing_photos (listing_id, sort_order);

-- ─── Availability Blocks ───────────────────────────────────
CREATE INDEX idx_availability_blocks_listing_id ON availability_blocks (listing_id);
CREATE INDEX idx_availability_blocks_dates ON availability_blocks (listing_id, start_date, end_date);

-- ─── Bookings ──────────────────────────────────────────────
CREATE INDEX idx_bookings_borrower_id ON bookings (borrower_id);
CREATE INDEX idx_bookings_lender_id ON bookings (lender_id);
CREATE INDEX idx_bookings_listing_id ON bookings (listing_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_dates ON bookings (listing_id, start_date, end_date);
CREATE INDEX idx_bookings_active ON bookings (status) WHERE status IN ('requested', 'approved', 'pending_pickup', 'active');
CREATE INDEX idx_bookings_created_at ON bookings (created_at DESC);

-- ─── Booking Photos ────────────────────────────────────────
CREATE INDEX idx_booking_photos_booking_id ON booking_photos (booking_id);
CREATE INDEX idx_booking_photos_type ON booking_photos (booking_id, type);

-- ─── Payments ──────────────────────────────────────────────
CREATE INDEX idx_payments_booking_id ON payments (booking_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_stripe_intent ON payments (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- ─── Reviews ───────────────────────────────────────────────
CREATE INDEX idx_reviews_booking_id ON reviews (booking_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews (reviewer_id);
CREATE INDEX idx_reviews_target_id ON reviews (target_id);
CREATE INDEX idx_reviews_target_rating ON reviews (target_id, rating);

-- ─── Disputes ──────────────────────────────────────────────
CREATE INDEX idx_disputes_booking_id ON disputes (booking_id);
CREATE INDEX idx_disputes_opened_by ON disputes (opened_by);
CREATE INDEX idx_disputes_status ON disputes (status);
CREATE INDEX idx_disputes_open ON disputes (status) WHERE status IN ('open', 'under_review');

-- ─── Messages ──────────────────────────────────────────────
CREATE INDEX idx_messages_booking_id ON messages (booking_id);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_booking_chat ON messages (booking_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages (booking_id, read_at) WHERE read_at IS NULL;
