import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPriceId, stripeHelpers } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tier = searchParams.get('tier');
    const interval = (searchParams.get('interval') || 'month') as 'month' | 'year';
    const customAmount = searchParams.get('customAmount');

    if (!tier) {
      return NextResponse.redirect(new URL('/membership', request.url));
    }

    // Get the authenticated user from the auth cookie
    const accessToken = request.cookies.get('sb-access-token')?.value
      || request.cookies.get(`sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname.split('.')[0]}-auth-token`)?.value;

    // Try to get user from Supabase auth
    let userEmail: string | null = null;
    let userId: string | null = null;

    if (accessToken) {
      try {
        const tokenData = JSON.parse(accessToken);
        const token = Array.isArray(tokenData) ? tokenData[0] : tokenData;
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          userEmail = user.email || null;
          userId = user.id;
        }
      } catch {
        // Token parsing failed, try as raw string
        const { data: { user } } = await supabase.auth.getUser(accessToken);
        if (user) {
          userEmail = user.email || null;
          userId = user.id;
        }
      }
    }

    // Also check for email in query params as fallback (passed from signup)
    if (!userEmail) {
      userEmail = searchParams.get('email');
      userId = searchParams.get('userId');
    }

    if (!userEmail) {
      return NextResponse.redirect(new URL('/login?redirect=/membership', request.url));
    }

    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/membership`;
    const metadata = {
      user_id: userId || '',
      tier: tier.toLowerCase(),
      interval,
    };

    let session;

    if (tier.toLowerCase() === 'custom' && customAmount) {
      const monthlyAmountCents = Math.round(parseFloat(customAmount) * 100);
      if (monthlyAmountCents < 100) {
        return NextResponse.redirect(new URL('/membership?error=amount', request.url));
      }
      // Custom amount is always monthly; multiply by 12 for yearly billing
      const amountCents = interval === 'year' ? monthlyAmountCents * 12 : monthlyAmountCents;
      session = await stripeHelpers.createCustomSubscriptionSession({
        amountCents,
        interval,
        successUrl,
        cancelUrl,
        customerEmail: userEmail,
        metadata,
      });
    } else {
      const priceId = getPriceId(tier, interval);
      if (!priceId) {
        return NextResponse.redirect(new URL('/membership', request.url));
      }
      session = await stripeHelpers.createSubscriptionSession({
        priceId,
        successUrl,
        cancelUrl,
        customerEmail: userEmail,
        metadata,
      });
    }

    if (!session.url) {
      return NextResponse.redirect(new URL('/membership?error=checkout', request.url));
    }

    return NextResponse.redirect(session.url);
  } catch (error: any) {
    console.error('Checkout error:', error?.message || error);
    return NextResponse.redirect(new URL(`/membership?error=checkout&detail=${encodeURIComponent(error?.message || 'unknown')}`, request.url));
  }
}
