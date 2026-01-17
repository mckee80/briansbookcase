-- =============================================
-- SET CURRENT USER AS ADMIN
-- =============================================
-- Run this in Supabase SQL Editor to grant yourself admin access
-- Replace 'your-email@example.com' with your actual email address

-- Option 1: Set admin by email (RECOMMENDED)
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'your-email@example.com';

-- Option 2: Set admin by user ID
-- Uncomment and replace 'your-user-id-here' with your actual user ID
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
-- WHERE id = 'your-user-id-here'::uuid;

-- Option 3: Set the FIRST user as admin (use if you're the only user)
-- Uncomment this if you want to automatically set the oldest user as admin
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
-- WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);

-- Verify the change worked
SELECT
  id,
  email,
  raw_user_meta_data->>'is_admin' as is_admin,
  created_at
FROM auth.users
WHERE (raw_user_meta_data->>'is_admin')::boolean = true;
