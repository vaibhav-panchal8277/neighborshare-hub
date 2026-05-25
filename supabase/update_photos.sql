-- Run this in the Supabase SQL Editor to fix the broken image URL!

UPDATE listing_photos 
SET url = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80' 
WHERE url LIKE '%1504280390227%';
