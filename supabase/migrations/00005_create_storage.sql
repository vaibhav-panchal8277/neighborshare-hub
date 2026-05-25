-- Create the storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing_images', 'listing_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
-- Allow public read access
CREATE POLICY "Public Read Access for Listing Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing_images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Users can Upload Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing_images' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can Delete their Own Images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing_images' AND
    auth.uid() = owner
  );
