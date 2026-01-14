-- Migration to add bio and photo_url to authors table
-- Run this in your Supabase SQL Editor if the authors table already exists

-- Add bio and photo_url columns to authors table
ALTER TABLE public.authors
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- No need to update existing data - bio and photo_url will be NULL for existing authors
-- Admins can update these through the admin dashboard
