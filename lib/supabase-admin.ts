import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
// Used by webhooks and server routes that need to bypass RLS
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
