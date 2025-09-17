-- Setup Storage policies for Loyola School Memories App
-- This script creates storage bucket and RLS policies for file uploads

-- Create storage bucket for photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for photos bucket
-- Allow public read access to photos
CREATE POLICY "Allow public read access to photos bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

-- Allow authenticated admin users to upload photos
CREATE POLICY "Allow admin upload to photos bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Allow authenticated admin users to update photos
CREATE POLICY "Allow admin update in photos bucket" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'photos' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Allow authenticated admin users to delete photos
CREATE POLICY "Allow admin delete from photos bucket" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'photos' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );
