-- Run this in your Supabase SQL Editor to force-confirm all emails
-- This will instantly bypass the "Email not confirmed" error!

UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

