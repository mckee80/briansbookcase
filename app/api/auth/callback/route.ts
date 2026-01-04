import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Implement Supabase auth callback
  // This will handle the OAuth callback from Supabase

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Exchange code for session
    // const supabase = createClient();
    // await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to home page
  return NextResponse.redirect(new URL('/', request.url));
}
