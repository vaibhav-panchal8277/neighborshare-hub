-- ============================================================
-- NeighborShare Hub — Migration 00005: Create Views
-- ============================================================
-- Public-safe views that expose only non-PII columns.
-- Use these views in client queries instead of the raw tables
-- when displaying other users' information.
-- ============================================================

-- ─── Public Profiles View ──────────────────────────────────
-- Exposes only safe, non-PII columns for displaying other users.
-- Components like ListingCard, ReviewCard, TrustBadge use this view.
-- NEVER exposes: email, phone, stripe_account_id, notification_preferences
CREATE VIEW public_profiles AS
SELECT
  id,
  display_name,
  avatar_url,
  role,
  bio,
  verification_status,
  trust_score,
  created_at
FROM profiles;

GRANT SELECT ON public_profiles TO authenticated, anon;

-- ─── Listing Summary View ──────────────────────────────────
-- Pre-joined view for listing cards (avoids N+1 on search page)
CREATE VIEW listing_summaries AS
SELECT
  l.id,
  l.title,
  l.category,
  l.condition,
  l.pricing_type,
  l.daily_fee,
  l.deposit_amount,
  l.skill_share,
  l.address_hint,
  l.lat,
  l.lng,
  l.status,
  l.views_count,
  l.created_at,
  p.display_name AS lender_name,
  p.avatar_url AS lender_avatar,
  p.trust_score AS lender_trust_score,
  p.verification_status AS lender_verification_status,
  (
    SELECT url FROM listing_photos lp
    WHERE lp.listing_id = l.id
    ORDER BY lp.sort_order ASC
    LIMIT 1
  ) AS thumbnail_url
FROM listings l
JOIN profiles p ON p.id = l.lender_id
WHERE l.status = 'active';

GRANT SELECT ON listing_summaries TO authenticated, anon;
