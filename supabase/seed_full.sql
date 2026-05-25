-- Comprehensive Seed Data for All Tables
-- Run this in your Supabase SQL Editor to populate the entire application.
-- It will grab your current user, create a dummy "Neighbor" user, and simulate a full history of interactions (bookings, reviews, messages, etc).

DO $$
DECLARE
  user_a UUID; -- You
  user_b UUID; -- Dummy Neighbor
  listing_1 UUID;
  listing_2 UUID;
  booking_1 UUID;
  booking_2 UUID;
  booking_3 UUID;
BEGIN
  -- 1. Grab your user account (assumes you are the first user to sign up)
  SELECT id INTO user_a FROM profiles ORDER BY created_at ASC LIMIT 1;
  
  IF user_a IS NULL THEN
    RAISE EXCEPTION 'Please sign up for an account in the UI before running this script!';
  END IF;

  -- Ensure you are verified
  UPDATE profiles SET verification_status = 'verified', trust_score = 5.0 WHERE id = user_a;

  -- 2. Create Dummy User B in auth.users
  user_b := gen_random_uuid();
  
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (user_b, 'authenticated', 'authenticated', 'alice.neighbor@example.com', 'dummy_hash', NOW(), '{"provider":"email","providers":["email"]}', '{"display_name": "Alice Neighbor"}')
  ON CONFLICT DO NOTHING;

  -- Explicitly create or update the profile (in case the auth trigger doesn't fire for manual SQL inserts)
  INSERT INTO profiles (id, display_name, email, verification_status, trust_score, avatar_url)
  VALUES (user_b, 'Alice Neighbor', 'alice.neighbor@example.com', 'verified', 4.8, 'https://i.pravatar.cc/150?u=alice')
  ON CONFLICT (id) DO UPDATE 
  SET display_name = 'Alice Neighbor', 
      verification_status = 'verified', 
      trust_score = 4.8, 
      avatar_url = 'https://i.pravatar.cc/150?u=alice';

  -- 3. Verification Docs
  INSERT INTO verification_docs (user_id, id_doc_url, address_doc_url, status)
  VALUES (user_a, 'dummy_id_1.jpg', 'dummy_bill_1.jpg', 'verified'),
         (user_b, 'dummy_id_2.jpg', 'dummy_bill_2.jpg', 'verified');

  -- 4. Listings
  -- User A (You) listing a Pressure Washer
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_a, 'Pro Pressure Washer 3200 PSI', 'Tools', 'Gas powered pressure washer. Cleans driveways perfectly.', 'good', 'daily_fee', 35.00, 150.00, 'active')
  RETURNING id INTO listing_1;

  -- User B (Alice) listing a Tent
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_b, 'Camping Tent 4-Person', 'Sports', 'Easy setup dome tent. Barely used.', 'like_new', 'daily_fee', 15.00, 50.00, 'active')
  RETURNING id INTO listing_2;

  -- 5. Listing Photos
  INSERT INTO listing_photos (listing_id, url, sort_order)
  VALUES (listing_1, '/images/pressure_washer.png', 0),
         (listing_2, '/images/camping_tent.png', 0);

  -- 6. Availability Blocks (Block out next weekend for the washer)
  INSERT INTO availability_blocks (listing_id, start_date, end_date, is_blocked, reason)
  VALUES (listing_1, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', true, 'Maintenance');

  -- 7. Bookings
  -- Booking 1: Alice borrowed your Pressure Washer (Completed)
  INSERT INTO bookings (listing_id, borrower_id, lender_id, start_date, end_date, status, total_amount, deposit_held)
  VALUES (listing_1, user_b, user_a, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 'completed', 70.00, 150.00)
  RETURNING id INTO booking_1;

  -- Booking 2: You want to borrow Alice's Tent (Requested)
  INSERT INTO bookings (listing_id, borrower_id, lender_id, start_date, end_date, status, total_amount, deposit_held, message)
  VALUES (listing_2, user_a, user_b, CURRENT_DATE + INTERVAL '12 days', CURRENT_DATE + INTERVAL '14 days', 'requested', 30.00, 50.00, 'Hi Alice! Going on a quick weekend trip, would love to borrow this.')
  RETURNING id INTO booking_2;

  -- Booking 3: A disputed past booking (Alice borrowed a drill, maybe returned it late)
  INSERT INTO bookings (listing_id, borrower_id, lender_id, start_date, end_date, status, total_amount, deposit_held)
  VALUES (listing_1, user_b, user_a, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '18 days', 'disputed', 70.00, 150.00)
  RETURNING id INTO booking_3;

  -- 8. Booking Photos (Check-in photos)
  INSERT INTO booking_photos (booking_id, type, url, uploaded_by)
  VALUES (booking_1, 'check_in', '/images/pressure_washer.png', user_b);

  -- 9. Payments
  INSERT INTO payments (booking_id, amount, currency, status, type)
  VALUES (booking_1, 70.00, 'usd', 'released', 'rental_fee'),
         (booking_1, 150.00, 'usd', 'refunded', 'deposit');

  -- 10. Reviews
  INSERT INTO reviews (booking_id, reviewer_id, target_id, rating, comment)
  VALUES (booking_1, user_b, user_a, 5, 'Great washer, very powerful. Lender was super nice!'),
         (booking_1, user_a, user_b, 5, 'Alice was great, returned the washer fully fueled.');

  -- 11. Disputes
  INSERT INTO disputes (booking_id, opened_by, reason, description, status)
  VALUES (booking_3, user_a, 'late_return', 'Alice returned the item 3 days late without communicating.', 'open');

  -- 12. Messages
  INSERT INTO messages (booking_id, sender_id, content)
  VALUES (booking_2, user_a, 'Hi Alice, looking forward to camping! Can I pick it up at 5 PM?'),
         (booking_2, user_b, 'Hey! 5 PM works perfectly. See you then.');

END $$;
