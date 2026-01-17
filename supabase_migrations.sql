-- Brian's Bookcase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- =============================================
-- DROP EXISTING TABLES (if they exist)
-- =============================================
DROP TABLE IF EXISTS public.ebooks CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;

-- =============================================
-- EBOOKS TABLE
-- =============================================
CREATE TABLE public.ebooks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT,
  cover_image TEXT,
  page_count INTEGER,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ebooks
CREATE POLICY "Anyone can view ebooks"
  ON public.ebooks
  FOR SELECT
  USING (true);

-- Only authenticated users can insert ebooks (admins will be controlled by app logic)
CREATE POLICY "Authenticated users can insert ebooks"
  ON public.ebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update ebooks
CREATE POLICY "Authenticated users can update ebooks"
  ON public.ebooks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete ebooks
CREATE POLICY "Authenticated users can delete ebooks"
  ON public.ebooks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ebooks_author ON public.ebooks(author);
CREATE INDEX IF NOT EXISTS idx_ebooks_genre ON public.ebooks(genre);
CREATE INDEX IF NOT EXISTS idx_ebooks_year ON public.ebooks(year);

-- =============================================
-- AUTHORS TABLE
-- =============================================
CREATE TABLE public.authors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  email TEXT,
  bio TEXT,
  photo_url TEXT,
  books_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read authors
CREATE POLICY "Anyone can view authors"
  ON public.authors
  FOR SELECT
  USING (true);

-- Only authenticated users can insert authors
CREATE POLICY "Authenticated users can insert authors"
  ON public.authors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update authors
CREATE POLICY "Authenticated users can update authors"
  ON public.authors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete authors
CREATE POLICY "Authenticated users can delete authors"
  ON public.authors
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_authors_name ON public.authors(name);

-- =============================================
-- FUNCTION: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_ebooks_updated_at ON public.ebooks;
CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_authors_updated_at ON public.authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON public.authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT INITIAL DATA
-- =============================================

-- Insert initial ebooks
INSERT INTO public.ebooks (title, author, genre, year, description, cover_image, page_count, download_url)
VALUES
  (
    'The Silent Echo',
    'Sarah Mitchell',
    'Contemporary Fiction',
    2023,
    'A powerful story about finding hope in the darkest moments.',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    342,
    '/downloads/silent-echo.epub'
  ),
  (
    'Whispers of Tomorrow',
    'David Chen',
    'Drama',
    2022,
    'An inspiring tale of resilience and human connection.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    298,
    '/downloads/whispers-tomorrow.epub'
  ),
  (
    'Beyond the Horizon',
    'Maria Rodriguez',
    'Literary Fiction',
    2023,
    'A beautifully written narrative about healing and friendship.',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    411,
    '/downloads/beyond-horizon.epub'
  ),
  (
    'The Lighthouse Keeper''s Song',
    'James Patterson',
    'Fiction',
    2021,
    'A heartwarming story of redemption and community support.',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    367,
    '/downloads/lighthouse-song.epub'
  )
ON CONFLICT DO NOTHING;

-- Insert initial authors
INSERT INTO public.authors (name, email, books_count)
VALUES
  ('Sarah Mitchell', 'sarah@example.com', 1),
  ('David Chen', 'david@example.com', 1),
  ('Maria Rodriguez', 'maria@example.com', 1),
  ('James Patterson', 'james@example.com', 1)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- FUNCTION: Sync author book counts
-- =============================================
CREATE OR REPLACE FUNCTION sync_author_book_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the book count for all authors
  UPDATE public.authors a
  SET books_count = (
    SELECT COUNT(*)
    FROM public.ebooks e
    WHERE e.author = a.name
  )
  WHERE true;  -- Required by PostgreSQL, updates all rows

  RETURN COALESCE(NEW, OLD);  -- Return NEW for INSERT/UPDATE, OLD for DELETE
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update author book counts when ebooks change
DROP TRIGGER IF EXISTS sync_author_count_on_ebook_change ON public.ebooks;
CREATE TRIGGER sync_author_count_on_ebook_change
  AFTER INSERT OR UPDATE OR DELETE ON public.ebooks
  FOR EACH STATEMENT
  EXECUTE FUNCTION sync_author_book_count();

-- =============================================
-- FUNCTION: Get membership tier statistics
-- =============================================
CREATE OR REPLACE FUNCTION get_membership_stats()
RETURNS TABLE (
  tier TEXT,
  count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(
      (auth.users.raw_user_meta_data->>'membership_tier')::TEXT,
      'free'
    ) as tier,
    COUNT(*) as count
  FROM auth.users
  GROUP BY tier
  ORDER BY tier;
END;
$$;

-- =============================================
-- ANALYTICS TABLES
-- =============================================

-- Table to track tier changes
CREATE TABLE public.tier_changes (
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
CREATE TABLE public.account_deletions (
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
CREATE TABLE public.book_activity (
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
