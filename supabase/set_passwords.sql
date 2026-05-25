-- Run this in the Supabase SQL Editor

-- 1. Add a temporary column to profiles just for testing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS testing_password TEXT;

-- 2. Update the encrypted password in the secure auth.users table
UPDATE auth.users 
SET encrypted_password = crypt('password123', gen_salt('bf'))
WHERE email LIKE '%@example.com';

-- 3. Save the plain-text password in the profiles table so you can see it in the Table Editor
UPDATE profiles
SET testing_password = 'password123'
WHERE email LIKE '%@example.com';
