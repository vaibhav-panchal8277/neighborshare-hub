-- 10 Items Seed Script
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
  user_c UUID := gen_random_uuid();
  user_d UUID := gen_random_uuid();
  user_e UUID := gen_random_uuid();

  list_dji UUID;
  list_paddle UUID;
  list_drill UUID;
  list_mixer UUID;
  list_pa UUID;
  list_switch UUID;
  list_bike UUID;
  list_heater UUID;
  list_mower UUID;
  list_ice_cream UUID;

BEGIN
  -----------------------------------------------------------------------------
  -- 1. Create Users
  -----------------------------------------------------------------------------
  
  -- Charlie
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (user_c, 'authenticated', 'authenticated', 'charlie.neighbor@example.com', 'dummy_hash', NOW(), '{"provider":"email","providers":["email"]}', '{"display_name": "Charlie C."}');
  
  INSERT INTO profiles (id, display_name, email, verification_status, trust_score, avatar_url)
  VALUES (user_c, 'Charlie C.', 'charlie.neighbor@example.com', 'verified', 4.9, 'https://i.pravatar.cc/150?u=charlie')
  ON CONFLICT (id) DO UPDATE SET display_name = 'Charlie C.', email = 'charlie.neighbor@example.com', verification_status = 'verified', trust_score = 4.9, avatar_url = 'https://i.pravatar.cc/150?u=charlie';

  -- Diana
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (user_d, 'authenticated', 'authenticated', 'diana.neighbor@example.com', 'dummy_hash', NOW(), '{"provider":"email","providers":["email"]}', '{"display_name": "Diana D."}');
  
  INSERT INTO profiles (id, display_name, email, verification_status, trust_score, avatar_url)
  VALUES (user_d, 'Diana D.', 'diana.neighbor@example.com', 'verified', 5.0, 'https://i.pravatar.cc/150?u=diana')
  ON CONFLICT (id) DO UPDATE SET display_name = 'Diana D.', email = 'diana.neighbor@example.com', verification_status = 'verified', trust_score = 5.0, avatar_url = 'https://i.pravatar.cc/150?u=diana';

  -- Ethan
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (user_e, 'authenticated', 'authenticated', 'ethan.neighbor@example.com', 'dummy_hash', NOW(), '{"provider":"email","providers":["email"]}', '{"display_name": "Ethan E."}');
  
  INSERT INTO profiles (id, display_name, email, verification_status, trust_score, avatar_url)
  VALUES (user_e, 'Ethan E.', 'ethan.neighbor@example.com', 'unverified', 0, 'https://i.pravatar.cc/150?u=ethan')
  ON CONFLICT (id) DO UPDATE SET display_name = 'Ethan E.', email = 'ethan.neighbor@example.com', verification_status = 'unverified', trust_score = 0, avatar_url = 'https://i.pravatar.cc/150?u=ethan';

  -----------------------------------------------------------------------------
  -- 2. Create Listings
  -----------------------------------------------------------------------------

  -- 1. DJI Drone (Charlie)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_c, 'DJI Mavic Pro Drone', 'Electronics', 'Capture stunning 4k aerial footage. Comes with 3 batteries and controller.', 'like_new', 'daily_fee', 45.00, 300.00, 'active')
  RETURNING id INTO list_dji;

  -- 2. Paddleboard (Diana)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_d, 'Inflatable Stand Up Paddleboard', 'Sports', '10.5ft SUP. Includes paddle, leash, and pump. Perfect for the lake!', 'good', 'daily_fee', 25.00, 100.00, 'active')
  RETURNING id INTO list_paddle;

  -- 3. Cordless Drill (Ethan)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_e, 'Makita 18V Cordless Drill', 'Tools', 'Brushless drill, very powerful. Comes with basic drill bit set.', 'good', 'daily_fee', 10.00, 40.00, 'active')
  RETURNING id INTO list_drill;

  -- 4. Stand Mixer (Charlie)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_c, 'KitchenAid Artisan Stand Mixer', 'Kitchen', 'Cherry red. Includes dough hook and whisk. Makes baking a breeze.', 'like_new', 'daily_fee', 20.00, 150.00, 'active')
  RETURNING id INTO list_mixer;

  -- 5. PA System (Diana)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_d, 'Portable PA Speaker System', 'Party', 'Loud bluetooth speaker with a wireless microphone. Great for backyard parties.', 'good', 'daily_fee', 35.00, 100.00, 'active')
  RETURNING id INTO list_pa;

  -- 6. Nintendo Switch (Ethan)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_e, 'Nintendo Switch Console', 'Electronics', 'Comes with dock, joycons, and Mario Kart 8.', 'fair', 'daily_fee', 15.00, 150.00, 'active')
  RETURNING id INTO list_switch;

  -- 7. Mountain Bike (Charlie)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_c, 'Trek Mountain Bike (Size M)', 'Sports', '21 speed mountain bike. Helmet and lock included.', 'good', 'daily_fee', 20.00, 80.00, 'active')
  RETURNING id INTO list_bike;

  -- 8. Patio Heater (Diana)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_d, 'Outdoor Patio Heater (Gas)', 'Party', 'Keep your guests warm. Propane tank included but you must refill it if empty.', 'good', 'daily_fee', 30.00, 100.00, 'active')
  RETURNING id INTO list_heater;

  -- 9. Lawn Mower (Ethan)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_e, 'Honda Gas Lawn Mower', 'Tools', 'Self-propelled push mower. Starts on first pull.', 'fair', 'daily_fee', 25.00, 50.00, 'active')
  RETURNING id INTO list_mower;

  -- 10. Ice Cream Maker (Charlie)
  INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status)
  VALUES (user_c, 'Cuisinart Ice Cream Maker', 'Kitchen', '2 Quart capacity. Freeze the bowl overnight before using!', 'like_new', 'daily_fee', 10.00, 30.00, 'active')
  RETURNING id INTO list_ice_cream;

  -----------------------------------------------------------------------------
  -- 3. Link the Generated Photos
  -----------------------------------------------------------------------------

  INSERT INTO listing_photos (listing_id, url, sort_order)
  VALUES 
    (list_dji, '/images/dji_drone.png', 0),
    (list_paddle, '/images/paddleboard.png', 0),
    (list_drill, '/images/cordless_drill.png', 0),
    (list_mixer, '/images/stand_mixer.png', 0),
    (list_pa, '/images/pa_system.png', 0),
    (list_switch, '/images/nintendo_switch.png', 0),
    (list_bike, '/images/mountain_bike.png', 0),
    (list_heater, '/images/patio_heater.png', 0),
    (list_mower, '/images/lawn_mower.png', 0),
    (list_ice_cream, '/images/ice_cream_maker.png', 0);

END $$;
