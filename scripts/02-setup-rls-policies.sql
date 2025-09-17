-- Setup Row Level Security (RLS) policies for Loyola School Memories App
-- This script enables RLS and creates policies for secure data access

-- Enable RLS on albums table
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Enable RLS on photos table  
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for albums table
-- Allow public read access to albums
CREATE POLICY "Allow public read access to albums" ON albums
  FOR SELECT USING (true);

-- Allow authenticated admin users to insert albums
CREATE POLICY "Allow admin insert on albums" ON albums
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Allow authenticated admin users to update albums
CREATE POLICY "Allow admin update on albums" ON albums
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Allow authenticated admin users to delete albums
CREATE POLICY "Allow admin delete on albums" ON albums
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for photos table
-- Allow public read access to photos
CREATE POLICY "Allow public read access to photos" ON photos
  FOR SELECT USING (true);

-- Allow authenticated admin users to insert photos
CREATE POLICY "Allow admin insert on photos" ON photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Allow authenticated admin users to update photos
CREATE POLICY "Allow admin update on photos" ON photos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Allow authenticated admin users to delete photos
CREATE POLICY "Allow admin delete on photos" ON photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for admin_users table
-- Only allow users to read their own data
CREATE POLICY "Users can read own data" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Only allow users to update their own data
CREATE POLICY "Users can update own data" ON admin_users
  FOR UPDATE USING (auth.uid() = id);
