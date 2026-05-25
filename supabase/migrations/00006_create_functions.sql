-- ============================================================
-- NeighborShare Hub — Migration 00006: Create Functions & Triggers
-- ============================================================
-- Database functions for auth hooks, trust score calculation,
-- and availability checking.
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- 1. Auto-create profile on user signup
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires after every new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════
-- 2. Calculate trust score for a user
-- ═══════════════════════════════════════════════════════════
-- Formula: weighted combination of:
--   • Average review rating (40%)
--   • Booking completion rate (30%)
--   • Verification level (20%)
--   • Account age factor (10%)
-- Returns a score between 0.00 and 5.00
CREATE OR REPLACE FUNCTION calculate_trust_score(target_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_rating NUMERIC;
  completion_rate NUMERIC;
  verification_bonus NUMERIC;
  age_factor NUMERIC;
  total_bookings INTEGER;
  completed_bookings INTEGER;
  account_age_days INTEGER;
  score NUMERIC;
BEGIN
  -- Average review rating (0-5)
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM reviews
  WHERE target_id = target_user_id;

  -- Booking completion rate (0-1)
  SELECT COUNT(*) INTO total_bookings
  FROM bookings
  WHERE (borrower_id = target_user_id OR lender_id = target_user_id)
  AND status IN ('completed', 'cancelled', 'disputed');

  SELECT COUNT(*) INTO completed_bookings
  FROM bookings
  WHERE (borrower_id = target_user_id OR lender_id = target_user_id)
  AND status = 'completed';

  IF total_bookings > 0 THEN
    completion_rate := completed_bookings::NUMERIC / total_bookings;
  ELSE
    completion_rate := 0;
  END IF;

  -- Verification bonus (0 or 1)
  SELECT CASE
    WHEN verification_status = 'verified' THEN 1.0
    WHEN verification_status = 'pending' THEN 0.3
    ELSE 0.0
  END INTO verification_bonus
  FROM profiles
  WHERE id = target_user_id;

  -- Account age factor (capped at 1.0 after 180 days)
  SELECT LEAST(
    EXTRACT(DAY FROM now() - created_at)::NUMERIC / 180.0,
    1.0
  ) INTO age_factor
  FROM profiles
  WHERE id = target_user_id;

  -- Weighted score (max 5.0)
  score := (
    (avg_rating * 0.40) +
    (completion_rate * 5.0 * 0.30) +
    (verification_bonus * 5.0 * 0.20) +
    (age_factor * 5.0 * 0.10)
  );

  -- Clamp between 0.00 and 5.00
  score := GREATEST(0.00, LEAST(5.00, ROUND(score, 2)));

  -- Update the user's trust_score in profiles
  UPDATE profiles SET trust_score = score WHERE id = target_user_id;

  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════
-- 3. Check listing availability for a date range
-- ═══════════════════════════════════════════════════════════
-- Returns TRUE if the listing is available for the given dates
CREATE OR REPLACE FUNCTION check_availability(
  target_listing_id UUID,
  check_start DATE,
  check_end DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  has_conflict BOOLEAN;
BEGIN
  -- Check for blocked availability dates
  SELECT EXISTS (
    SELECT 1 FROM availability_blocks
    WHERE listing_id = target_listing_id
    AND is_blocked = true
    AND start_date <= check_end
    AND end_date >= check_start
  ) INTO has_conflict;

  IF has_conflict THEN
    RETURN FALSE;
  END IF;

  -- Check for existing active bookings in the date range
  SELECT EXISTS (
    SELECT 1 FROM bookings
    WHERE listing_id = target_listing_id
    AND status IN ('requested', 'approved', 'pending_pickup', 'active')
    AND start_date <= check_end
    AND end_date >= check_start
  ) INTO has_conflict;

  RETURN NOT has_conflict;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ═══════════════════════════════════════════════════════════
-- 4. Auto-recalculate trust score after review
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION recalculate_trust_on_review()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_trust_score(NEW.target_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_trust_on_review();

CREATE OR REPLACE TRIGGER on_review_updated
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_trust_on_review();
