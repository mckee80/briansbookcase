-- =============================================
-- READING PROGRESS TABLE - ADD TO EXISTING DATABASE
-- =============================================
-- Run this in Supabase SQL Editor to add reading progress tracking
-- This will NOT affect your existing data

-- Table to track reading progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id BIGINT NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  location VARCHAR(500) NOT NULL,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

-- Enable Row Level Security
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reading progress
CREATE POLICY "Users can view their own reading progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Users can insert their own reading progress
CREATE POLICY "Users can insert their own reading progress"
  ON public.reading_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own reading progress
CREATE POLICY "Users can update their own reading progress"
  ON public.reading_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_ebook_id ON public.reading_progress(ebook_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON public.reading_progress(last_read_at DESC);

-- =============================================
-- UPDATE BOOK_ACTIVITY TABLE
-- =============================================
-- Add 'read' to the existing activity_type constraint
ALTER TABLE public.book_activity
  DROP CONSTRAINT IF EXISTS book_activity_activity_type_check;

ALTER TABLE public.book_activity
  ADD CONSTRAINT book_activity_activity_type_check
  CHECK (activity_type IN ('download', 'send', 'read'));

-- =============================================
-- UPDATE ADMIN ANALYTICS FUNCTION
-- =============================================
-- Update get_book_download_stats to include read activity
DROP FUNCTION IF EXISTS get_book_download_stats();

CREATE OR REPLACE FUNCTION get_book_download_stats()
RETURNS TABLE (
  ebook_id BIGINT,
  title TEXT,
  author TEXT,
  download_count BIGINT,
  send_count BIGINT,
  read_count BIGINT,
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
    COUNT(*) FILTER (WHERE ba.activity_type = 'read') as read_count,
    COUNT(ba.id) as total_activity
  FROM public.ebooks e
  LEFT JOIN public.book_activity ba ON ba.ebook_id = e.id
  GROUP BY e.id, e.title, e.author
  ORDER BY total_activity DESC;
END;
$$;
