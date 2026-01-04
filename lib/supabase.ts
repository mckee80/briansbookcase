import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
export const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image_url?: string;
  file_url: string;
  genre: string;
  publication_year: number;
  page_count: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  stripe_price_id?: string;
  in_stock: boolean;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  tier: 'silver' | 'gold' | 'platinum';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  stripe_subscription_id?: string;
}

// Database helper functions
export const dbHelpers = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Get all ebooks
  async getEbooks() {
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Ebook[];
  },

  // Get ebook by ID
  async getEbook(id: string) {
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Ebook;
  },

  // Get all products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  // Get user's active membership
  async getActiveMembership(userId: string) {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data as Membership | null;
  },
};
