-- Update the photos to use our newly generated local images!
-- Run this in the Supabase SQL Editor.

-- Update Pressure Washer Photo
UPDATE listing_photos 
SET url = '/images/pressure_washer.png' 
WHERE url LIKE '%1584824486516%';

-- Update Camping Tent Photo
UPDATE listing_photos 
SET url = '/images/camping_tent.png' 
WHERE url LIKE '%1504280390227%';

-- Update the check-in photo for the booking as well
UPDATE booking_photos 
SET url = '/images/pressure_washer.png' 
WHERE url LIKE '%1584824486516%';
