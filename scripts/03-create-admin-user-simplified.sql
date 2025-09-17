-- Create admin user for Loyola School Memories App (Simplified)
-- This script creates the admin_users table entry
-- The actual auth user should be created via Supabase Auth signup

-- Create corresponding admin_users record for the admin
-- Note: The admin should first sign up via the normal Supabase Auth flow
-- Then this record links them as an admin user

-- You can run this after the admin signs up with email: adam@bytebasetech.com
INSERT INTO admin_users (email, full_name, is_active)
VALUES (
  'adam@bytebasetech.com',
  'Admin User',
  true
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Alternative: If you want to create the auth user programmatically,
-- you can use Supabase's admin API or the dashboard to create the user first,
-- then run this script to make them an admin.
