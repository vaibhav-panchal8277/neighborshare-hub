-- Run this script in your Supabase SQL Editor AFTER you have signed up for an account!

DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user in the profiles table (which should be you!)
  SELECT id INTO first_user_id FROM profiles LIMIT 1;
  
  IF first_user_id IS NULL THEN
    RAISE NOTICE 'No users found! Please sign up on the website first before running this script.';
  ELSE
    -- 1. Verify the user so they can legally create listings (bypasses the RLS block)
    UPDATE profiles 
    SET verification_status = 'verified', 
        trust_score = 4.9 
    WHERE id = first_user_id;

    -- 2. Insert some dummy listings
    INSERT INTO listings (lender_id, title, category, description, condition, pricing_type, daily_fee, deposit_amount, status, skill_share, location_radius)
    VALUES 
    (first_user_id, 'DeWalt 20V Max Cordless Drill', 'Tools', 'Barely used drill with 2 batteries and charger. Great for home DIY projects.', 'like_new', 'rental', 10.00, 50.00, 'active', false, 2.5),
    (first_user_id, 'Sony A7III Mirrorless Camera', 'Electronics', 'Professional camera with 28-70mm lens. Comes with carrying case and extra battery. Great for weekend shoots.', 'good', 'rental', 45.00, 300.00, 'active', true, 5.0),
    (first_user_id, 'Stand Up Paddle Board', 'Sports', 'Inflatable SUP. Includes pump, paddle, and life vest. Easy to fit in the trunk of any car.', 'good', 'rental', 25.00, 100.00, 'active', false, 1.0),
    (first_user_id, 'KitchenAid Stand Mixer', 'Kitchen', 'Professional series 5 Plus. Includes dough hook and whisk. Perfect for holiday baking!', 'like_new', 'free', 0.00, 150.00, 'active', false, 1.5),
    (first_user_id, 'Folding Trestle Tables (Set of 2)', 'Party', 'Heavy duty 6-foot folding tables. Great for garage sales or backyard parties.', 'fair', 'rental', 8.00, 40.00, 'active', false, 3.0);

    RAISE NOTICE 'Successfully verified user and inserted 5 sample listings!';
  END IF;
END $$;
