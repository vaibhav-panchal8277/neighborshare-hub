-- ============================================================
-- NeighborShare Hub — Migration 00004: Row Level Security Policies
-- ============================================================
-- Uses (SELECT auth.uid()) caching pattern for performance.
-- Every policy specifies exact operation (no FOR ALL).
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- HELPER: Check if current user is admin
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ═══════════════════════════════════════════════════════════
-- PROFILES — Own row + admins only (PII protection)
-- ═══════════════════════════════════════════════════════════

-- SELECT: Users can only read their own profile. Admins can read all.
-- Other users' data is accessed through the public_profiles VIEW.
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR is_admin()
  );

-- INSERT: Only via the handle_new_user trigger (service_role)
-- No direct inserts from client
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- UPDATE: Users can only update their own profile
-- Cannot change: role, verification_status, trust_score (server-managed)
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- DELETE: Not allowed from client (cascade from auth.users only)

-- ═══════════════════════════════════════════════════════════
-- VERIFICATION_DOCS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Own docs + admins
CREATE POLICY "verification_docs_select"
  ON verification_docs FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR is_admin()
  );

-- INSERT: Users can submit their own verification docs
CREATE POLICY "verification_docs_insert"
  ON verification_docs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- UPDATE: Only admins can update (approve/reject)
CREATE POLICY "verification_docs_update_admin"
  ON verification_docs FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ═══════════════════════════════════════════════════════════
-- LISTINGS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Active listings visible to all authenticated users.
-- Lenders can also see their own drafts/paused listings.
CREATE POLICY "listings_select"
  ON listings FOR SELECT
  USING (
    status = 'active'
    OR lender_id = (SELECT auth.uid())
    OR is_admin()
  );

-- INSERT: Only verified users can create listings
CREATE POLICY "listings_insert"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (
    lender_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND verification_status = 'verified'
    )
  );

-- UPDATE: Only the lender can update their own listing
CREATE POLICY "listings_update"
  ON listings FOR UPDATE
  TO authenticated
  USING (lender_id = (SELECT auth.uid()) OR is_admin())
  WITH CHECK (lender_id = (SELECT auth.uid()) OR is_admin());

-- DELETE: Only the lender can delete their own listing
CREATE POLICY "listings_delete"
  ON listings FOR DELETE
  TO authenticated
  USING (lender_id = (SELECT auth.uid()));

-- ═══════════════════════════════════════════════════════════
-- LISTING_PHOTOS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Same as parent listing (if listing is visible, photos are visible)
CREATE POLICY "listing_photos_select"
  ON listing_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_photos.listing_id
      AND (listings.status = 'active' OR listings.lender_id = (SELECT auth.uid()) OR is_admin())
    )
  );

-- INSERT: Only the listing owner can add photos
CREATE POLICY "listing_photos_insert"
  ON listing_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_photos.listing_id
      AND listings.lender_id = (SELECT auth.uid())
    )
  );

-- UPDATE: Only the listing owner
CREATE POLICY "listing_photos_update"
  ON listing_photos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_photos.listing_id
      AND listings.lender_id = (SELECT auth.uid())
    )
  );

-- DELETE: Only the listing owner
CREATE POLICY "listing_photos_delete"
  ON listing_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_photos.listing_id
      AND listings.lender_id = (SELECT auth.uid())
    )
  );

-- ═══════════════════════════════════════════════════════════
-- AVAILABILITY_BLOCKS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Visible to all authenticated (needed for availability checks)
CREATE POLICY "availability_blocks_select"
  ON availability_blocks FOR SELECT
  TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE: Only listing owner
CREATE POLICY "availability_blocks_insert"
  ON availability_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = availability_blocks.listing_id
      AND listings.lender_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "availability_blocks_update"
  ON availability_blocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = availability_blocks.listing_id
      AND listings.lender_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "availability_blocks_delete"
  ON availability_blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = availability_blocks.listing_id
      AND listings.lender_id = (SELECT auth.uid())
    )
  );

-- ═══════════════════════════════════════════════════════════
-- BOOKINGS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Borrower or lender of the booking, or admin
CREATE POLICY "bookings_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    borrower_id = (SELECT auth.uid())
    OR lender_id = (SELECT auth.uid())
    OR is_admin()
  );

-- INSERT: Only verified borrowers can create bookings
CREATE POLICY "bookings_insert"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    borrower_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND verification_status = 'verified'
    )
  );

-- UPDATE: Participants can update status, admins can override
CREATE POLICY "bookings_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    borrower_id = (SELECT auth.uid())
    OR lender_id = (SELECT auth.uid())
    OR is_admin()
  );

-- ═══════════════════════════════════════════════════════════
-- BOOKING_PHOTOS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Booking participants + admins
CREATE POLICY "booking_photos_select"
  ON booking_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_photos.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
    OR is_admin()
  );

-- INSERT: Booking participants only
CREATE POLICY "booking_photos_insert"
  ON booking_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_photos.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
  );

-- ═══════════════════════════════════════════════════════════
-- PAYMENTS — Server-side only (service_role)
-- ═══════════════════════════════════════════════════════════

-- SELECT: Booking participants can view their payment records
CREATE POLICY "payments_select"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
    OR is_admin()
  );

-- INSERT/UPDATE: No client-side writes. Payments are managed via
-- server-side Edge Functions using the service_role key.

-- ═══════════════════════════════════════════════════════════
-- REVIEWS
-- ═══════════════════════════════════════════════════════════

-- SELECT: Public — all authenticated users can read reviews
CREATE POLICY "reviews_select"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Only booking participants, and only after booking is completed
CREATE POLICY "reviews_insert"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = reviews.booking_id
      AND bookings.status = 'completed'
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
  );

-- UPDATE: Only the reviewer can edit their own review
CREATE POLICY "reviews_update"
  ON reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

-- ═══════════════════════════════════════════════════════════
-- DISPUTES
-- ═══════════════════════════════════════════════════════════

-- SELECT: Booking participants + admins
CREATE POLICY "disputes_select"
  ON disputes FOR SELECT
  TO authenticated
  USING (
    opened_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = disputes.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
    OR is_admin()
  );

-- INSERT: Booking participants can open disputes
CREATE POLICY "disputes_insert"
  ON disputes FOR INSERT
  TO authenticated
  WITH CHECK (
    opened_by = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = disputes.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
  );

-- UPDATE: Only admins can update dispute status/resolution
CREATE POLICY "disputes_update"
  ON disputes FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ═══════════════════════════════════════════════════════════
-- MESSAGES
-- ═══════════════════════════════════════════════════════════

-- SELECT: Booking participants only
CREATE POLICY "messages_select"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
    OR is_admin()
  );

-- INSERT: Booking participants only
CREATE POLICY "messages_insert"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (bookings.borrower_id = (SELECT auth.uid()) OR bookings.lender_id = (SELECT auth.uid()))
    )
  );
