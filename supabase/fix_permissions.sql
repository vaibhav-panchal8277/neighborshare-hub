-- Fix Anonymous Read Access for the Browse Page
-- Run this in your Supabase SQL Editor

-- 1. Grant SELECT to the 'anon' role for the views
GRANT SELECT ON public_profiles TO anon;
GRANT SELECT ON listing_summaries TO anon;

-- 2. Drop the restrictive policies that blocked anon
DROP POLICY IF EXISTS "listings_select" ON listings;
DROP POLICY IF EXISTS "listing_photos_select" ON listing_photos;

-- 3. Recreate the policies WITHOUT "TO authenticated", which defaults to PUBLIC (both anon and authenticated)
CREATE POLICY "listings_select"
  ON listings FOR SELECT
  USING (
    status = 'active'
    OR lender_id = (SELECT auth.uid())
    OR is_admin()
  );

CREATE POLICY "listing_photos_select"
  ON listing_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_photos.listing_id
      AND (listings.status = 'active' OR listings.lender_id = (SELECT auth.uid()) OR is_admin())
    )
  );

