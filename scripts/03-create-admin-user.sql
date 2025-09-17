-- Create admin user for Loyola School Memories App
-- This script creates the admin user with specified credentials

-- Insert admin user (password will be hashed by Supabase Auth)
-- Note: This creates a user in auth.users table via Supabase Auth
-- The password 'Loyo@##!' will be hashed automatically

-- First, we need to create the user via Supabase Auth API
-- This SQL creates a corresponding record in our admin_users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'adam@bytebasetech.com',
  crypt('Loyo@##!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create corresponding admin_users record
INSERT INTO admin_users (email, password_hash, full_name, is_active)
VALUES (
  'adam@bytebasetech.com',
  crypt('Loyo@##!', gen_salt('bf')),
  'Admin User',
  true
);
