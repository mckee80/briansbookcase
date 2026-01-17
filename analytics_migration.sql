-- =============================================
-- ANALYTICS TABLES - ADD TO EXISTING DATABASE
-- =============================================
-- Run this in Supabase SQL Editor to add analytics tracking
-- This will NOT affect your existing data

-- Table to track tier changes
CREATE TABLE IF NOT EXISTS public.tier_changes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_tier TEXT,
  new_tier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tier_changes ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all tier changes
CREATE POLICY "Admins can read all tier changes"
  ON public.tier_changes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Policy: Allow system to insert tier changes
CREATE POLICY "Allow system to insert tier changes"
  ON public.tier_changes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Table to track account deletions
CREATE TABLE IF NOT EXISTS public.account_deletions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT,
  membership_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.account_deletions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all account deletions
CREATE POLICY "Admins can read all account deletions"
  ON public.account_deletions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Policy: Allow system to insert account deletions
CREATE POLICY "Allow system to insert account deletions"
  ON public.account_deletions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Table to track book downloads and sends
CREATE TABLE IF NOT EXISTS public.book_activity (
  id BIGSERIAL PRIMARY KEY,
  ebook_id BIGINT REFERENCES public.ebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('download', 'send')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.book_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all book activity
CREATE POLICY "Admins can read all book activity"
  ON public.book_activity
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Policy: Users can track their own book activity
CREATE POLICY "Users can track their own book activity"
  ON public.book_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to get signups per week
CREATE OR REPLACE FUNCTION get_signups_per_week(weeks_back INTEGER DEFAULT 12)
RETURNS TABLE (
  week_start DATE,
  signup_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE_TRUNC('week', auth.users.created_at)::DATE as week_start,
    COUNT(*) as signup_count
  FROM auth.users
  WHERE auth.users.created_at >= NOW() - (weeks_back || ' weeks')::INTERVAL
  GROUP BY week_start
  ORDER BY week_start DESC;
END;
$$;

-- Function to get tier changes summary
CREATE OR REPLACE FUNCTION get_tier_changes_summary(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  old_tier TEXT,
  new_tier TEXT,
  change_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.old_tier,
    tc.new_tier,
    COUNT(*) as change_count
  FROM public.tier_changes tc
  WHERE tc.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY tc.old_tier, tc.new_tier
  ORDER BY change_count DESC;
END;
$$;

-- Function to get book download stats
CREATE OR REPLACE FUNCTION get_book_download_stats()
RETURNS TABLE (
  ebook_id BIGINT,
  title TEXT,
  author TEXT,
  download_count BIGINT,
  send_count BIGINT,
  total_activity BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as ebook_id,
    e.title,
    e.author,
    COUNT(*) FILTER (WHERE ba.activity_type = 'download') as download_count,
    COUNT(*) FILTER (WHERE ba.activity_type = 'send') as send_count,
    COUNT(*) as total_activity
  FROM public.ebooks e
  LEFT JOIN public.book_activity ba ON ba.ebook_id = e.id
  GROUP BY e.id, e.title, e.author
  ORDER BY total_activity DESC;
END;
$$;

-- =============================================
-- USER MANAGEMENT FUNCTIONS
-- =============================================

-- Function to get all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  membership_tier TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    auth.users.id,
    auth.users.email::TEXT,
    auth.users.email_confirmed_at,
    auth.users.created_at,
    COALESCE(
      (auth.users.raw_user_meta_data->>'membership_tier')::TEXT,
      'Free'
    ) as membership_tier
  FROM auth.users
  ORDER BY auth.users.created_at DESC;
END;
$$;

-- Function to manually verify a user's email (admin only)
CREATE OR REPLACE FUNCTION admin_verify_user_email(user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Update the user's email_confirmed_at timestamp
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_id
  AND email_confirmed_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found or already verified';
  END IF;
END;
$$;
