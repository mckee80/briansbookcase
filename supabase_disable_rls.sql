-- Temporary: Disable RLS to allow admin operations
-- Run this in Supabase SQL Editor if you're having trouble with deletes

-- Disable RLS on ebooks table
ALTER TABLE public.ebooks DISABLE ROW LEVEL SECURITY;

-- Disable RLS on authors table
ALTER TABLE public.authors DISABLE ROW LEVEL SECURITY;

-- Note: This makes the tables publicly writable
-- In production, you should implement proper RLS policies
-- For now, this allows admin operations to work
