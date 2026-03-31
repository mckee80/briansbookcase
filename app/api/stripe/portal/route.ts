import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripeHelpers } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    // Try to get the customer ID from query params (passed from client)
    const customerId = request.nextUrl.searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.redirect(new URL('/account?error=no-subscription', request.url));
    }

    const returnUrl = `${request.nextUrl.origin}/account`;
    const session = await stripeHelpers.createPortalSession(customerId, returnUrl);

    if (!session.url) {
      return NextResponse.redirect(new URL('/account?error=portal', request.url));
    }

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.redirect(new URL('/account?error=portal', request.url));
  }
}
